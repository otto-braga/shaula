import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { NavUser } from './nav-user';
import { Link } from '@inertiajs/react';
import AppLogo from './app-logo';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    return (
        <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center justify-end w-full gap-2">
                <Link href={route('public.home')} prefetch className='flex items-center gap-2'>
                    <AppLogo />
                </Link>
                <div className="flex-1"></div>
                <SidebarTrigger className="-ml-1 flex-0" />
                {/* <Breadcrumbs breadcrumbs={breadcrumbs} /> */}
                <div className="flex-0">
                    <NavUser />
                </div>
            </div>
        </header>
    );
}
