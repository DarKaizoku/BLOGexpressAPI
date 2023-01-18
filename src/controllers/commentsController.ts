import { Request, Response } from 'express';
import { CommentsServices } from '../services/commentsServices';

const commentsServices = new CommentsServices();

export class CommentsController {
        //
        async getArticleWithComments(req: Request, res: Response) {
                const articleId: string = req.params.id;

                try {
                        const dataArticle =
                                await commentsServices.getAllCommentsbyArticle(
                                        articleId
                                );

                        if (dataArticle) {
                                res.status(200).json({
                                        status: 'SUCCESS',
                                        message: `voici tous les commentaire de l'article ${articleId}`,
                                        data: dataArticle,
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
}
