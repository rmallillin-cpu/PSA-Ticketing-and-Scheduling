// Minimal, robust Supabase Edge Function for sending emails
import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

console.log("Function 'send-email' (Gmail SMTP) initialized");

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const gmailUser = Deno.env.get('GMAIL_USER');
    const gmailAppPassword = Deno.env.get('GMAIL_APP_PASSWORD');

    if (!gmailUser || !gmailAppPassword) {
      throw new Error('GMAIL_USER or GMAIL_APP_PASSWORD is not set in Supabase Secrets');
    }

    const { recipientEmail, recipientName, subject, body, senderEmail, senderName } = await req.json();

    // Basic validation
    if (!recipientEmail || !subject || !body) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize SMTP Client
    const client = new SmtpClient();
    
    // Connect to Gmail SMTP
    await client.connectTLS({
      hostname: "smtp.gmail.com",
      port: 465,
      username: gmailUser,
      password: gmailAppPassword,
    });

    // Send Email
    await client.send({
      from: gmailUser, // Gmail requires the "from" to be the authenticated user
      fromName: senderName || "PSA Portal",
      to: recipientEmail,
      toName: recipientName,
      subject: subject,
      content: body,
      html: body.split('\n').map((line: string) => `<p>${line}</p>`).join(''),
    });

    await client.close();

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully via Gmail SMTP' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('SMTP Error:', error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})
