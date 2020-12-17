import express, { Request, Response } from 'express';
import userRoute from './user.routes';

const router: express.Router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.send('this is home');
});
router.use('/auth', userRoute);

export default router;
