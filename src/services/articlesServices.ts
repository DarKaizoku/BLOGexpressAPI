import client from '../constant/client';
import { TArticles } from '../types/TArticles';
import { TArticleWithComments } from '../types/TArticleWithComments';

/**
 * Class permettant les envoies de requête vers la db concernant les articles
 * * .allArticles() requête l'accès aux articles
 * * .oneArticle() requête l'accès à un article
 * * .articleComment() requête l'accès à un article, ses commentaires et le nom liés aux commentaires
 * * .postArticle()  requête la création d'un nouvel article
 * * .putArticle() requête la modification d'un article
 * * .selectUserArticle() requête l'id de l'user en fonction de l'article demandé
 * * .deleteArticle() requête la suppression d'un article
 */
export class ArticlesServices {
    /**
     * Requête l'accès aux articles
     * Response : retourne les datas des articles
     */
    async allArticles(): Promise<TArticles[] | undefined> {
        const articles = await client.query(
            'SELECT * FROM articles WHERE deleted_at is null'
        );

        if (articles.rowCount > 0) {
            return articles.rows;
        }

        return undefined;
    }

    /**
     * Requête l'accès à un article via l'id en params
     * Response : retourne les datas de l'article
     */
    async oneArticle(articleId: string): Promise<TArticles | undefined> {
        const askedArticle = await client.query(
            'SELECT * FROM articles WHERE id = $1 AND deleted_at is null',
            [articleId]
        );

        if (askedArticle.rowCount > 0) {
            return askedArticle.rows[0];
        }

        return undefined;
    }

    /**
     * Requête l'accès à l'article via l'id en params ainsi que tout les commentaires lié à lui
     * Response : retourne les datas de l'article, et le name et content des commentaires
     */
    async articleComment(
        articleId: string
    ): Promise<TArticleWithComments | undefined> {
        // Requête le titre de l'article, son contenu, le nom de chaque commentaires, leurs contenus. Une première jointure avec comments pour récupérer le commentaire et une jointure avec users pour recupérer le name du commentaire.
        const askedArticle = await client.query(
            'SELECT titre, articles.content, name, comments.content AS content2 FROM articles JOIN comments ON articles.id = comments.article_id JOIN users ON users.id = comments.user_id WHERE articles.id = $1',
            [articleId]
        );

        if (askedArticle.rowCount > 0) {
            const titreArticle: string = askedArticle.rows[0].titre;
            const contentArticle: string = askedArticle.rows[0].content;
            const dataComments2 = askedArticle.rows.map((data) => {
                return {
                    name: data.name,
                    content_comment: data.content2,
                };
            });
            return {
                title: titreArticle,
                content_article: contentArticle,
                comments: dataComments2,
            };

            /* const dataArticle = {
                titre: askedArticle.rows[0].titre,
                content: askedArticle.rows[0].content,
            };

            const dataComments = askedArticle.rows.map((item) => {
                return {
                    name: item.name,
                    content: item.content2,
                };
            });
            return {
                article: dataArticle,
                comments: dataComments,
            }; */
        }

        return undefined;
    }

    /**
     * Requête l'ajout d'un article
     * Response : retourne les datas de l'article crée
     */
    async postArticle(
        titre: string,
        content: string,
        userId: string
    ): Promise<TArticles | undefined> {
        const postArticle = await client.query(
            'INSERT INTO articles (titre, content, user_id) VALUES ($1, $2, $3) RETURNING *',
            [titre, content, userId]
        );

        if (postArticle.rowCount > 0) {
            return postArticle.rows[0];
        }

        return undefined;
    }

    /**
     * Requête la modification d'un article via son id
     * Response : retourne les datas de l'article modifié
     */
    async putArticle(
        articleId: string,
        titre: string,
        content: string,
        userId: number
    ): Promise<TArticles | undefined> {
        const changes = await client.query(
            'UPDATE articles SET titre = $1, content = $2, date = CURRENT_TIMESTAMP WHERE id = $3 AND user_id = $4 RETURNING *',
            [titre, content, articleId, userId]
        );

        if (changes.rowCount > 0) {
            return changes.rows[0];
        }

        return undefined;
    }

    /**
     * Requête l'id d'un user sur un article
     * Response : retourne le user_id
     */
    async selectUserArticle(articleId: string): Promise<TArticles | undefined> {
        const select = await client.query(
            'SELECT user_id FROM articles WHERE id = $1 AND deleted_at IS NULL',
            [articleId]
        );

        if (select.rowCount > 0) {
            return select.rows[0];
        }

        return undefined;
    }

    /**
     * Requête la modification de l'etat d'un article, visible ou non
     * Response : retourne la data de l'article avec la valeur deleted_at modifié
     */
    async deleteArticle(
        articleId: string,
        userId: number
    ): Promise<TArticles[] | undefined> {
        const del = await client.query(
            'UPDATE articles SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND user_id = $2 RETURNING *',
            [articleId, userId]
        );

        if (del.rowCount) {
            return del.rows[0];
        }

        return undefined;
    }
}
