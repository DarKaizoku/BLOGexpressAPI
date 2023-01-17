import { Router } from 'express';
import { QueryResult } from 'pg';
import client from '../constant/client';
import { ArticlesController } from '../controllers/articlesController';
<<<<<<< HEAD
import { verifyToken } from '../middleware/auth';
=======
>>>>>>> 36e416fdb92a57c38050f402e04f6a2fbbdec340
import { TArticles } from '../types/TArticles';

const articlesRouter = Router();
const articlesController = new ArticlesController();

// changer la valeur de l'id au niveau de articlesServices ligne 33 !!!!!
// changer la valeur de userId au niveau de putArticle ligne 121 !!!!

articlesRouter.get('/', verifyToken, articlesController.getAllArticles);

articlesRouter.get('/:id', articlesController.getOneArticle);

articlesRouter.post('/', articlesController.postArticle);

<<<<<<< HEAD
=======
articlesRouter.put('/:id', articlesController.putArticle);

>>>>>>> 36e416fdb92a57c38050f402e04f6a2fbbdec340
export default articlesRouter;
