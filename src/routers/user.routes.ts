import express from 'express';
import userController from '../controllers/user.controller';

const router: express.Router = express.Router();

router.get('/', userController.user);

export default router;
