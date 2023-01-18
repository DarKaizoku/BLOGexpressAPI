import { Router } from 'express';
import { ArticlesController } from '../controllers/articlesController';
import { verifyToken } from '../middleware/auth';

const articlesRouter = Router();
const articlesController = new ArticlesController();

// Route permettant l'accès à tous les articles
articlesRouter.get('/', articlesController.getAllArticles);

//Route permettant l'accès à un article via son id
articlesRouter.get('/:id', articlesController.getOneArticle);

//Route permettant l'accès à un article via son id ainsi que tout les commentaires qui lui sont rattachés
articlesRouter.get('/:id/comments', articlesController.getArticleComment);

//Route permettant de poster un article, nécessite d'être log
articlesRouter.post('/', verifyToken, articlesController.postArticle);

//Route permettant de modifier un articles via son id, à condition que celui-ci appartienne à la personne log
articlesRouter.put('/:id', verifyToken, articlesController.putArticle);

//Route permettant de supprimer un article via son id, à condition que celui-ci appartienne à la personne log
articlesRouter.delete('/:id', verifyToken, articlesController.deleteArticle);

export default articlesRouter;
