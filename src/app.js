import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use(routes);

app.use((_req, res) => {
  res.status(404).json({ success: false, error: { message: 'Route not found' } });
});

app.use(errorHandler);

export default app;
