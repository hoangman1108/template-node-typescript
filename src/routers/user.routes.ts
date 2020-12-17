import express from 'express';
import UserController from '../controllers/user.controller';

const userController = new UserController();
const router: express.Router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);

export default router;
