
import { Request, Response } from "express";
import { QueryResult } from "pg";
import { ArticlesServices } from "../services/articlesServices";
import { TArticles } from "../types/TArticles";


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
                    status: "ERROR",
                    message: "erreur serveur",
                    data: null
                })
        }
    };

    async getOneArticle(req: Request, res: Response) {

        const articleId = req.params.id

        if (!Number.isNaN(Number(articleId))) {

            try {

                const getOneArticle = await articlesServices.oneArticle(articleId);

                if (getOneArticle === undefined) {

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
                            message: "Voici l'article demandé",
                            data: getOneArticle
                        })
                }
            }
            catch (err) {

                console.log(err);
                res.status(500).json(
                    {
                        status: "ERROR",
                        message: "erreur serveur",
                        data: null
                    })
            }

        } else {

            res.status(404).json(
                {
                    status: "FAIL",
                    message: "Type de donnée attendu incorrect, type attendu Number",
                    data: null
                });
        }
    };

    async postArticle(req: Request, res: Response) {

        const titre: string = req.body.titre;
        const content: string = req.body.content;

        if (titre === undefined || content === undefined) {

            res.status(400).json(
                {
                    status: "FAIL",
                    message: "valeur manquante",
                    data: null
                }
            )
        } else {

            try {

                const postArticle = await articlesServices.postArticle(titre, content); 

                if (postArticle === undefined) {

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
                        message: "Article publié !",
                        data: postArticle
                    }
                ) }
            }
            catch (err) {
                console.log(err);
                res.status(500).json(
                    {
                        status: "ERROR",
                        message: "erreur serveur",
                        data: null
                    }
                )

            }
        }
    };

}