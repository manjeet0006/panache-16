export const concertTicketTemplate = (data) => {
  const { name, ticketCode, quantity } = data;
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container { font-family: sans-serif; padding: 20px; color: #333; }
        .header { font-size: 24px; font-weight: bold; color: #8a2be2; }
        .ticket { font-size: 20px; font-weight: bold; color: #ff5722; }
      </style>
    </head>
    <body>
      <div class="container">
        <p class="header">Your Panache Concert Ticket!</p>
        <p>Hello ${name},</p>
        <p>Get ready for an amazing night! Here is your ticket for the Panache concert.</p>
        <p>You have booked ${quantity} ticket(s).</p>
        <p>Your ticket code is: <span class="ticket">${ticketCode}</span></p>
        <p>Present this code at the entry gate.</p>
        <p>- The Panache Team</p>
      </div>
    </body>
    </html>
  `;
};
