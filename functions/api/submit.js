export async function onRequest(context) {
    const { request, env } = context;

    if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const formData = await request.formData();
        const name = formData.get('name');
        const phone = formData.get('phone');
        const concern = formData.get('concern');

        // Use environment variable if available, otherwise fallback to the provided key
        const RESEND_API_KEY = env.RESEND_API_KEY || 're_Xex4vUBc_QB1d5KPCALPi1fWwcQpbvjCQ';

        const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'ThyroVaidya <onboarding@resend.dev>', // Note: Resend requires a verified domain to change the 'from' email.
                to: 'iamgopalyadav@gmail.com',
                subject: `New Consultation Request: ${name}`,
                html: `
          <h3>New Consultation Request</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>WhatsApp:</strong> ${phone}</p>
          <p><strong>Concern:</strong> ${concern}</p>
          <p><em>Sent from ThyroVaidya Website</em></p>
        `,
            }),
        });

        const data = await resendResponse.json();

        if (resendResponse.ok) {
            return new Response(JSON.stringify({ success: true, id: data.id }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            console.error('Resend Error:', data);
            return new Response(JSON.stringify({ success: false, error: data.message }), {
                status: resendResponse.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

    } catch (error) {
        console.error('Worker Error:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
