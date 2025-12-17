export type Mention = {
    type: string;
    key: string;
    name: string;
    route: string;
}

// export type Mention = {
//     id?: number;

//     mentioner_id?: number;
//     mentioner_type?: string;
//     mentioner_name?: string;

//     mentioned_id?: number;
//     mentioned_type?: string;
//     mentioned_name?: string;

//     created_at?: string;
//     updated_at?: string;
// }

export type MentionQuery = {
    type: string;
    routeName: string;
    query: {
        id: number;
        name: string;
    }[]
}
