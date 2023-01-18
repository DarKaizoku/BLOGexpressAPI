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
        async getComment(id: string) {
                const data = await client.query(
                        'select * from comments where id = $1',
                        [id]
                );

                if (data.rowCount) {
                        return data.rows[0];
                }
                return undefined;
        }
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
        async updateComment(
                user_id: number,
                content: string,
                comment_id: string
        ): Promise<TComments | undefined> {
                const data = await client.query(
                        'UPDATE comments SET content = $2,date=current_timestamp WHERE id = $3 AND user_id = $1 RETURNING *',
                        [user_id, content, comment_id]
                );

                if (data.rowCount > 0) {
                        return data.rows[0];
                }

                return undefined;
        }
}
