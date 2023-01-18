import { Router } from 'express';
import { ArticlesController } from '../controllers/articlesController';
import { verifyToken } from '../middleware/auth';

const articlesRouter = Router();
const articlesController = new ArticlesController();

articlesRouter.get('/', articlesController.getAllArticles);

articlesRouter.get('/:id', articlesController.getOneArticle);

articlesRouter.get('/:id/comments', articlesController.getArticleComment);

articlesRouter.post('/', verifyToken, articlesController.postArticle);

articlesRouter.put('/:id', verifyToken, articlesController.putArticle);

articlesRouter.delete('/:id', verifyToken, articlesController.deleteArticle);

export default articlesRouter;
