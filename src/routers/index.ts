import express from 'express';
import authRouter from './auth.routes';
import userRouter from './user.routes';
import libRouter from './library.routes';
import bookRouter from './book.routes';

class Router {
  private router: express.Router;

  constructor() {
    this.router = express.Router();
  }

  Start() {
    this.router.use('/auth', authRouter);
    this.router.use('/users', userRouter);
    this.router.use('/lib', libRouter);
    this.router.use('/book', bookRouter);
    // /lib/:lib/book
  }

  getRouter() {
    return this.router;
  }
}

export default new Router();
