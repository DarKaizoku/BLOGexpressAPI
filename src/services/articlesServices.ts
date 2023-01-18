import client from '../constant/client';
import { TArticles, TResult } from '../types/TArticles';
import { TArticleWithComments } from '../types/TArticleWithComments';

export class ArticlesServices {
    async allArticles(): Promise<TArticles[] | undefined> {
        const articles = await client.query(
            'SELECT * FROM articles WHERE deleted_at is null'
        );

        if (articles.rowCount > 0) {
            return articles.rows;
        }

        return undefined;
    }

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

    async articleComment(
        articleId: string
    ): Promise<TArticleWithComments | undefined> {
        const askedArticle = await client.query(
            'SELECT titre, articles.content, name, comments.content AS content2 FROM articles JOIN comments ON articles.id = comments.article_id JOIN users ON users.id = comments.user_id WHERE articles.id = $1',
            [articleId]
        );

        if (askedArticle.rowCount > 0) {
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
        }

        return undefined;
    }

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

    async putArticle(
        articleId: string,
        titre: string,
        content: string,
        userId: number
    ): Promise<TArticles | undefined> {
        const changes = await client.query(
            'UPDATE articles SET titre = $1, content = $2,,date=current_timestamp WHERE id = $3 AND user_id = $4 RETURNING *',
            [titre, content, articleId, userId]
        );

        if (changes.rowCount > 0) {
            return changes.rows[0];
        }

        return undefined;
    }

    async selectArticle(articleId: string): Promise<TArticles | undefined> {
        const select = await client.query(
            'SELECT user_id FROM articles WHERE id = $1',
            [articleId]
        );

        if (select.rowCount > 0) {
            return select.rows[0];
        }

        return undefined;
    }

    async deleteArticle(
        articleId: string,
        userId: number
    ): Promise<boolean | undefined> {
        const del = await client.query(
            'UPDATE articles SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND user_id = $2',
            [articleId, userId]
        );

        if (del.rowCount) {
            return true;
        }

        return undefined;
    }
}
