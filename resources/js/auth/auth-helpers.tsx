import { usePage } from "@inertiajs/react";

export function isDevUser(): boolean {
    const { auth } = usePage().props as any;
    return auth.user.role.name === 'dev';
}

export function isAdminUser(): boolean {
    const { auth } = usePage().props as any;
    return auth.user.role.name === 'Coordenador';
}

export function isUser(): boolean {
    const { auth } = usePage().props as any;
    return auth.user.role.name === 'Editor';
}

export function AuthorizationCheck({ children, role_names }: { children: React.ReactNode, role_names: string[] }) {
    const { auth } = usePage().props as any;

    if (role_names.includes(auth.user.role.name)) {
        return <>{children}</>;
    }

    return null;
}