import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import dotenv from 'dotenv';
import passport from './config/passport';
import authRouter from './routes/auth';
import userRouter from './routes/user';
import { authenticateJWT } from './middleware/auth';
import chatbotRouter from './routes/chatbot';
import agentToolRouter from './routes/agent-tool';
import chatRouter from './routes/chat';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// app.use(helmet());
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

// PUBLIC ROUTES FIRST - Chat widget (allow all domains)
app.use('/api/chat', cors({
  origin: true, // Allow all origins for chat widget
  credentials: true
}), chatRouter);

// PROTECTED ROUTES - Apply restricted CORS
app.use('/auth', cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}), authRouter);

app.use('/api/user', cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}), authenticateJWT, userRouter);

app.use('/api/chatbot', cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}), authenticateJWT, chatbotRouter);

app.use('/api/agent-tool', cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}), agentToolRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 