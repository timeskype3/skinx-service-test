import { Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User, { IUserResponse } from '../models/user';
import { CustomRequest } from '../middleware/auth';

export const SECRET_KEY: Secret = 'SkinxSecretKey';

interface jwtUserEncodedProps {
  user: any,
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

const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!(username && password)) {
      res.status(400).send("All input is required");
    }
    const user = await User.findOne({ username }).lean();
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwtUserEncoded({ user })
      const userResponse: IUserResponse = { ...user };
      delete userResponse.password;
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(200).json(userResponse);
      return;
    }
    res.status(401).send("Invalid Credentials");
  } catch (error: unknown) {
    res.status(500).json(error);
    console.log(error);
  }
}

const logout = async (req: Request, res: Response) => {
  const { cookies } = req;
  const jwt = cookies.token;
  if (!jwt) {
    return res.status(401).json('Unauthorized token');
  }
  res.cookie('token', null, {
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
    maxAge: -1,
  });
  res.status(200).send('Logout success');
  return;
}

const getProfile = async (req: Request, res: Response) => {
  const tokenDecoded = (req as CustomRequest).user;
  try {
    const user = await User.findOne({ _id: tokenDecoded.user_id }).lean();
    if (user) {
      const userResponse: IUserResponse = { ...user };
      delete userResponse.password;
      res.status(200).json(userResponse);
    }
  } catch (error: unknown) {
    res.status(500).json(error);
    console.log(error);
  }
}

export default {
  createUser,
  login,
  logout,
  getProfile,
}