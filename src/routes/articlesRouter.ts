import { Router } from "express";
import { QueryResult } from "pg";
import client from "../constant/client";
import { ArticlesController } from "../controllers/articlesController";
import { TArticles } from "../types/TArticles";


const articlesRouter = Router();
const articlesController = new ArticlesController;

// changer la valeur de l'id au niveau de articlesServices ligne 33 !!!!!!

articlesRouter.get('/', articlesController.getAllArticles);

articlesRouter.get('/:id', articlesController.getOneArticle);

articlesRouter.post('/', articlesController.postArticle);


export default articlesRouter;