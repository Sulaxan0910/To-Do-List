import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes';
import authRoutes from './routes/authRoutes';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL;

// Middleware
app.set('trust proxy', true);

const allowedOrigins = [
  'http://localhost:3000',
  'https://transcendent-malasada-81f486.netlify.app',
  CLIENT_URL,
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {

    // Allow non-browser clients (Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS not allowed: ${origin}`));
  },
  credentials: true,
};

// ✅ CORS FIRST
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ✅ THEN body parser
app.use(express.json());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Todo API'
  });
});
let logged = false;

app.use((req, res, next) => {
  if (!logged) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    console.log(`API available at ${baseUrl}/api`);
    console.log(`Health check: ${baseUrl}/api/health`);
    logged = true;
  }
  next();
});


// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});