import crypto from 'crypto';

export const generateTicketCode = (teamId) => {
  // Generates a unique 8-character string based on team ID
  return `PAN-${crypto.createHash('md5').update(teamId).digest('hex').slice(0, 8).toUpperCase()}`;
};