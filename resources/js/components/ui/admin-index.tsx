import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { PaginationProps } from '../pagination/pagination';
import AppLayout from '@/layouts/app-layout';
import { AdminIndexCard } from './admin-index-card';
import { AdminIndexBar } from '../admin-index-bar/admin-index-bar';
import AuxDialogForm from '../aux-form/aux-dialog-form';

export type AdminIndexProps = {
    title: string;
    route_base_name: string;
    index: {
        data: any[];
        meta: PaginationProps;
    };
    is_aux?: boolean;
    has_show?: boolean;
    has_create?: boolean;
    has_edit?: boolean;
    has_delete?: boolean;
};

export function AdminIndex({
    title,
    route_base_name,
    index,
    is_aux = false,
    has_show = true,
    has_create = true,
    has_edit = true,
    has_delete = true,
}: AdminIndexProps) {
    const index_route = `${route_base_name}.index`;
    const create_route = `${route_base_name}.create`;
    const store_route = `${route_base_name}.store`;
    const edit_route = `${route_base_name}.edit`;
    const update_route = `${route_base_name}.update`;
    const show_route = `public.${route_base_name}.show`;

    console.log('has_create', has_create);

    return (
        <AppLayout>
            <Head title={title} />
            <section className="px-4 py-4 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">{title}</h1>
                        { has_create && (
                            is_aux ? (
                                <AuxDialogForm
                                    model={null}
                                    title={title}
                                    route_base_name={route_base_name}
                                />
                            ) : (
                                <Link href={route(create_route)} prefetch>
                                    <Button>Cadastrar</Button>
                                </Link>
                            )
                        )}
                    </div>

                    <AdminIndexBar
                        index_route={index_route}
                        pagination_meta={index.meta}
                    />

                    <div className="grid gap-4 p-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                        {index.data?.map((prop) => (
                            <AdminIndexCard
                                key={prop.uuid}
                                model={prop}
                                route_base_name={route_base_name}
                                edit_route={edit_route}
                                show_route={show_route}
                                is_aux={is_aux}
                                has_show={has_show}
                                has_edit={has_edit}
                                has_delete={has_delete}
                            />
                        ))}
                    </div>

                </div>
            </section>
        </AppLayout>
    );
}
