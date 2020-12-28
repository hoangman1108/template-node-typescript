import express from 'express';
import EnglishController from '../controllers/english.controller';
import validate from '../middlewares/validate';
import englishValidator from '../validations/english.validation';

const router = express.Router();
const englishController = new EnglishController();

router.route('/')
  .post(validate(englishValidator.createEnglish), englishController.createEnglish)
  .get(validate(englishValidator.getEnglishes), englishController.listEnglish);

router.route('/search').post(validate(englishValidator.findEnglish), englishController.findEnglish);

export default router;
