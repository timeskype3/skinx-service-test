import http from 'http';
import express, { Express, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import routes from './routes';

require('./config/database').connect();

dotenv.config();

const app: Express = express();
const PORT = process.env.SERVICE_PORT;
const httpServer = http.createServer(app);

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'origin, x-requested-with, Content-Type ,Accept, Authorization, x-access-token');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, PATCH, DELETE, POST');
    return res.status(200).json({});
  }
  next();
});

app.use('/', routes);

app.use((req: Request, res: Response) => {
  const error = new Error('Page not found');
  return res.status(404).json({
    message: error.message
  });
});

httpServer.listen(PORT, () => console.log(`[server]: Server is running at http://localhost:${PORT}`));