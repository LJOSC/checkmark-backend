import express from 'express';
import env from 'src/configs/envVars';
import rootRouter from 'src/routes';
import Logger from 'src/configs/logger';
import MongooseService from './services/db';
import { ConvertError } from './utils/errors';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import 'src/cron';

// Initialize the logger
const logger = new Logger('index.ts');

// Initialize the express app
const app = express();
app.use(express.json({ limit: '10mb' }));

// cors setup
const corsOptions: CorsOptions = {
  origin: [process.env.FRONTEND_HOST as string],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};
app.use(cors(corsOptions));

// cookie parsing
app.use(cookieParser());

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
