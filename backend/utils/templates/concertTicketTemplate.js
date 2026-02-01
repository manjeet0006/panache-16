export const concertTicketTemplate = (data) => {
  const {
    name,
    eventName,
    artistName,
    ticketCode,
    quantity,
    tier,
    date,
    venue,
  } = data;

  // --- THEME CONFIGURATION ---
  const themes = {
    SILVER: { accent: "#94a3b8", label: "Standard Access", border: "#333", bg: "#111" },
    GOLD: { accent: "#eab308", label: "VIP Lounge", border: "#854d0e", bg: "#1f1206" },
    PLATINUM: { accent: "#22d3ee", label: "Pro / Fan-Pit", border: "#155e75", bg: "#0b1121" }
  };

  const safeTier = tier ? tier.toUpperCase() : "SILVER";
  const currentTheme = themes[safeTier] || themes.SILVER;
  const logoUrl = "https://res.cloudinary.com/duqxp1ejg/image/upload/v1769798057/image_x0m4cb.png";
  const loginUrl = "https://panache-16.vercel.app/login";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Ticket Confirmation</title>
      <style>
        body { margin: 0; padding: 0; background-color: #000000; font-family: Helvetica, Arial, sans-serif; }
        .wrapper { width: 100%; background-color: #000000; padding: 40px 0; }
        .main-table { width: 100%; max-width: 400px; margin: 0 auto; }
        a { text-decoration: none; }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #000000; color: #ffffff;">
      
      <center class="wrapper">
        <table class="main-table" border="0" cellspacing="0" cellpadding="0" align="center">
          
          <tr>
            <td align="center" style="padding-bottom: 20px;">
              <img src="${logoUrl}" width="120" alt="Panache" style="display: block; border: 0;" />
            </td>
          </tr>

          <tr>
            <td style="background-color: #111; border: 1px solid ${currentTheme.border}; border-radius: 16px; overflow: hidden; padding: 30px;">
              
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding-bottom: 20px; border-bottom: 1px solid #333;">
                    <p style="margin: 0; font-size: 16px; font-weight: bold; color: #4ade80; text-transform: uppercase; letter-spacing: 1px;">
                      ✅ Booking Confirmed
                    </p>
                  </td>
                </tr>
              </table>

              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 25px;">
                <tr>
                  <td align="center">
                    <span style="color: ${currentTheme.accent}; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; border: 1px solid ${currentTheme.accent}; padding: 4px 10px; border-radius: 4px;">
                      ${safeTier} • ${currentTheme.label}
                    </span>
                    
                    <h1 style="margin: 15px 0 5px 0; font-size: 24px; font-weight: 900; text-transform: uppercase; color: #ffffff; letter-spacing: -1px;">
                      ${eventName}
                    </h1>
                    
                    <p style="margin: 0 0 20px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; color: #888;">
                      Ft. <span style="color: ${currentTheme.accent};">${artistName}</span>
                    </p>
                  </td>
                </tr>
              </table>

              <div style="background-color: ${currentTheme.bg}; border: 1px dashed ${currentTheme.border}; border-radius: 12px; padding: 20px; text-align: center; margin: 10px 0 25px 0;">
                <p style="margin: 0 0 5px 0; font-size: 10px; text-transform: uppercase; color: #888; letter-spacing: 1px;">Your Entry Code</p>
                <p style="margin: 0; font-size: 28px; font-weight: 900; font-family: monospace; letter-spacing: 2px; color: #fff;">
                  ${ticketCode}
                </p>
              </div>

              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="color: #ccc; font-size: 13px;">
                <tr>
                  <td style="padding-bottom: 8px;"><strong style="color: #fff;">Date:</strong> ${date}</td>
                  <td align="right" style="padding-bottom: 8px;"><strong style="color: #fff;">Admit:</strong> ${quantity}</td>
                </tr>
                <tr>
                  <td style="padding-bottom: 8px;"><strong style="color: #fff;">Venue:</strong> ${venue}</td>
                  <td align="right" style="padding-bottom: 8px;"><strong style="color: #fff;">User:</strong> ${name}</td>
                </tr>
              </table>

              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 25px; background-color: #220505; border-radius: 8px;">
                <tr>
                  <td style="padding: 12px; text-align: center;">
                    <p style="margin: 0; font-size: 11px; font-weight: bold; color: #ef4444; text-transform: uppercase; letter-spacing: 0.5px;">
                      ⚠ Valid for One-Time Entry Only
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <tr>
            <td align="center" style="padding-top: 25px;">
              <a href="${loginUrl}" style="background-color: #fff; color: #000; font-size: 12px; font-weight: bold; padding: 12px 24px; border-radius: 50px; display: inline-block;">
                Download Ticket in App
              </a>
              <p style="margin-top: 20px; color: #555; font-size: 10px;">
                Panache 2026 Automated System
              </p>
            </td>
          </tr>

        </table>
      </center>
    </body>
    </html>
  `;
};