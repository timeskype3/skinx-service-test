import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../controllers/users'

export interface CustomRequest extends Request {
  user: any
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send("A token is required for authentication")
  }
  try {
    const decode = jwt.verify(token, SECRET_KEY);
    (req as CustomRequest).user = decode;
  } catch (error: unknown) {
    return res.status(401).send('Invalid Token');
  }
  return next();
}

export default verifyToken;