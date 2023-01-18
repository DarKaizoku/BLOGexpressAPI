import { timeStamp } from 'console';
import { Request, Response } from 'express';
import { ArticlesServices } from '../services/articlesServices';

const articlesServices = new ArticlesServices();

/**
 * Class permettant le contrôle des données entrantes pour les requête articles
 * * **.getAllArticles()** : Contrôle préalable à la récupération de tous les articles
 * * **.getOneArticle()** : Contrôle préalable à la récupération d'un article via son id
 * * **.getArticleComment()** : Contrôle préalable à la récupération d'un article via son id ainsi que les commentaires liés
 * * **.postArticle()** : Contrôle préalable à l'ajout d'un nouvel article
 * * **.putArticle()** : Contrôle préalable à la modification d'un article
 * * **.deleteArticle()** : Contrôle préalable à la suppression d'un article
 */

export class ArticlesController {
    /**
     * Vérification de l'existence d'article et leurs affichages
     * * Response.data retourne les articles complets
     */
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

    /**
     * Vérification de l'existence d'un article et son affichage
     * * Request : id de l'article
     * * Response : retourne l'article demandé
     */
    async getOneArticle(req: Request, res: Response) {
        const articleId = req.params.id;

        if (Number.isNaN(Number(articleId))) {
            return res.status(404).json({
                status: 'FAIL',
                message:
                    'Type de donnée attendu incorrect, type attendu Number',
                data: null,
            });
        }

        try {
            const article = await articlesServices.oneArticle(articleId);

            if (article === undefined) {
                res.status(404).json({
                    status: 'FAIL',
                    message: 'Aucun article trouvé',
                    data: null,
                });
            } else {
                res.status(200).json({
                    status: 'SUCCESS',
                    message: "Voici l'article demandé",
                    data: article,
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

    /**
     * Vérification de l'existence d'un article, son affichage et l'affichage des commentaires liés
     * * Request : id de l'article
     * * Response : retourne l'article demandé et les commentaires liés
     */
    async getArticleComment(req: Request, res: Response) {
        const articleId = req.params.id;

        if (Number.isNaN(Number(articleId))) {
            return res.status(404).json({
                status: 'FAIL',
                message:
                    'Type de donnée attendu incorrect, type attendu Number',
                data: null,
            });
        }

        try {
            const getOneArticle = await articlesServices.articleComment(
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
    }

    /**
     * Vérification des données en entré de la requête avant la création.
     * * Request : titre de l'article (body), content de l'article (body), l'id de l'utilisateur qui post (token)
     * * Response : retourne l'article crée
     */
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
                const postArticle = await articlesServices.postArticle(
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

    /**
     * Vérification de l'existence de l'article, vérification des données en entré de la requête avant la modification.
     * * Request : id de l'article, titre de l'article (body), content de l'article (body), l'id de l'utilisateur qui modifi (token)
     * * Response : retourne l'article modifié
     */
    async putArticle(req: Request, res: Response) {
        const articleId: string = req.params.id;
        const titre: string = req.body.titre;
        const content: string = req.body.content;
        const userId: number = req.body.user_id;

        if (Number.isNaN(Number(articleId))) {
            return res.status(404).json({
                status: 'FAIL',
                message:
                    'Type de donnée attendu incorrect, type attendu Number',
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
            const selectArticle = await articlesServices.selectArticle(
                articleId
            );

            if (!selectArticle) {
                res.status(404).json({
                    status: 'FAIL',
                    message: 'Aucun article ne correspond à cet id',
                    data: null,
                });
                return;
            }

            if (userId !== selectArticle.user_id) {
                res.status(403).json({
                    status: 'fail',
                    message: "Vous n'avez pas accès à cet article",
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

    /**
     * Vérification de l'existence de l'article, suppression de l'article et des commentaires liés
     * * Request : id de l'article, l'id de l'utilisateur qui supprime (token)
     * * Response : retourne le message de confirmation de suppression
     */
    async deleteArticle(req: Request, res: Response) {
        const articleId: string = req.params.id;
        const userId: number = req.body.user_id;

        if (Number.isNaN(Number(articleId))) {
            return res.status(400).json({
                status: 'FAIL',
                message:
                    'Type de donnée attendu incorrect, type attendu Number',
                data: null,
            });
        }

        try {
            const selectArticle = await articlesServices.selectArticle(
                articleId
            );

            if (!selectArticle) {
                res.status(404).json({
                    status: 'FAIL',
                    message: 'Aucun article ne correspond à cet id',
                    data: null,
                });
                return;
            }

            if (userId !== selectArticle.user_id) {
                res.status(403).json({
                    status: 'fail',
                    message: "Vous n'avez pas accès à cet article",
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
