import { Router } from "express";
import { QueryResult } from "pg";
import client from "../constant/client";
import { ArticlesController } from "../controllers/articlesController";
import { TArticles } from "../types/TArticles";


const articlesRouter = Router();
const articlesController = new ArticlesController;


articlesRouter.get('/', articlesController.getAllArticles);

/* articlesRouter.get('/:id', (req, res) => {

    const articleId = req.params.id

    const 



}) */

export default articlesRouter;