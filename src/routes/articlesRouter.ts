import { Router } from 'express';
import { ArticlesController } from '../controllers/articlesController';
import { verifyToken } from '../middleware/auth';

const articlesRouter = Router();
const articlesController = new ArticlesController();

// changer la valeur de l'id au niveau de articlesServices ligne 33 !!!!!
// changer la valeur de userId au niveau de putArticle ligne 121 !!!!

articlesRouter.get('/', articlesController.getAllArticles);

articlesRouter.get('/:id', verifyToken, articlesController.getOneArticle);

articlesRouter.post('/', articlesController.postArticle);

articlesRouter.put('/:id', articlesController.putArticle);

articlesRouter.delete('/:id', articlesController.deleteArticle);

export default articlesRouter;
