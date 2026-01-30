import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import { eventRegistrationTemplate } from './templates/eventRegistrationTemplate.js';
import { concertTicketTemplate } from './templates/concertTicketTemplate.js';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const templates = {
  eventRegistration: eventRegistrationTemplate,
  concertTicket: concertTicketTemplate,
};

const sendEmail = async (to, subject, templateName, data) => {
  const template = templates[templateName];
  if (!template) {
    throw new Error(`Template '${templateName}' not found.`);
  }

  const html = template(data);
  // Simple text version
  const text = html.replace(/<[^>]+>/g, ''); 

  const msg = {
    to,
    from: 'manjeetsingh.muz98@gmail.com', // 👈 Update this to your verified SendGrid sender
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
};

export default sendEmail;