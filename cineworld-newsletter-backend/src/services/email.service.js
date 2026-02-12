const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendConfirmationEmail = async (email, token) => {
  const confirmUrl = `${process.env.CLIENT_URL}/newsletter-confirm/${token}`;

  const htmlTemplate = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Confirm Your Subscription</title>
  </head>
  <body style="margin:0;padding:0;background-color:#0f0f0f;font-family:Arial,sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">
          
          <table width="600" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:12px;overflow:hidden;box-shadow:0 0 20px rgba(0,0,0,0.6);">
            
            <!-- Header -->
            <tr>
              <td style="background:#db0000;padding:20px;text-align:center;">
                <h1 style="color:#ffffff;margin:0;font-size:26px;letter-spacing:1px;">
                  🎬 CINEWORLD
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:40px;color:#ffffff;text-align:center;">
                <h2 style="margin-top:0;">Confirm Your Subscription</h2>
                <p style="color:#cccccc;font-size:15px;line-height:1.6;">
                  Thanks for subscribing to CineWorld!  
                  Please confirm your email to start receiving updates on
                  trending movies, top TV shows, and exclusive content.
                </p>

                <!-- Button -->
                <a href="${confirmUrl}" 
                   style="display:inline-block;margin-top:25px;padding:14px 30px;
                          background:#db0000;color:#ffffff;text-decoration:none;
                          border-radius:50px;font-weight:bold;font-size:14px;">
                  Confirm Email
                </a>

                <p style="margin-top:30px;color:#888;font-size:12px;">
                  This link will expire in 24 hours.
                </p>

                <p style="margin-top:15px;color:#555;font-size:11px;">
                  If the button doesn't work, copy and paste this link into your browser:
                </p>

                <p style="word-break:break-all;color:#999;font-size:11px;">
                  ${confirmUrl}
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#111;padding:20px;text-align:center;color:#666;font-size:12px;">
                © ${new Date().getFullYear()} CineWorld  
                <br/>
                Bringing cinema closer to you 🍿
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;

  await transporter.sendMail({
    from: `"CineWorld 🎬" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🎬 Confirm Your CineWorld Subscription',
    html: htmlTemplate
  });
};
