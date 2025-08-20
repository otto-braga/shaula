import { NavBar } from '@/components/public/ui/nav-bar';
import { Head } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface PublicLayoutProps {
    children: ReactNode;
    head?: string;
}

export default ({ children, head }: PublicLayoutProps) => (
    <>
        <Head title={head ?? 'SHAULA'} />
        <div className="flex min-h-screen flex-col">
            <NavBar />
            <main className="mt-16 flex-1">{children}</main>
            <div className="mt-6 w-full border-t p-12"></div>
        </div>
    </>
);
