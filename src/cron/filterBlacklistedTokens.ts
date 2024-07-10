import { schedule } from 'node-cron';
import Logger from 'src/configs/logger';
import { filterBlackListTokens } from 'src/routes/user/user.dao';

const logger = new Logger('filterBlacklistedTokens.ts');

// Clean up the expired blacklisted tokens every day at 2:00 AM
schedule('0 2 * * *', async () => {
  try {
    await filterBlackListTokens();
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
    } else {
      logger.error('An unknown error occurred.');
    }
  }
});
