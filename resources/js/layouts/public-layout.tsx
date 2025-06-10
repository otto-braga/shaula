import { NavBar } from '@/components/public/ui/nav-bar';
import SearchBar from '@/components/public/ui/search-bar';
import { Head } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface PublicLayoutProps {
    children: ReactNode;
    head?: string;
}

export default ({ children, head }: PublicLayoutProps) => (
    <>
        <Head title={head ?? 'SHAULA'} />
        <div className="">
            <NavBar />
            <main className="mt-16">
                <SearchBar />
                {children}
            </main>
        </div>
    </>
);
