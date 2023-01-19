import { Request, Response } from 'express';
import { CommentsServices } from '../services/commentsServices';

const commentsServices = new CommentsServices();

export class CommentsController {
        //
        async getArticleWithComments(req: Request, res: Response) {
                const articleId: string = req.params.id;

                try {
                        const dataComment =
                                await commentsServices.getAllCommentsbyArticle(
                                        articleId
                                );

                        if (dataComment) {
                                res.status(200).json({
                                        status: 'SUCCESS',
                                        message: `voici tous les commentaire de l'article ${articleId}`,
                                        data: dataComment,
                                });
                        } else {
                                res.status(404).json({
                                        status: 'FAIL',
                                        message: `Pas d'article numéro : ${articleId}`,
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

        async postComment(req: Request, res: Response) {
                const user_id: string = req.body.user_id;
                const content: string = req.body.content;
                const article_id: string = req.params.id;

                if (article_id === undefined || content === undefined) {
                        res.status(400).json({
                                status: 'FAIL',
                                message: 'valeur manquante',
                                data: null,
                        });
                } else {
                        try {
                                const dataComment =
                                        await commentsServices.addComment(
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

        async putComment(req: Request, res: Response) {
                const user_id: string = req.body.user_id;
                const content: string = req.body.content;
                const comment_id: string = req.params.id;
                const admin: boolean = req.body.admin;

                if (Number.isNaN(Number(comment_id))) {
                        return res.status(404).json({
                                status: 'FAIL',
                                message: 'Type de donnée attendu incorrect, type attendu Number',
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
                        const dataComment = await commentsServices.getComment(
                                comment_id
                        );

                        if (!dataComment) {
                                res.status(404).json({
                                        status: 'FAIL',
                                        message: 'Aucun commentaire ne correspond à cet id',
                                        data: null,
                                });
                                return;
                        }

                        if (user_id === dataComment.user_id || admin) {
                                const dataUpdated =
                                        await commentsServices.updateComment(
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
                        } else {
                                res.status(403).json({
                                        status: 'fail',
                                        message: "Vous n'avez pas accès à ce commentaire",
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

        async deleteComment(req: Request, res: Response) {
                const user_id: string = req.body.user_id;
                const comment_id: string = req.params.id;
                const admin: boolean = req.body.admin;

                if (Number.isNaN(Number(comment_id))) {
                        return res.status(404).json({
                                status: 'FAIL',
                                message: 'Type de donnée attendu incorrect, type attendu Number',
                                data: null,
                        });
                }

                try {
                        const dataComment = await commentsServices.getComment(
                                comment_id
                        );
                        console.log(dataComment);

                        if (!dataComment) {
                                res.status(404).json({
                                        status: 'FAIL',
                                        message: 'Aucun commentaire ne correspond à cet id',
                                        data: null,
                                });
                                return;
                        }

                        if (user_id === dataComment.user_id || admin) {
                                const dataArchived =
                                        await commentsServices.deleteComment(
                                                comment_id
                                        );

                                if (dataArchived === true) {
                                        res.status(201).json({
                                                status: 'success',
                                                message: 'commentaire supprimé !!',
                                                data: null,
                                        });
                                }
                        } else {
                                res.status(403).json({
                                        status: 'fail',
                                        message: "Vous n'avez pas accès à ce commentaire",
                                        data: null,
                                });
                                return;
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
