import { Router } from 'express';
import { CommentsController } from '../controllers/commentsController';
import { verifyToken } from '../middleware/auth';

const commentsController = new CommentsController();
const commentsRouter = Router();

commentsRouter.get('/:id', commentsController.getArticleWithComments);

commentsRouter.post('/', verifyToken, commentsController.postComment);

commentsRouter.put('/:id', verifyToken, commentsController.putComment);

export default commentsRouter;
