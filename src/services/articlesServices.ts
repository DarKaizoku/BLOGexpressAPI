import client from "../constant/client";
import { QueryResult } from "pg";
import { TArticles } from "../types/TArticles";

export class ArticlesServices {

    async allArticles() : Promise <TArticles[] | undefined> {

        const articles: QueryResult<TArticles> =  await client.query('SELECT * FROM articles');

        if (articles.rowCount > 0) {
            
            return articles.rows ;
        }

        return undefined;
};

    async oneArticle(articleId: string) : Promise <TArticles[] | undefined> {

            const askedArticle = await client.query('SELECT * FROM articles WHERE id = $1', [articleId]);

            if (askedArticle.rowCount > 0) {

                return askedArticle.rows[0];
            }

            return undefined;
        };
}
