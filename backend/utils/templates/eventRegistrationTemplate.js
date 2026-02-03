export const eventRegistrationTemplate = (data) => {
  const { teamName, ticketCode, eventName, teamSize } = data;
  const displayEvent = eventName || "Panache 2026";
  const displaySize = teamSize ? `${teamSize} Members` : "Full Squad";
  
// ✅ YOUR CLOUDINARY LOGO IS HERE
  const logoUrl = "https://res.cloudinary.com/duqxp1ejg/image/upload/v1769798057/image_x0m4cb.png";
  const websiteUrl = "https://panache-16.vercel.app/login"; // Your live website link

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Registration Confirmation</title>
      <style>
        /* Base Resets */
        body { margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
        table { border-collapse: collapse; width: 100%; }
        
        /* Container Styling */
        .wrapper { width: 100%; background-color: #f4f4f5; padding: 40px 0; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        
        /* Header */
        .header { background-color: #ffffff; padding: 40px; text-align: center; border-bottom: 3px solid #f97316; }
        .logo { max-width: 150px; height: auto; margin-bottom: 20px; }
        .header h1 { margin: 0; color: #18181b; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
        .header p { margin: 5px 0 0 0; color: #71717a; font-size: 14px; }

        /* Content */
        .content { padding: 40px; color: #3f3f46; line-height: 1.6; font-size: 16px; }
        .greeting { font-weight: bold; color: #18181b; margin-bottom: 20px; display: block; }
        
        /* Info Table */
        .info-box { background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 6px; margin: 25px 0; overflow: hidden; }
        .info-row td { padding: 12px 20px; border-bottom: 1px solid #e4e4e7; }
        .info-row:last-child td { border-bottom: none; }
        .label { font-weight: 600; color: #71717a; width: 40%; font-size: 14px; }
        .value { font-weight: 700; color: #18181b; font-size: 14px; }

        /* Action Section */
        .action-area { text-align: center; margin-top: 35px; padding-top: 30px; border-top: 1px dashed #e4e4e7; }
        .btn { display: inline-block; background-color: #f97316; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-weight: bold; font-size: 15px; box-shadow: 0 2px 4px rgba(249, 115, 22, 0.2); }
        .btn:hover { background-color: #ea580c; }
        .help-text { font-size: 13px; color: #a1a1aa; margin-top: 15px; }

        /* Footer */
        .footer { background-color: #18181b; padding: 30px; text-align: center; color: #71717a; font-size: 12px; }
        .footer a { color: #f97316; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <table class="email-container" border="0" cellpadding="0" cellspacing="0">
          
          <tr>
            <td class="header">
              <img src="${logoUrl}" alt="Panache Logo" class="logo" />
              <h1>Registration Confirmed</h1>
              <p>Official Entry for Panache Era 2026</p>
            </td>
          </tr>

          <tr>
            <td class="content">
              <span class="greeting">Dear ${teamName},</span>
              
              <p>We are pleased to confirm your registration for <strong>${displayEvent}</strong>. Your team has been successfully added to the official event roster.</p>
              
              <p>Please review your registration details below:</p>

              <table class="info-box" border="0" cellpadding="0" cellspacing="0">
                <tr class="info-row">
                  <td class="label">Event Category</td>
                  <td class="value">${displayEvent}</td>
                </tr>
                <tr class="info-row">
                  <td class="label">Team Name</td>
                  <td class="value">${teamName}</td>
                </tr>
                <tr class="info-row">
                  <td class="label">Participation</td>
                  <td class="value">${displaySize}</td>
                </tr>
                <tr class="info-row">
                  <td class="label">Reference ID</td>
                  <td class="value" style="font-family: monospace; letter-spacing: 1px;">${ticketCode}</td>
                </tr>
              </table>

              <div class="action-area">
                <p style="margin-bottom: 20px; font-weight: bold; color: #18181b;">Download Your Official Pass</p>
                <p style="margin-bottom: 25px; font-size: 14px;">To access the event arena, you must present your digital ticket. Please visit our website to view and save your pass.</p>
                
                <a href="${websiteUrl}" class="btn">Go to Dashboard</a>
                
                <p class="help-text">
                  Navigate to <strong>Home > My Tickets</strong> to download your QR pass.
                </p>
              </div>
            </td>
          </tr>

          <tr>
            <td class="footer">
              <p>&copy; 2026 VGU Jaipur. All rights reserved.</p>
              <p>Vivekananda Global University, Sector 36, NRI Road, Jaipur.</p>
              <p style="margin-top: 10px;">
                <a href="${websiteUrl}">Visit Website</a> • <a href="#">Contact Support</a>
              </p>
            </td>
          </tr>

        </table>
      </div>
    </body>
    </html>
  `;
};