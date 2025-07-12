import { Role } from "./role";

export type User = {
    uuid: string;
    name: string;
    created_at: string;
    updated_at: string;
    role: Role;
}