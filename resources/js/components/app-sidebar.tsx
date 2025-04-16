import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    BookOpen,
    Building2,
    Circle,
    CircleDashed,
    CircleDotDashed,
    Clock,
    ContactRound,
    Folder,
    LayoutGrid,
    PersonStanding,
    Text,
    Transgender,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
        icon: LayoutGrid,
    },
    {
        title: 'Pessoas',
        href: route('person.index'),
        icon: PersonStanding,
    },
    {
        title: 'Obras',
        href: route('artwork.index'),
        icon: Circle,
    },
    {
        title: 'Críticas',
        href: route('review.index'),
        icon: Text,
    },
    {
        title: 'História da Arte',
        href: route('historyArticle.index'),
        icon: BookOpen,
    }
];

const auxNavItems: NavItem[] = [
    {
        title: 'Identades de Gênero',
        href: route('genders.index'),
        icon: Transgender,
    },
    {
        title: 'Atividades',
        href: route('activities.index'),
        icon: ContactRound,
    },
    {
        title: 'Cidades',
        href: route('cities.index'),
        icon: Building2,
    },
    {
        title: 'Linguagens',
        href: route('languages.index'),
        icon: CircleDashed,
    },
    {
        title: 'Períodos Históricos',
        href: route('periods.index'),
        icon: Clock,
    },
    {
        title: 'Categorias',
        href: route('categories.index'),
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
            </SidebarContent>
            <SidebarContent>
                <NavMain items={auxNavItems} title="Auxiliares" />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
