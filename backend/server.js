import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import repoRoutes from './routes/repoRoutes.js';
import qaRoutes from './routes/qaRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/repo', repoRoutes);
app.use('/api/repo', qaRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'GitHub AI Assistant API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
