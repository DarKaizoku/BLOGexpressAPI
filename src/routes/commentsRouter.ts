import { Router } from 'express';
import { CommentsController } from '../controllers/commentsController';
import { verifyToken } from '../middleware/auth';

const commentsController = new CommentsController();
const commentsRouter = Router();

commentsRouter.get('/:id', commentsController.getArticleWithComments);

export default commentsRouter;
