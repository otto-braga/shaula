import DeleteDialog from '@/components/common/delete-dialog';
import { PaginationControls, PaginationProps } from '@/components/pagination/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { HistoryArticle } from '@/types/historyArticle';
import { Head, Link } from '@inertiajs/react';
import { Edit, Eye } from 'lucide-react';

type Props = {
    data: HistoryArticle[];
    meta: PaginationProps;
};

export default function Index({ historyArticles }: { historyArticles: Props }) {
    return (
        <AppLayout>
            <Head title="Artigos de História" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Artigos de História</h1>
                        <Link href={route('history_articles.create')} prefetch>
                            <Button>Cadastrar</Button>
                        </Link>
                    </div>

                    <PaginationControls pagination={historyArticles.meta} className="mt-4" />

                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {historyArticles?.data?.map((historyArticle) => (
                            <Card key={historyArticle.uuid} className="flex flex-col justify-between">
                                <CardHeader>
                                    {historyArticle.primary_image?.path ? (
                                        <img src={`${historyArticle.primary_image.path}`} alt={historyArticle.title} className="mb-3 aspect-square rounded-t object-cover" />
                                    ) : (
                                        <div className="text- mb-3 flex aspect-square items-center justify-center rounded-t bg-gray-800/50 text-white/50">
                                            Sem imagem
                                        </div>
                                    )}
                                    <CardTitle>
                                        <h3 className="line-clamp-1 font-semibold">{historyArticle.title}</h3>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div>
                                        <p className="text-sm">Autores</p>
                                        <p>{historyArticle.authors.map((author) => author.name).join(', ')}</p>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <div className="mt-2 flex w-full justify-end gap-2">
                                        <DeleteDialog
                                            resourceId={historyArticle.uuid}
                                            resourceName={historyArticle.title}
                                            deleteRoute="history_articles.destroy"
                                            onSuccess={() => window.location.reload()}
                                        />
                                        <Link href={route('history_articles.edit', { historyArticle: historyArticle })}>
                                            <Button variant={'secondary'}>
                                                <Edit className="h-5 w-5" />
                                            </Button>
                                        </Link>
                                        <Link href={route('history_articles.show', { id: historyArticle.uuid })}>
                                            <Button variant={'secondary'}>
                                                <Eye className="h-5 w-5" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    <PaginationControls pagination={historyArticles.meta} className="mt-4" />

                </div>
            </section>
        </AppLayout>
    );
}
