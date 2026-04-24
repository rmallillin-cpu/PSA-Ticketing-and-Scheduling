// Minimal, robust Supabase Edge Function for sending emails
import { serve } from "https://deno.land/std@0.131.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

console.log("Function 'send-email' initialized");

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY');
    if (!sendgridApiKey) {
      throw new Error('SENDGRID_API_KEY is not set in Supabase Secrets');
    }

    const { recipientEmail, recipientName, subject, body, senderEmail, senderName } = await req.json();

    // Basic validation
    if (!recipientEmail || !subject || !body || !senderEmail) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format HTML
    const htmlBody = body.split('\n').map((line: string) => `<p>${line}</p>`).join('');

    // SendGrid API Call
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendgridApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: recipientEmail, name: recipientName }],
          subject: subject,
        }],
        from: { email: senderEmail, name: senderName },
        content: [
          { type: 'text/plain', value: body },
          { type: 'text/html', value: htmlBody }
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('SendGrid Error:', errorData);
      return new Response(
        JSON.stringify({ success: false, error: 'SendGrid API error', details: errorData }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Function Error:', error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})
