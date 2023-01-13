import express from 'express';
import usersController from './controllers/users';
import postsController from './controllers/posts';

const router = express.Router();

router.get('/test', (req, res) => res.send('Test SkinX Service'));
router.post('/register', usersController.createUser);
router.post('/posts/create', postsController.createPost);

export = router;