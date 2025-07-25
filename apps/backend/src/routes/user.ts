import { Router, Request, Response } from 'express';
import { User } from '@prisma/client';

const userRouter: Router = Router();

userRouter.get('/me', (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  
  const user = req.user as User;
  
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    profilePicture: user.profilePicture,
    createdAt: user.createdAt
  });
});

export default userRouter;