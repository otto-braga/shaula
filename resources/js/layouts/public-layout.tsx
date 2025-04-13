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
        <div>
            <NavBar />
            <main className="mt-16 p-4">{children}</main>
        </div>
    </>
);
