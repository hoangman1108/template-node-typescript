import express from 'express';

import UserController from '../controllers/user.controller';
import validate from '../middlewares/validate';
import { auth } from '../middlewares/auth';
import userValidation from '../validations/user.validation';

const router = express.Router();
const userController = new UserController();
router
  .route('/')
  .post(auth('manageUsers'), validate(userValidation.createUser), userController.createUser)
  .get(auth('getUsers'), validate(userValidation.getUsers), userController.getUsers);

router
  .route('/:userId')
  .get(auth('getUsers'), validate(userValidation.getUser), userController.getUser)
  .patch(auth('manageUsers'), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser);

export default router;

