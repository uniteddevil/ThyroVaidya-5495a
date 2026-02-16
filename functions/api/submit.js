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
                from: 'ThyroVaidya <info@thyrovaidya.com>', // Note: Resend requires a verified domain to change the 'from' email.
                to: ['iamgopalyadav@gmail.com', 'dhruv.dy@gmail.com'],
                subject: `New Consultation Request: ${name}`,
                html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #fafcfb; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0; }
                .header { background: linear-gradient(135deg, #064e3b 0%, #1a5d5a 100%); padding: 32px 24px; text-align: center; }
                .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em; }
                .content { padding: 32px 24px; }
                .lead-label { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
                .lead-value { font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 24px; }
                .footer { background: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0; }
                .footer p { margin: 0; font-size: 12px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; }
                .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; background: #ecfdf5; color: #065f46; font-size: 12px; font-weight: 700; margin-bottom: 16px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>ThyroVaidya</h1>
                </div>
                <div class="content">
                    <div class="badge">New Consultation Request</div>
                    
                    <div class="lead-label">Full Name</div>
                    <div class="lead-value">${name}</div>
                    
                    <div class="lead-label">WhatsApp Number</div>
                    <div class="lead-value">${phone}</div>
                    
                    <div class="lead-label">Primary Concern</div>
                    <div class="lead-value">${concern}</div>
                </div>
                <div class="footer">
                    <p>Clean • Clinical • Conscious</p>
                </div>
            </div>
        </body>
        </html>
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
