import express from 'express';
import LibraryController from '../controllers/library.controller';
import validate from '../middlewares/validate';
import libValidation from '../validations/library.validation';

const router = express.Router();

const libController = new LibraryController();
router.route('/')
  .get(validate(libValidation.getLibs), libController.listLib)
  .post(validate(libValidation.createLib), libController.createLib);

router.route('/:id')
  .delete(validate(libValidation.deleteLib), libController.deleteLib);

export default router;
