type Permission = {
    type: string;
    model: string;
    role: string;
};

export type Role = {
    uuid: string;
    slug: string;
    name: string;
    label: string;
    description: string;
    permissions: Permission[];
    created_at: string;
    updated_at: string;
}