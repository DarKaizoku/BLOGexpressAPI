import { Router } from 'express';
import { CommentsController } from '../controllers/commentsController';
import { verifyToken } from '../middleware/auth';

const commentsController = new CommentsController();
const commentsRouter = Router();

commentsRouter.get('/:id', commentsController.getArticleWithComments);

commentsRouter.post(
        '/article/:id',
        verifyToken,
        commentsController.postComment
);

commentsRouter.put('/:id', verifyToken, commentsController.putComment);

commentsRouter.delete('/:id', verifyToken, commentsController.deleteComment);
export default commentsRouter;
