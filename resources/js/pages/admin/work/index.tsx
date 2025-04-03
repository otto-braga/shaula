import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import DeleteDialog from '@/components/ui/delete-dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Work } from '@/types/work';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Eye } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Produções',
        href: '/admin/work',
    },
];

export default function Index({ works }: { works: { data: Work[] } }) {
    const [isOpen, setIsOpen] = useState(false);
    const [resourceToDelete, setResourceToDelete] = useState<string | null>(null);

    const { delete: destroy, processing, reset, errors, clearErrors } = useForm();

    const deleteResource = () => {
        destroy(route('work.destroy', { id: resourceToDelete }), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        clearErrors();
        reset();
        setIsOpen(false);
    };

    const openModal = () => {
        setIsOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produções" />
            {/* <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div> */}
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="flex justify-end">
                        <Link href={route('work.create')} prefetch>
                            <Button>Cadastrar</Button>
                        </Link>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {works?.data?.map((work) => (
                            <Card key={work.id} className="flex flex-col justify-between">
                                <CardHeader>
                                    <CardTitle>
                                        <h3 className="line-clamp-1 font-semibold">{work.title}</h3>
                                    </CardTitle>
                                    <CardDescription>
                                        <p className="line-clamp-2">{work.description}</p>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div>
                                        <p className="text-sm">Autores</p>
                                        <p>{work.authors.map((author) => author.name).join(', ')}</p>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <div className="mt-2 flex w-full justify-end gap-2">
                                        <DeleteDialog
                                            resourceId={work.id}
                                            resourceName={work.title}
                                            deleteRoute="work.destroy"
                                            onSuccess={() => window.location.reload()}
                                        />
                                        <Link href={route('work.edit', { id: work.id })}>
                                            <Button variant={'secondary'}>
                                                <Edit className="h-5 w-5" />
                                            </Button>
                                        </Link>
                                        <Link href={route('work.show', { id: work.uuid })}>
                                            <Button variant={'secondary'}>
                                                <Eye className="h-5 w-5" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
