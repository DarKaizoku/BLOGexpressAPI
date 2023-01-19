import { Request, Response } from 'express';
import { CommentsServices } from '../services/commentsServices';

const commentsServices = new CommentsServices();

/**
 * Class permettant le contrôle des données entrantes pour les requête articles
 * * **.getArticleWithComments()** : Contrôle préalable à la récupération de tous les commentaires d'un article
 * * **.postComment()** : Contrôle préalable à la création d'un nouveau commentaire
 * * **.putComment()** : Contrôle préalable à la modification d'un commentaire
 */
export class CommentsController {
    /**
     * Vérification de l'existence d'article et leur commentaires
     * * Response.data retourne les commentaires liés à l'article
     */
    async getArticleWithComments(req: Request, res: Response) {
        const articleId: string = req.params.id;

        try {
            const dataArticle = await commentsServices.getArticle(articleId);
            const dataComment = await commentsServices.getAllCommentsbyArticle(
                articleId
            );

            if (!dataArticle) {
                return res.status(404).json({
                    status: 'FAIL',
                    message: 'Aucun article trouvé',
                    data: null,
                });
            }

            if (dataComment) {
                res.status(200).json({
                    status: 'SUCCESS',
                    message: `Voici tous les commentaire de l'article ${articleId}`,
                    data: dataComment,
                });
            } else {
                res.status(404).json({
                    status: 'FAIL',
                    message: `Pas de commentaire pour l'article : ${articleId}`,
                    data: null,
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: 'ERROR',
                message: 'erreur serveur',
                data: null,
            });
        }
    }

    /**
     * Vérification des données en entré avant création
     * * Response.data retourne le commentaire crée
     */
    async postComment(req: Request, res: Response) {
        const user_id = req.body.user_id;
        const content = req.body.content;
        const article_id = req.params.id;

        if (article_id === undefined || content === undefined) {
            res.status(400).json({
                status: 'FAIL',
                message: 'valeur manquante',
                data: null,
            });
        } else {
            try {
                const dataComment = await commentsServices.addComment(
                    user_id,
                    content,
                    article_id
                );

                if (dataComment === undefined) {
                    res.status(404).json({
                        status: 'FAIL',
                        message: 'Aucun commentaire trouvé',
                        data: null,
                    });
                } else {
                    res.status(200).json({
                        status: 'SUCCESS',
                        message: 'Commentaire publié !',
                        data: dataComment,
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
     * Vérification de l'existence du commentaire et des données entrante avant création
     * * Response.data retourne le commentaires modifié
     */
    async putComment(req: Request, res: Response) {
        const user_id = req.body.user_id;
        const content = req.body.content;
        const comment_id = req.params.id;

        if (Number.isNaN(Number(comment_id))) {
            return res.status(404).json({
                status: 'FAIL',
                message:
                    'Type de donnée attendu incorrect, type attendu Number',
                data: null,
            });
        }
        if (content === undefined) {
            return res.status(400).json({
                status: 'FAIL',
                message: 'valeur manquante',
                data: null,
            });
        }

        try {
            const dataComment = await commentsServices.getComment(comment_id);

            if (!dataComment) {
                res.status(404).json({
                    status: 'FAIL',
                    message: 'Aucun commentaire ne correspond à cet id',
                    data: null,
                });
                return;
            }

            if (user_id !== dataComment.user_id) {
                res.status(403).json({
                    status: 'fail',
                    message: "Vous n'avez pas accès à ce commentaire",
                    data: null,
                });
                return;
            }

            const dataUpdated = await commentsServices.updateComment(
                user_id,
                content,
                comment_id
            );

            if (dataUpdated !== undefined) {
                res.status(201).json({
                    status: 'success',
                    message: 'commentaire modifié',
                    data: dataUpdated,
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
     * Vérification de l'existence du commentaire et suppression
     * * Response.data retourne message confirmation de suppression
     */
    async deleteComment(req: Request, res: Response) {
        const user_id: string = req.body.user_id;
        const comment_id: string = req.params.id;

        if (Number.isNaN(Number(comment_id))) {
            return res.status(404).json({
                status: 'FAIL',
                message:
                    'Type de donnée attendu incorrect, type attendu Number',
                data: null,
            });
        }

        try {
            const dataComment = await commentsServices.getComment(comment_id);

            if (!dataComment) {
                res.status(404).json({
                    status: 'FAIL',
                    message: 'Aucun commentaire ne correspond à cet id',
                    data: null,
                });
                return;
            }

            if (user_id !== dataComment.user_id) {
                res.status(403).json({
                    status: 'fail',
                    message: "Vous n'avez pas accès à ce commentaire",
                    data: null,
                });
                return;
            }

            const dataArchived = await commentsServices.deleteComment(
                user_id,
                comment_id
            );
            console.log(dataArchived);

            if (dataArchived) {
                res.status(201).json({
                    status: 'success',
                    message: 'commentaire supprimé !!',
                    data: dataArchived,
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
