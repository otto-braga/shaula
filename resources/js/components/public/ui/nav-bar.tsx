import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import SearchBar from './search-bar';
import AppearanceToggleSidebarHeader from '@/components/appearance-toggle-sidebar-header';
import { Menu } from 'lucide-react';

const navItems: NavItem[] = [
    {
        title: 'Início',
        href: '/',
    },
    {
        title: 'Pessoas',
        href: '/pessoas',
    },
    {
        title: 'Exposições',
        href: '/exposicoes',
    },
    {
        title: 'História',
        href: '/historia/artigos',
    },
    {
        title: 'Crítica',
        href: '/critica',
    },
    {
        title: 'Sobre',
        href: '/sobre',
    },
];

export function NavBar() {
    const page = usePage();
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setShowNavbar(false);
            } else {
                setShowNavbar(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <nav
            className={`fixed inset-x-0 top-0 z-50 flex h-16 w-full max-w-full items-center justify-between border-b border-zinc-200 bg-white px-3 transition-transform duration-300 sm:px-4 md:px-8 dark:border-zinc-800 dark:bg-zinc-950 ${
                showNavbar ? 'translate-y-0' : '-translate-y-full'
            }`}
        >
            <Link href="/" className="min-w-0 shrink-0">
                <img src="/images/logo.webp" alt="SHAULA" className="mb-2 w-24 max-w-full sm:w-32 dark:invert" />
            </Link>

            <div className="flex min-w-0 shrink-0 items-center gap-0.5 sm:gap-1 md:hidden">
                <SearchBar />
                <AppearanceToggleSidebarHeader />
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Menu" className="shrink-0">
                            <Menu />
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                        <SheetHeader className="border-b border-zinc-200 pb-4 dark:border-zinc-800">
                            <div className="flex justify-center">
                                <span className="text-lg font-bold tracking-widest text-zinc-900 uppercase dark:text-zinc-100">
                                    SHAULA
                                </span>
                            </div>
                        </SheetHeader>
                        <div className="mt-6 flex flex-col gap-3 px-4 text-right text-2xl font-medium text-zinc-900 dark:text-zinc-100">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`py-1 transition-colors hover:underline ${
                                        page.url === item.href
                                            ? 'font-bold underline decoration-2 underline-offset-4'
                                            : 'text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white'
                                    }`}
                                >
                                    {item.title}
                                </Link>
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="hidden divide-x divide-zinc-200 text-xl md:flex md:items-center lg:text-2xl dark:divide-zinc-800">
                <div className="flex items-center gap-4 pr-4 lg:gap-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`transition-colors hover:underline ${
                                page.url === item.href
                                    ? 'font-semibold text-black underline decoration-2 underline-offset-4 dark:text-white'
                                    : 'text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white'
                            }`}
                        >
                            {item.title}
                        </Link>
                    ))}
                </div>
                <div className="flex items-center gap-1 pl-3">
                    <SearchBar />
                    <AppearanceToggleSidebarHeader />
                </div>
            </div>
        </nav>
    );
}
