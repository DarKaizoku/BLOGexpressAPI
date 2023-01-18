import { query } from 'express';
import client from '../constant/client';
import { TComments } from '../types/TComments';

export class CommentsServices {
        async getAllCommentsbyArticle(
                article_id: string
        ): Promise<TComments[] | undefined> {
                const data = await client.query(
                        'select * from comments where article_id = $1',
                        [article_id]
                );
                if (data.rowCount) {
                        return data.rows;
                }
                return undefined;
        }

        /* async getArticlebyUser_id(user_id):Promise<TComments | undefined>{
            const data = await client.query('select *')
        } */
        async addComment(
                user_id: string,
                content: string,
                article_id: string
        ): Promise<TComments | undefined> {
                const data = await client.query(
                        'insert into comments (user_id,content,article_id) values ($1,$2,$3) returning *',
                        [user_id, content, article_id]
                );
                if (data.rowCount) {
                        return data.rows[0];
                }
                return undefined;
        }
}
