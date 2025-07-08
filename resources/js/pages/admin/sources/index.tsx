import DeleteDialog from '@/components/common/delete-dialog';
import { PaginationControls, PaginationProps } from '@/components/pagination/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCard } from '@/components/ui/file-card';
import AppLayout from '@/layouts/app-layout';
import { Source } from '@/types/source';
import { Head, Link } from '@inertiajs/react';
import { Edit, Eye } from 'lucide-react';

type Props = {
    data: Source[];
    meta: PaginationProps;
};

export default function Index({ sources }: { sources: Props }) {
    return (
        <AppLayout>
            <Head title="Fontes" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Obras</h1>
                        <Link href={route('sources.create')} prefetch>
                            <Button>Cadastrar</Button>
                        </Link>
                    </div>

                    <PaginationControls pagination={sources.meta} className="mt-4" />

                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {sources?.data?.map((source) => (
                            console.log('source', source),
                            <Card key={source.uuid} className="flex flex-col justify-between">
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
                                            resourceId={source.uuid}
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

                    <PaginationControls pagination={sources.meta} className="mt-4" />

                </div>
            </section>
        </AppLayout>
    );
}
