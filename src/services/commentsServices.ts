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
}
