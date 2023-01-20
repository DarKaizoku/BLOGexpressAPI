export type TArticleWithComments = {
    title: string;
    content_article: string;
    comments: {
        name: string;
        content_comment: string;
    }[];
};
