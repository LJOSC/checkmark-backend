import express from 'express';
import env from 'src/configs/envVars';
import rootRouter from 'src/routes';
import Logger from 'src/configs/logger';
import MongooseService from './services/db';
import { ConvertError } from './utils/errors';

// Initialize the logger
const logger = new Logger('index.ts');

// Initialize the express app
const app = express();
app.use(express.json({ limit: '10mb' }));

// link the rootRouter to the app
app.use('/api', rootRouter);

/**
 * @description Convert error and forward ro ErrorHandlet
 */
app.use(ConvertError);

// Connect with mongoDB
const dbUri = env.MONGODB_URI;

const mongooseService = new MongooseService(dbUri);

// Connect to MongoDB
mongooseService.connect();

const PORT = env.PORT;
app.listen(PORT, () => {
  logger.log(`Server is running on port ${PORT}`);
});
