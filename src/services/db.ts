import mongoose from 'mongoose';
import Logger from 'src/configs/logger';

const logger = new Logger('db.ts');

class MongooseService {
  private dbUri: string;
  private options: mongoose.ConnectOptions;
  private reconnectInterval: number;

  constructor(dbUri: string, options: mongoose.ConnectOptions = {}, reconnectInterval: number = 5000) {
    this.dbUri = dbUri;
    this.options = options;
    this.reconnectInterval = reconnectInterval;

    mongoose.connection.on('connected', () => {
      logger.log('Mongoose connected');
    });

    mongoose.connection.on('error', (err) => {
      logger.error(`Mongoose connection error: ${err?.message}`);
      if (err?.message === 'Authentication failed.') {
        process.exit(1);
      }
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose disconnected. Attempting to reconnect...');
      setTimeout(() => this.reconnect(), this.reconnectInterval);
    });
  }

  public async connect(): Promise<void> {
    try {
      logger.log('Connecting to MongoDB...');
      await mongoose.connect(this.dbUri, this.options);
    } catch (err) {
      logger.error(`Mongoose initial connection error: ${err?.message}`);
    }
  }

  private async reconnect(): Promise<void> {
    try {
      logger.log('Reconnecting to MongoDB...');
      await mongoose.connect(this.dbUri, this.options);
    } catch (err) {
      logger.error(`Mongoose reconnection error: ${err?.message}`);
    }
  }
}

export default MongooseService;
