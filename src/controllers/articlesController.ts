import { Request, Response } from 'express';
import { ArticlesServices } from '../services/articlesServices';
import { RequestWithUserRole } from '../types/TToken';

const articlesServices = new ArticlesServices();

export class ArticlesController {
        async getAllArticles(req: Request, res: Response) {
                try {
                        const articles = await articlesServices.allArticles();

                        if (articles === undefined) {
                                res.status(404).json({
                                        status: 'FAIL',
                                        message: 'Aucun article trouvé',
                                        data: null,
                                });
                        } else {
                                res.status(200).json({
                                        status: 'SUCCESS',
                                        message: 'Voici les articles',
                                        data: articles,
                                });
                        }
                } catch (err) {
                        console.log(err);
                        res.status(500).json({
                                status: 'ERROR',
                                message: 'erreur serveur',
                                data: null,
                        });
                }
        }

        async getOneArticle(req: Request, res: Response) {
                const articleId = req.params.id;

                if (!Number.isNaN(Number(articleId))) {
                        try {
                                const getOneArticle =
                                        await articlesServices.oneArticle(
                                                articleId
                                        );

                                if (getOneArticle === undefined) {
                                        res.status(404).json({
                                                status: 'FAIL',
                                                message: 'Aucun article trouvé',
                                                data: null,
                                        });
                                } else {
                                        res.status(200).json({
                                                status: 'SUCCESS',
                                                message: "Voici l'article demandé",
                                                data: getOneArticle,
                                        });
                                }
                        } catch (err) {
                                console.log(err);
                                res.status(500).json({
                                        status: 'ERROR',
                                        message: 'erreur serveur',
                                        data: null,
                                });
                        }
                } else {
                        res.status(404).json({
                                status: 'FAIL',
                                message: 'Type de donnée attendu incorrect, type attendu Number',
                                data: null,
                        });
                }
        }

        async postArticle(req: Request, res: Response) {
                const titre: string = req.body.titre;
                const content: string = req.body.content;
                const userId: string = req.body.user_id;

                if (titre === undefined || content === undefined) {
                        res.status(400).json({
                                status: 'FAIL',
                                message: 'valeur manquante',
                                data: null,
                        });
                } else {
                        try {
                                const postArticle =
                                        await articlesServices.postArticle(
                                                titre,
                                                content,
                                                userId
                                        );

                                if (postArticle === undefined) {
                                        res.status(404).json({
                                                status: 'FAIL',
                                                message: 'Aucun article trouvé',
                                                data: null,
                                        });
                                } else {
                                        res.status(200).json({
                                                status: 'SUCCESS',
                                                message: 'Article publié !',
                                                data: postArticle,
                                        });
                                }
                        } catch (err) {
                                console.log(err);
                                res.status(500).json({
                                        status: 'ERROR',
                                        message: 'erreur serveur',
                                        data: null,
                                });
                        }
                }
        }

        async putArticle(req: Request, res: Response) {
                const articleId: string = req.params.id;
                const titre: string = req.body.titre;
                const content: string = req.body.content;
                const userId: number = req.body.user_id;

                if (Number.isNaN(Number(articleId))) {
                        return res.status(404).json({
                                status: 'FAIL',
                                message: 'Type de donnée attendu incorrect, type attendu Number',
                                data: null,
                        });
                }
                if (titre === undefined || content === undefined) {
                        return res.status(400).json({
                                status: 'FAIL',
                                message: 'valeur manquante',
                                data: null,
                        });
                }

                try {
                        const selectArticle =
                                await articlesServices.selectArticle(articleId);

                        if (!selectArticle) {
                                res.status(404).json({
                                        status: 'FAIL',
                                        message: 'Aucun ticket ne correspond à cet id',
                                        data: null,
                                });
                                return;
                        }

                        if (userId !== selectArticle.user_id) {
                                res.status(403).json({
                                        status: 'fail',
                                        message: "Vous n'avez pas accès à ce ticket",
                                        data: null,
                                });
                                return;
                        }

                        const changeArticle = await articlesServices.putArticle(
                                articleId,
                                titre,
                                content,
                                userId
                        );

                        if (changeArticle !== undefined) {
                                res.status(201).json({
                                        status: 'success',
                                        message: 'données modifiées',
                                        data: changeArticle,
                                });
                        }
                } catch (err) {
                        console.log(err);
                        res.status(500).json({
                                status: 'FAIL',
                                message: 'erreur serveur',
                                data: null,
                        });
                }
        }

        async deleteArticle(req: Request, res: Response) {
                const articleId: string = req.params.id;
                const userId: number = req.body.user_id;

                if (Number.isNaN(Number(articleId))) {
                        return res.status(404).json({
                                status: 'FAIL',
                                message: 'Type de donnée attendu incorrect, type attendu Number',
                                data: null,
                        });
                }

                try {
                        const selectArticle =
                                await articlesServices.selectArticle(articleId);

                        if (!selectArticle) {
                                res.status(404).json({
                                        status: 'FAIL',
                                        message: 'Aucun ticket ne correspond à cet id',
                                        data: null,
                                });
                                return;
                        }

                        if (userId !== selectArticle.user_id) {
                                res.status(403).json({
                                        status: 'fail',
                                        message: "Vous n'avez pas accès à ce ticket",
                                        data: null,
                                });
                                return;
                        }

                        const delArticle = await articlesServices.deleteArticle(
                                articleId,
                                userId
                        );

                        if (delArticle === true) {
                                res.status(201).json({
                                        status: 'success',
                                        message: 'données supprimées',
                                        data: null,
                                });
                        }
                } catch (err) {
                        console.log(err);
                        res.status(500).json({
                                status: 'FAIL',
                                message: 'erreur serveur',
                                data: null,
                        });
                }
        }
}
