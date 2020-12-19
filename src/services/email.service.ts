import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import EmailTemplates from 'email-templates';
import path from 'path';

import config from '../config/config';
import logger from '../config/logger';

export default class EmailService {
  private transporter: Mail;

  private emailTemplates: EmailTemplates;

  constructor() {
    this.transporter = createTransport(config.email.smtp);
    this.emailTemplates = new EmailTemplates({
      message: {
        from: config.email.smtp.auth.user,
      },
      send: true,
      transport: this.transporter,
    })
    if (config.env !== 'test') {
      this.transporter
        .verify()
        .then(() => logger.info('Connected to email server'))
        .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
    }
  }

  sendEmail = async (to: string, data: any) => {
    // const msg = { from: config.email.from, to, subject, text };
    // await this.transporter.sendMail(msg);
    try {
      await this.emailTemplates.send({
        template: path.join(__dirname, '../', 'templates', '/reset-password'),
        message: {
          to: to,
        },
        locals: {
          data,
        },
      });
      logger.info('Send email success');
    } catch (error) {
      logger.info('MailerService#send.error %o', error);
    }
    // this.transporter.close();
  };

  sendResetPasswordEmail = async (to: string, token: string) => {
    const subject = 'Reset password';
    // replace this url with the link to the reset password page of your front-end app
    const resetPasswordUrl = `http://localhost:3000/auth/reset-password?token=${token}`;
    const text = `Dear user,
    To reset your password, click on this link: ${resetPasswordUrl}
    If you did not request any password resets, then ignore this email.`;
    const data = {
      name: 'nguyen hoang man',
      link: resetPasswordUrl
    }
    await this.sendEmail(to, data);
  };
}