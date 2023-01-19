import { Router } from 'express';
import { CommentsController } from '../controllers/commentsController';
import { verifyToken } from '../middleware/auth';

const commentsController = new CommentsController();
const commentsRouter = Router();

// Route permettant l'accès aux commentaires d'un article en fonction de son id
commentsRouter.get('/:id', commentsController.getArticleWithComments);

// Route permettant de poster un commentaires sur un article pour un user log
commentsRouter.post('/wich/:id', verifyToken, commentsController.postComment);

// Route permettant de modifier un commentaires sur un article si il appartient au user log
commentsRouter.put('/:id', verifyToken, commentsController.putComment);

// Route permettant de supprimer un commentaires si il appartient au user log
commentsRouter.delete('/:id', verifyToken, commentsController.deleteComment);

export default commentsRouter;
