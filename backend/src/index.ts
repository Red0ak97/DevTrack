import express from 'express';
import cors from 'cors';
import technologyRoutes from './routes/technologyRoutes.js';

const app = express();
const PORT = 3000;

app.use(cors());           // ← Добавили CORS
app.use(express.json());

app.use('/api/technologies', technologyRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});