import { query } from 'express';
import client from '../constant/client';
import { TComments } from '../types/TComments';

export class CommentsServices {
        async getAllCommentsbyArticle(
                article_id: string
        ): Promise<TComments[] | undefined> {
                const data = await client.query(
                        'select * from comments where article_id = $1 and deleted_at is null',
                        [article_id]
                );
                if (data.rowCount) {
                        return data.rows;
                }
                return undefined;
        }
        async getComment(id: string) {
                const data = await client.query(
                        'select * from comments where id = $1 and deleted_at is null',
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
                content: string,
                comment_id: string
        ): Promise<TComments | undefined> {
                const data = await client.query(
                        'UPDATE comments SET content = $1,date=current_timestamp WHERE id = $2 RETURNING *',
                        [content, comment_id]
                );

                if (data.rowCount > 0) {
                        return data.rows[0];
                }

                return undefined;
        }
        async deleteComment(comment_id: string) {
                const data = await client.query(
                        'update comments set deleted_at=current_timestamp where id = $1',
                        [comment_id]
                );

                if (data.rowCount) {
                        return true;
                }
                return undefined;
        }
}
