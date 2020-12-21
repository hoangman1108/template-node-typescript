import express from 'express';
import authRouter from './auth.routes';
import userRouter from './user.routes';

class Router {
  private router: express.Router;

  constructor() {
    this.router = express.Router();
  }

  Start() {
    this.router.use('/auth', authRouter);
    this.router.use('/users', userRouter);
  }

  getRouter() {
    return this.router;
  }
}

export default new Router();
