import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Building2,
    Circle,
    CircleDashed,
    CircleDotDashed,
    CircleDotIcon,
    Clock,
    ContactRound,
    FileSpreadsheet,
    Folder,
    FolderArchive,
    FolderClosed,
    LayoutGrid,
    PersonStanding,
    Text,
    Transgender,
    User,
    Workflow,
} from 'lucide-react';
import AppLogo from './app-logo';
import { AuthorizationCheck, isAdminUser, isDevUser } from '@/auth/auth-helpers';

const dashboardNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
        icon: LayoutGrid,
    },
];

const mainNavItems: NavItem[] = [
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
        icon: FileSpreadsheet,
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
        title: 'Prêmios',
        href: route('awards.index'),
        icon: CircleDotDashed
    },
    {
        title: 'Categorias',
        href: route('categories.index'),
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
        icon: User,
    },
];

const footerNavItems: NavItem[] = [
];

export function AppSidebar() {
    const { auth } = usePage().props as any;

    return (
        <Sidebar collapsible="icon" variant="inset">
            {/* <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('public.home')} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader> */}

            {/* <SidebarSeparator /> */}

            <SidebarContent className='mt-2 gap-8'>
                <NavMain items={dashboardNavItems} title="Início" />
                {/* { (isDevUser() || isAdminUser()) && (<>
                    <SidebarSeparator />
                    <NavMain items={adminNavItems} title="Administrativos" />
                </>)} */}
                <AuthorizationCheck role_names={['dev']}>
                    {/* <SidebarSeparator /> */}
                    <NavMain items={adminNavItems} title="Administração"/>
                </AuthorizationCheck>
                {/* <SidebarSeparator /> */}
                <NavMain items={mainNavItems} title="Conteúdo Principal" />
                {/* <SidebarSeparator /> */}
                <NavMain items={auxNavItems} title="Conteúdo Auxiliar" />
            </SidebarContent>

            {/* <SidebarSeparator /> */}

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
