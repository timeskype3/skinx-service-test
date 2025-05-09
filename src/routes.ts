import express from 'express';
import auth from './middleware/auth'
import usersController from './controllers/users';
import postsController from './controllers/posts';

const router = express.Router();

router.get('/test', (req, res) => res.send('Test SkinX Service'));
router.post('/register', usersController.createUser);
router.post('/login', usersController.login);
router.get('/logout', usersController.logout);
router.route('/profile').get(auth, usersController.getProfile);
router.route('/posts').get(auth, postsController.getAllPosts).post(auth, postsController.createPost);
router.route('/posts/:id').get(auth, postsController.getPostById);
router.route('/search/tags').get(auth, postsController.getPostsByTags);

export = router;