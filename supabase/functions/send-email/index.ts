/**
 * Supabase Edge Function: Send Single Email
 * 
 * This function sends a single personalized email using SendGrid
 * 
 * Request body:
 * {
 *   recipientEmail: string
 *   recipientName: string
 *   subject: string
 *   body: string
 *   senderEmail: string
 *   senderName: string
 * }
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const sendgridApiKey = Deno.env.get("SENDGRID_API_KEY");
const sendgridApiUrl = "https://api.sendgrid.com/v3/mail/send";

interface SendEmailRequest {
  recipientEmail: string;
  recipientName: string;
  subject: string;
  body: string;
  senderEmail: string;
  senderName: string;
}

async function validateRequest(req: SendEmailRequest): Promise<{
  valid: boolean;
  error?: string;
}> {
  if (!req.recipientEmail || !req.subject || !req.body) {
    return { valid: false, error: "Missing required fields" };
  }

  if (!req.senderEmail) {
    return { valid: false, error: "Sender email required" };
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(req.recipientEmail)) {
    return { valid: false, error: "Invalid recipient email" };
  }

  if (!emailRegex.test(req.senderEmail)) {
    return { valid: false, error: "Invalid sender email" };
  }

  return { valid: true };
}

async function sendEmailViaSendGrid(req: SendEmailRequest): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  if (!sendgridApiKey) {
    throw new Error("SENDGRID_API_KEY not configured");
  }

  // Format HTML body (convert plain text to HTML)
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
    reply_to: {
      email: req.senderEmail,
      name: req.senderName,
    },
    tracking_settings: {
      click_tracking: {
        enable: true,
      },
      open_tracking: {
        enable: true,
      },
    },
  };

  const response = await fetch(sendgridApiUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${sendgridApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `SendGrid API error: ${response.status} - ${errorText}`
    );
  }

  return {
    success: true,
    message: "Email sent successfully",
  };
}

async function sendEmailViaSmtp(req: SendEmailRequest): Promise<{
  success: boolean;
  message: string;
}> {
  // This is a placeholder for SMTP implementation
  // You could use a Deno SMTP library here
  console.log("SMTP implementation not yet available, using SendGrid");
  return await sendEmailViaSendGrid(req);
}

async function handleSendEmail(req: SendEmailRequest): Promise<Response> {
  try {
    // Validate request
    const validation = await validateRequest(req);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ success: false, error: validation.error }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Send email via SendGrid (can be switched to SMTP)
    const result = await sendEmailViaSendGrid(req);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error in send-email function:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to send email",
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
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { 
      status: 200, 
      headers: corsHeaders 
    });
  }

  try {
    // Only allow POST
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ success: false, error: "Method not allowed" }), 
        {
          status: 405,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const body = await req.json();
    return await handleSendEmail(body);
  } catch (error) {
    console.error("Critical error in serve:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
