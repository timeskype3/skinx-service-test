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

const getAllPosts = async (req: Request, res: Response) => {
  try {
    let limit: number = +(req.query.limit as string) || 10;
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'postedById',
          foreignField: '_id',
          as: 'postedBy',
        }
      },
      {
        $unwind: '$postedBy',
      },
      {
        $project: {
          postedById: 0,
          postedBy: {
            password: 0,
          },
        }
      },
      { $limit: limit },
    ]);
    res.status(200).send(posts);
  } catch (error: unknown) {
    res.status(500).json(error);
  }
}

const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await Post.findOne({ _id: req.params.id })
    if (post) {
      res.status(200).send(post);
    } else {
      res.status(404).send("Post not found");
    }
  } catch (error: unknown) {
    res.status(500).json(error);
  }
}


export default {
  createPost,
  getAllPosts,
  getPostById,
}