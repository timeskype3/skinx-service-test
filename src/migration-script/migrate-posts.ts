import { promises as fsPromises } from 'fs';
import bcrypt from 'bcryptjs';
import Post, { IPost, IPostJsonImport } from '../models/post';
import User from '../models/user';

console.log('Hello from migrate-script');

console.log("Connecting to database...");
require('../config/database').connect();


const readJsonFile = async (path: string) => {
  console.log('Start reading file');
  try {
    const contents = await fsPromises.readFile(path, 'utf-8');
    const data = JSON.parse(contents);
    console.log(`${path.split("/").at(-1)} file read`);
    return data;
  } catch (error: unknown) {
    console.log('Read file error: ', error)
    throw error;
  }
}

const createUsersByPosts = async (
  posts: IPostJsonImport[], passwordDefault: string = '1234'
) => {
  console.log('Start create users');
  try {
    let countUser = 0;
    const postsWithUserId = [];
    const createUser = async (post: IPostJsonImport) => {
      const isDuplicate = await User.find({
        username: post.postedBy?.toLowerCase()
      });
      if (!(isDuplicate.length)) {
        const res = await User.create({
          name: post.postedBy,
          username: post.postedBy?.toLowerCase(),
          password: passwordDefault,
        });
        countUser++;
        return res._id;
      } else {
        return isDuplicate[0]._id;
      }
    }
    for (let i = 0; i < posts.length; i++) {
      const userId = await createUser(posts[i])
      delete posts[i].postedBy
      posts[i].postedById = userId;
      postsWithUserId.push(posts[i])
    }
    console.log(`Create ${countUser} users: Success`);
    return postsWithUserId as IPost[];
  } catch (error: unknown) {
    console.log('CreateUsersByPosts Error: ', error);
    return [];
  }
}

const createPosts = async (posts: IPost[]) => {
  console.log('Start insert posts');
  try {
    await Post.insertMany(posts);
    console.log(`Insert ${posts.length} posts: Success`);
  } catch (error: unknown) {
    console.log('Insert posts Error: ', error);
    process.exit(0);
  }
}

const migratePosts = async () => {
  console.log('Starting migration');
  const saltRounds = 10;
  const path = "./data/posts.json";
  const posts = await readJsonFile(path);
  const passwordDefault = '1234';
  const encryptedPassword = await bcrypt.hash(passwordDefault, saltRounds);
  const postsWihtUserId = await createUsersByPosts(posts, encryptedPassword);
  if (postsWihtUserId.length) {
    await createPosts(postsWihtUserId)
    console.log('Migrate: Success');
    process.exit(0);
  } else {
    console.log('Migrate: Fail');
    process.exit(0);
  }
}

migratePosts()