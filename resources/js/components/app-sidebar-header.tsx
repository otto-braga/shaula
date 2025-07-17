import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Link } from '@inertiajs/react';
import AppLogo from './app-logo';
import AppearanceToggleSidebarHeader from './appearance-toggle-sidebar-header';
import { NavUserSidebarHeader } from './nav-user-sidebar-header';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    return (
        <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center justify-end w-full gap-2">
                <Link href={route('public.home')} prefetch className='flex items-center gap-2'>
                    <AppLogo />
                </Link>

                <div className="flex-1"></div>

                <div className="flex-0">
                    <SidebarTrigger />
                </div>

                {/* cycle between light, dark and system modes */}
                <div className="flex-0">
                    <AppearanceToggleSidebarHeader />
                </div>

                {/* <Breadcrumbs breadcrumbs={breadcrumbs} /> */}
                <div className="flex-0">
                    <NavUserSidebarHeader />
                </div>
            </div>
        </header>
    );
}
