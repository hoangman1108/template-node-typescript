import { Request, Response } from 'express';

class UserController {
  user(req: Request, res: Response) {
    res.send('this is user');
  }
}

export default new UserController();
