import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from '@/components/ui/sidebar';
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
    FolderArchive,
    LayoutGrid,
    PersonStanding,
    Text,
    Transgender,
    Workflow,
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
        href: route('people.index'),
        icon: PersonStanding,
    },
    {
        title: 'Obras',
        href: route('artworks.index'),
        icon: Circle,
    },
    {
        title: 'Críticas',
        href: route('reviews.index'),
        icon: Text,
    },
    {
        title: 'Perodização',
        href: route('periods.index'),
        icon: Clock,
    },
    {
        title: 'Artigos de História',
        href: route('history_articles.index'),
        icon: BookOpen,
    },
    {
        title: 'Fontes',
        href: route('sources.index'),
        icon: Building2,
    },

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
        title: 'Categorias',
        href: route('categories.index'),
        icon: CircleDotDashed,
    },
    {
        title: 'Prêmios',
        href: route('awards.index'),
        icon: Circle
    },
    {
        title: 'Categorias de Fonte',
        href: route('source_categories.index'),
        icon: Folder
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Funções',
        href: route('roles.index'),
        icon: Workflow,
    },
    {
        title: 'Usuários',
        href: route('users.index'),
        icon: PersonStanding,
    },
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('dashboard')} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarSeparator />

            <SidebarContent>
                <NavMain items={mainNavItems} title="Conteúdo" />
            </SidebarContent>

            <SidebarSeparator />

            <SidebarContent>
                <NavMain items={auxNavItems} title="Auxiliares" />
            </SidebarContent>

            <SidebarSeparator />

            <SidebarContent>
                <NavMain items={adminNavItems} title="Administrativos" />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
