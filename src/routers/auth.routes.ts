import express from 'express';
import AuthController from '../controllers/auth.controller';
import validate from '../middlewares/validate';
import authValidation from '../validations/auth.validation';

const authController = new AuthController();
const router: express.Router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', validate(authValidation.logout), authController.logout);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);

export default router;
