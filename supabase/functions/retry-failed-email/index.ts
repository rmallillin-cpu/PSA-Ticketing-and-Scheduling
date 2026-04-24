/**
 * Supabase Edge Function: Retry Failed Emails
 * 
 * This function retries emails that failed to send
 * Called by EmailService.retryFailedEmails()
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const sendgridApiKey = Deno.env.get("SENDGRID_API_KEY");

interface SendEmailRequest {
  recipientEmail: string;
  recipientName: string;
  subject: string;
  body: string;
  senderEmail: string;
  senderName: string;
}

async function sendEmailViaSendGrid(req: SendEmailRequest): Promise<boolean> {
  if (!sendgridApiKey) {
    throw new Error("SENDGRID_API_KEY not configured");
  }

  const htmlBody = req.body
    .split("\n")
    .map((line) => `<p>${line}</p>`)
    .join("");

  const payload = {
    personalizations: [
      {
        to: [
          {
            email: req.recipientEmail,
            name: req.recipientName,
          },
        ],
        subject: req.subject,
      },
    ],
    from: {
      email: req.senderEmail,
      name: req.senderName,
    },
    content: [
      {
        type: "text/html",
        value: htmlBody,
      },
      {
        type: "text/plain",
        value: req.body,
      },
    ],
  };

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${sendgridApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return response.ok;
}

async function handleRetryFailedEmails(): Promise<Response> {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase credentials not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get failed emails with retry count < max
    const { data: failedEmails, error: fetchError } = await supabase
      .from("email_logs")
      .select("*")
      .eq("status", "failed")
      .lt("retry_count", 3)
      .order("created_at", { ascending: true })
      .limit(50);

    if (fetchError) {
      throw fetchError;
    }

    const results = {
      total: failedEmails?.length || 0,
      successful: 0,
      stillFailed: 0,
    };

    if (!failedEmails || failedEmails.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No failed emails to retry",
          results,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Retry each failed email
    for (const log of failedEmails) {
      try {
        const emailReq: SendEmailRequest = {
          recipientEmail: log.recipient_email,
          recipientName: log.recipient_name || "",
          subject: log.subject,
          body: log.message_body,
          senderEmail: log.sender_email,
          senderName: log.sender_name,
        };

        const sent = await sendEmailViaSendGrid(emailReq);

        if (sent) {
          // Update log as sent
          await supabase
            .from("email_logs")
            .update({
              status: "sent",
              sent_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              retry_count: log.retry_count + 1,
              last_retry_at: new Date().toISOString(),
            })
            .eq("id", log.id);

          results.successful++;
        } else {
          throw new Error("SendGrid returned non-OK status");
        }
      } catch (error) {
        console.error(`Error retrying email to ${log.recipient_email}:`, error);

        // Update retry count and error message
        await supabase
          .from("email_logs")
          .update({
            retry_count: log.retry_count + 1,
            error_message: error.message || "Retry failed",
            last_retry_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", log.id);

        results.stillFailed++;
      }

      // Add delay between retries
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Retry completed",
        results,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error("Error in retry-failed-email function:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to retry emails",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Only allow POST
  if (req.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  return await handleRetryFailedEmails();
});
