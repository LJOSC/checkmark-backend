const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';

import dotenv from 'dotenv';

const result = dotenv.config({ path: envFile });
if (result.error) {
  throw result.error;
}

interface env {
  env: string;
  PORT: number;
  MONGODB_URI: string;
  JWT_ACCESS_TOKEN_SECRET: string;
  JWT_REFRESH_TOKEN_SECRET: string;
  OTP_SECRET: string;

  JWT_ACCESS_TOKEN_EXPIRATION?: string;
  JWT_REFRESH_TOKEN_EXPIRATION?: string;

  /* Mailing service */
  SENDER_NAME: string;
  SENDER_EMAIL: string;
  BREVO_API_KEY: string;

  FRONTEND_LOGIN_URL: string;
  BACKEND_URL: string;
}

const env: env = {
  env: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT as string) || 3001,
  MONGODB_URI: process.env.MONGODB_URI as string,
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET as string,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET as string,
  OTP_SECRET: process.env.OTP_SECRET as string,
  JWT_ACCESS_TOKEN_EXPIRATION: '15m',
  JWT_REFRESH_TOKEN_EXPIRATION: '7d',
  SENDER_NAME: process.env.SENDER_NAME as string,
  SENDER_EMAIL: process.env.SENDER_EMAIL as string,
  BREVO_API_KEY: process.env.BREVO_API_KEY as string,
  FRONTEND_LOGIN_URL: process.env.FRONTEND_LOGIN_URL as string,
  BACKEND_URL: process.env.BACKEND_URL as string,
};

export default env;
