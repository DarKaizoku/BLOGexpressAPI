import client from '../constant/client';
import { TArticles } from '../types/TArticles';
import { TComments } from '../types/TComments';

/**
 * Class permettant les envoies de requête vers la db concernant les commentaires
 * * .getAllCommentsbyArticle() requête l'accès aux commentaires d'un article
 * * .getComment() requête l'accès à un commentaire
 * * .addComment() requête l'ajout d'un commentaire à un article
 * * .updateComment() requête la modification d'un commentaire
 * * .deleteComment() requête la modification d'un commentaire pour ne plus l'afficher'
 */

export class CommentsServices {
    /**
     * Requête l'accès aux articles
     * * Response : retourne la data de tout les articles
     */
    async getArticle(article_id: string): Promise<TArticles | undefined> {
        const data = await client.query(
            'SELECT * FROM articles WHERE id = $1 AND deleted_at IS NULL',
            [article_id]
        );
        if (data.rowCount) {
            return data.rows[0];
        }
        return undefined;
    }

    /**
     * Requête l'accès aux commentaires d'un article via son id'
     * * Response : retourne la data de tout les commentaires lié à l'article
     */
    async getAllCommentsbyArticle(
        article_id: string
    ): Promise<TComments[] | undefined> {
        const data = await client.query(
            'SELECT * FROM comments WHERE article_id = $1 AND deleted_at IS NULL',
            [article_id]
        );
        if (data.rowCount) {
            return data.rows;
        }
        return undefined;
    }

    /**
     * Requête l'accès à un commentaire via son id
     * * Response : retourne la data du commentaire
     */
    async getComment(id: string) {
        const data = await client.query(
            'SELECT * FROM comments WHERE id = $1 AND deleted_at IS NULL',
            [id]
        );

        if (data.rowCount) {
            return data.rows[0];
        }
        return undefined;
    }

    /**
     * Requête la création d'un commentaire'
     * * Response : retourne la data du commentaire crée
     */
    async addComment(
        user_id: string,
        content: string,
        article_id: string
    ): Promise<TComments | undefined> {
        const data = await client.query(
            'INSERT INTO comments (user_id,content,article_id) VALUES ($1,$2,$3) RETURNING *',
            [user_id, content, article_id]
        );
        if (data.rowCount) {
            return data.rows[0];
        }
        return undefined;
    }

    /**
     * Requête la modification d'un commentaire via son id'
     * * Response : retourne la data du commentaire modifié
     */
    async updateComment(
        user_id: string,
        content: string,
        comment_id: string
    ): Promise<TComments | undefined> {
        const data = await client.query(
            'UPDATE comments SET content = $2,date = CURRENT_TIMESTAMP WHERE id = $3 AND user_id = $1 RETURNING *',
            [user_id, content, comment_id]
        );

        if (data.rowCount > 0) {
            return data.rows[0];
        }

        return undefined;
    }

    /**
     * Requête la modification de l'etat d'un commentaire, visible ou non
     * * Response : retourne la data du commentaire avec la valeur deleted_at modifié
     */
    async deleteComment(user_id: string, comment_id: string) {
        const data = await client.query(
            'UPDATE comments SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND user_id = $2 RETURNING *',
            [comment_id, user_id]
        );

        if (data.rowCount) {
            return data.rows[0];
        }
        return undefined;
    }
}
