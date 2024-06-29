import env from 'src/configs/envVars';
import { TransactionalEmailsApi, SendSmtpEmail } from '@getbrevo/brevo';
import Logger from 'src/configs/logger';

interface IRecipient {
  email: string;
  name?: string;
}

interface IParams {
  [key: string]: string | number;
}

interface ISendEmailPayload {
  recipients: IRecipient[];
  params: IParams;
  templateId: number;
}

const logger = new Logger('mailing.ts');
let apiInstance = new TransactionalEmailsApi();

apiInstance.setApiKey(0, env.BREVO_API_KEY); // 0 is for apiKey, 1 is for partnerKey

/**
 * Sends an email using the specified template ID.
 *
 * @param {Array | Object} recipients - An array of recipient objects { email: string, name: string }.
 * @param {Object} params - The parameters to replace in the template { key: value }.
 * @param {string | number} templateId - The ID of the email template to use.
 */
const sendEmail = async (args: ISendEmailPayload): Promise<Boolean | void> => {
  const { recipients, params, templateId } = args;
  let sendSmtpEmail = new SendSmtpEmail();

  sendSmtpEmail.templateId = templateId;
  sendSmtpEmail.sender = { name: env.SENDER_NAME, email: env.SENDER_EMAIL };
  sendSmtpEmail.to = recipients;
  sendSmtpEmail.params = params;

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    logger.log(`Email of template ${templateId} sent to: ${JSON.stringify(recipients)}`);
    return true;
  } catch (err) {
    logger.error(`Error sending email: ${err}`);
    return false;
  }
};

export { sendEmail };
