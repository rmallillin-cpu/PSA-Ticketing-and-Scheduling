import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { sendMail } from "https://deno.land/x/smtp@0.8.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

console.log("Function 'send-email' initialized");

async function sendEmailWithResend({ from, to, subject, html }) {
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY is not set in Supabase Secrets');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
    }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to send email via Resend');
  }
  return result;
}

async function sendEmailWithGmail({ from, to, subject, body }) {
  const smtpUser = Deno.env.get('GMAIL_SMTP_USER');
  const smtpPass = Deno.env.get('GMAIL_SMTP_PASS');
  const smtpHost = Deno.env.get('GMAIL_SMTP_HOST') || 'smtp.gmail.com';
  const smtpPort = Number(Deno.env.get('GMAIL_SMTP_PORT') || '587');

  if (!smtpUser || !smtpPass) {
    throw new Error('GMAIL_SMTP_USER and GMAIL_SMTP_PASS are required for Gmail email provider');
  }

  await sendMail({
    hostname: smtpHost,
    port: smtpPort,
    username: smtpUser,
    password: smtpPass,
    from,
    to: [to],
    subject,
    content: body,
    tls: true,
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const provider = (Deno.env.get('EMAIL_PROVIDER') || 'resend').toLowerCase();
    const { recipientEmail, recipientName, subject, body, senderName, senderEmail } = await req.json();

    if (!recipientEmail || !subject || !body) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const fromEmail = senderEmail
      ? `${senderName ? `${senderName} ` : ''}<${senderEmail}>`
      : `PSA Portal <onboarding@resend.dev>`;
    const toEmail = recipientName ? `${recipientName} <${recipientEmail}>` : recipientEmail;
    const htmlBody = body.split('\n').map((line: string) => `<p>${line}</p>`).join('');

    let result;
    if (provider === 'gmail') {
      await sendEmailWithGmail({
        from: fromEmail,
        to: toEmail,
        subject,
        body,
      });
      result = { id: null };
    } else if (provider === 'resend') {
      result = await sendEmailWithResend({
        from: fromEmail,
        to: toEmail,
        subject,
        html: htmlBody,
      });
    } else {
      throw new Error(`Unsupported EMAIL_PROVIDER: ${provider}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully', emailId: result?.id || null }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})