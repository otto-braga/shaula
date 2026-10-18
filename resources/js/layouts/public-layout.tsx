import { Footer } from '@/components/public/ui/footer';
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
        <div className="flex min-h-screen w-full max-w-full flex-col overflow-x-hidden bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
            <NavBar />
            <main className="mt-14 w-full max-w-full min-w-0 flex-1 overflow-x-hidden">{children}</main>
            <Footer />
        </div>
    </>
);

