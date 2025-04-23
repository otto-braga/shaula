export type Mention = {
    id?: number;

    mentioner_id?: number;
    mentioner_type?: string;
    mentioner_name?: string;

    mentioned_id?: number;
    mentioned_type?: string;
    mentioned_name?: string;

    created_at?: string;
    updated_at?: string;
}

export type MentionsByType = {
    type: string;
    type_label: string;
    mentions: Mention[];
}

export type MentionsQuery = {
    type: string;
    type_label: string;
    query: {
        id: number;
        name: string;
    }[]
}
