import Post from '../models/post';
import { Request, Response } from 'express';

const createPost = async (req: Request, res: Response) => {
  try {
    const post = await Post.create(req.body);
    res.status(201).send(post);
  } catch (error: unknown) {
    res.status(500).json(error);
  }
}

export default {
  createPost
}