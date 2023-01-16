
import { Request, Response } from "express";
import { ArticlesServices } from "../services/articlesServices";


const articlesServices = new ArticlesServices;


export class ArticlesController {

    async getAllArticles(req: Request, res: Response) {

        try {

            const articles = await articlesServices.allArticles();

            if (articles === undefined) {

                res.status(404).json(
                    {
                        status: "FAIL",
                        message: "Aucun article trouvé",
                        data: null
                    })

            } else {

                res.status(200).json(
                    {
                        status: "SUCCESS",
                        message: "Voici les articles",
                        data: articles
                    }
                )
            }
        }

        catch (err) {
            console.log(err);
            res.status(500).json(
                {
                    status: "FAIL",
                    message: "erreur serveur",
                    data: null
                })
        }
    }

}