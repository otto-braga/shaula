import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const navItems: NavItem[] = [
    {
        title: 'Início',
        href: '/',
    },
    {
        title: 'Crítica',
        href: '/critica',
    },
    {
        title: 'Pessoas',
        href: '/pessoas',
    },
    {
        title: 'História',
        href: '/historia',
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
            className={`fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-white px-4 transition-transform duration-300 ${
                showNavbar ? 'translate-y-0' : '-translate-y-full'
            }`}
        >
            {/* <div className="text-3xl font-bold">SHAULA</div> */}
            <img src="/images/logo.webp" alt="SHAULA" className="mb-3 w-32" />

            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost">Open</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <div className="flex justify-center">
                                <h1 className="font-bold">SHAULA</h1>
                            </div>
                        </SheetHeader>
                        <div className="flex flex-col gap-1 px-4 text-right text-3xl">
                            {navItems.map((item) => (
                                <Link key={item.href} href={item.href} className={`${page.url === item.href ? 'underline' : ''} hover:underline`}>
                                    {item.title}
                                </Link>
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="hidden space-x-3 text-2xl md:block">
                {navItems.map((item) => (
                    <Link key={item.href} href={item.href} className={`${page.url === item.href ? 'underline' : ''} hover:underline`}>
                        {item.title}
                    </Link>
                ))}
            </div>
        </nav>
    );
}
