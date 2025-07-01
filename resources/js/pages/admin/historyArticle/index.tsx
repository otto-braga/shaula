import DeleteDialog from '@/components/common/delete-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { HistoryArticle } from '@/types/historyArticle';
import { Head, Link } from '@inertiajs/react';
import { Edit, Eye } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Artigos de História',
        href: '/admin/historyArticle',
    },
];

export default function Index({ historyArticles }: { historyArticles: { data: HistoryArticle[] } }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produções" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="flex justify-end">
                        <Link href={route('history_articles.create')} prefetch>
                            <Button>Cadastrar</Button>
                        </Link>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {historyArticles?.data?.map((historyArticle) => (
                            <Card key={historyArticle.uuid} className="flex flex-col justify-between">
                                <CardHeader>
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
                                            resourceId={historyArticle.slug}
                                            resourceName={historyArticle.title}
                                            deleteRoute="historyArticle.destroy"
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
                </div>
            </section>
        </AppLayout>
    );
}
