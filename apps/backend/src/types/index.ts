import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export type AuthenticatedRequest = Request & {
  user: User;
}; 