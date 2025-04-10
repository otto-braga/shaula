import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Building2, CircleDashed, CircleDotDashed, ContactRound, Folder, LayoutGrid, Tag, Text, Transgender } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Produções',
        href: '/admin/work',
        icon: LayoutGrid,
    },
    {
        title: 'Críticas',
        href: '/admin/criticas',
        icon: Text,
    },
];

const auxNavItems: NavItem[] = [
    {
        title: 'Identades de Gênero',
        href: '/admin/generos',
        icon: Transgender,
    },
    {
        title: 'Atividades',
        href: '/admin/atividades',
        icon: ContactRound,
    },
    {
        title: 'Cidades',
        href: '/admin/cidades',
        icon: Building2,
    },
    {
        title: 'Linguagens',
        href: '/admin/linguagens',
        icon: CircleDashed,
    },
    {
        title: 'Tags',
        href: '/admin/tags',
        icon: Tag,
    },
    {
        title: 'Categorias',
        href: '/admin/categorias',
        icon: CircleDotDashed,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} title="Conteúdo" />
                <NavMain items={auxNavItems} title="Auxiliares" />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
