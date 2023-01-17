export type TArticles = {
    id: number;
    titre: string;
    content: string;
    user_id: number;
    date: Date;
};

export type TResult = {
    article: {
        titre: string;
        content: string;
    };
    comments: { name: string; content: string }[];
};
