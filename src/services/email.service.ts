import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import config from '../config/config';
import logger from '../config/logger';

// config.email.smtp
// {
//   pool: true,
//   service: 'Gmail',
//   auth: {
//     user: 'hoangman110898@gmail.com',
//     pass: 'Nhokdepchai123',
//   },
// }
export default class EmailService {
  private transport: Mail;

  constructor() {
    console.log(config.email.smtp);
    this.transport = createTransport(config.email.smtp);
    if (config.env !== 'test') {
      this.transport
        .verify()
        .then(() => logger.info('Connected to email server'))
        .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
    }
  }

  sendEmail = async (to: string, subject: string, text: string) => {
    const msg = { from: config.email.from, to, subject, text };
    await this.transport.sendMail(msg);
  };
  sendResetPasswordEmail = async (to: string, token: string) => {
    const subject = 'Reset password';
    // replace this url with the link to the reset password page of your front-end app
    const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
    const text = `Dear user,
    To reset your password, click on this link: ${resetPasswordUrl}
    If you did not request any password resets, then ignore this email.`;
    await this.sendEmail(to, subject, text);
  };
}