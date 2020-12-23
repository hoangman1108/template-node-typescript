import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import EmailTemplates from 'email-templates';
import path from 'path';
import smtpTransport from 'nodemailer-smtp-transport';

import config from '../config/config';
import logger from '../config/logger';

export default class EmailService {
  private transporter: Mail;

  private emailTemplates: EmailTemplates;

  constructor() {
    console.log(config.email.smtp);
    this.transporter = createTransport(smtpTransport(config.email.smtp));
    this.emailTemplates = new EmailTemplates({
      message: {
        from: config.email.smtp.auth.user,
      },
      send: true,
      transport: this.transporter,
    });
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
        template: path.join(__dirname, '../../', 'templates', '/reset-password'),
        message: {
          to,
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
    const resetPasswordUrl = `http://localhost:3000/auth/reset-password?token=${token}`;
    const data = {
      name: 'nguyen hoang man',
      link: resetPasswordUrl,
    };
    await this.sendEmail(to, data);
  };
}
