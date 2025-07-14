import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { PaginationProps } from '../pagination/pagination';
import AppLayout from '@/layouts/app-layout';
import { AdminIndexCard } from './admin-index-card';
import { AdminIndexBar } from '../admin-index-bar/admin-index-bar';

export type AdminIndexProps = {
    title: string;
    route_base_name: string;
    index_route?: string;
    edit_route?: string;
    show_route?: string;
    index: {
        data: any[];
        meta: PaginationProps;
    };
};

export function AdminIndex(props: AdminIndexProps) {
    const index_route = props.index_route || `${props.route_base_name}.index`;
    const edit_route = props.edit_route || `${props.route_base_name}.edit`;
    const show_route = props.show_route || `public.${props.route_base_name}.show`;

    return (
        <AppLayout>
            <Head title={props.title} />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">{props.title}</h1>
                        <Link href={route('reviews.create')} prefetch>
                            <Button>Cadastrar</Button>
                        </Link>
                    </div>

                    <AdminIndexBar
                        index_route={index_route}
                        pagination_meta={props.index.meta}
                    />

                    <div className="grid gap-4 p-3 md:grid-cols-3">
                        {props?.index.data?.map((prop) => (
                            <AdminIndexCard
                                key={prop.uuid}
                                model={prop}
                                edit_route={edit_route}
                                show_route={show_route}
                            />
                        ))}
                    </div>

                </div>
            </section>
        </AppLayout>
    );
}
