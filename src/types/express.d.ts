import { Request } from 'express';
import { UserDoc, UserDocUnsafe } from 'models/User';

declare global {
  namespace Express {
    interface Request {
      user?: UserDoc; // User object is appended in the middleware
    }
  }
}
