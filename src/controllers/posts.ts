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
    const limit: number = +(req.query.limit as string) || 10;
    const page: number = +(req.query.page as string) || 1;
    let skip: number = 0;
    if (page > 1) {
      skip = (page - 1) * limit;
    }
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
          content: 0,
          postedById: 0,
          postedBy: {
            password: 0,
          },
        }
      },
      { $skip: skip },
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

const getPostsByTags = async (req: Request, res: Response) => {
  let limit: number = +(req.query.limit as string) || 10;
  const page: number = +(req.query.page as string) || 1;
  let skip: number = 0;
  if (page > 1) {
    skip = (page - 1) * limit;
  }
  const tagsString: string = req.query.tags as string || '';
  try {
    const tags = tagsString.split(",");
    const pipline = [
      {
        $match: {
          tags: {
            $all: tags,
          }
        }
      },
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
          content: 0,
          postedById: 0,
          postedBy: {
            password: 0,
          },
        }
      },
      { $skip: skip },
      {
        $limit: limit
      }]
    const posts = await Post.aggregate(pipline);
    if (posts.length) {
      res.status(200).send(posts);
    } else {
      res.status(404).send("Post not found");
    }
  } catch (error: unknown) {
    res.status(500).json('error');
    console.log(error);
  }
}


export default {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByTags,
}