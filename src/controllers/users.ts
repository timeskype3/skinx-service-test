import User, { IUserResponse } from '../models/user';
import { Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const SECRET_KEY: Secret = 'SkinxSecretKey';

interface jwtUserEncodedProps {
  user: any,
  SECRET_KEY: Secret,
  expiresIn?: string,
}

const jwtUserEncoded = ({ user, expiresIn = '24h' }: jwtUserEncodedProps) => {
  return jwt.sign(
    { user_id: user._id, username: user.username, name: user.name },
    SECRET_KEY,
    { expiresIn },
  )
}

const createUser = async (req: Request, res: Response) => {
  const saltRounds = 10;
  try {
    const { name, username, password } = req.body;
    if (!(name && username && password)) {
      return res.status(400).send('All input is required');
    }
    const oldUser = await User.findOne({ username });
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }
    const encryptedPassword = await bcrypt.hash(password, saltRounds);
    req.body.password = encryptedPassword;
    await User.create(req.body);
    res.status(201).send();
  } catch (error: unknown) {
    res.status(500).json(error);
  }
}

export default {
  createUser
}