import { Role } from "./role";

type Permission = {
    type: string;
    model: string;
    role: string;
};

export type User = {
    uuid: string;
    name: string;
    created_at: string;
    updated_at: string;
    roles: Role[];
    permissions: Permission[];
}