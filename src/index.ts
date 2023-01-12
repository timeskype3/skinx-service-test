import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.SERVICE_PORT;

app.post('/', (req: Request, res: Response) => {
  res.send('Test SkinX Service');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});