import DeleteDialog from '@/components/common/delete-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCard } from '@/components/ui/file-card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Source } from '@/types/source';
import { Head, Link } from '@inertiajs/react';
import { Edit, Eye } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Fontes',
        href: '/admin/sources',
    },
];

export default function Index({ sources }: { sources: { data: Source[] } }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produções" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="flex justify-end">
                        <Link href={route('sources.create')} prefetch>
                            <Button>Cadastrar</Button>
                        </Link>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {sources?.data?.map((source) => (
                            console.log('source', source),
                            <Card key={source.id} className="flex flex-col justify-between">
                                <CardHeader>
                                    <FileCard
                                        file={source.file ?? null}
                                        className="h-32 w-full"
                                    />
                                    <CardTitle>
                                        <h3 className="line-clamp-1 font-semibold">{source.title}</h3>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div>
                                        <p>{source.content}</p>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <div className="mt-2 flex w-full justify-end gap-2">
                                        <DeleteDialog
                                            resourceId={source.id}
                                            resourceName={source.title}
                                            deleteRoute="sources.destroy"
                                            onSuccess={() => window.location.reload()}
                                        />
                                        <Link href={route('sources.edit', { source: source })}>
                                            <Button variant={'secondary'}>
                                                <Edit className="h-5 w-5" />
                                            </Button>
                                        </Link>
                                        <Link href={route('sources.show', { source })}>
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
