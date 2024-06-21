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
}

const env: env = {
  env: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT as string) || 3001,
  MONGODB_URI: process.env.MONGODB_URI as string,
};

export default env;
