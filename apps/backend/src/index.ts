import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import session from 'express-session';
import dotenv from 'dotenv';
import passport from './config/passport';
import authRouter from './routes/auth';
import userRouter from './routes/user';
import { authenticateJWT } from './middleware/auth';
import chatbotRouter from './routes/chatbot';
import agentToolRouter from './routes/agent-tool';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req: Request, res: Response) => {
  res.json("welcome");
});

// Routes
app.use('/auth', authRouter);
app.use('/api/user', authenticateJWT, userRouter);
app.use('/api/chatbot', authenticateJWT, chatbotRouter);
app.use('/api/agent-tool', agentToolRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 