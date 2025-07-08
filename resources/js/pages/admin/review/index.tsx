import DeleteDialog from '@/components/common/delete-dialog';
import { PaginationControls, PaginationProps } from '@/components/pagination/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Review } from '@/types/review';
import { Head, Link } from '@inertiajs/react';
import { Edit, Eye } from 'lucide-react';

type Props = {
    data: Review[];
    meta: PaginationProps;
};

export default function Index({ reviews }: { reviews: Props }) {
    console.log('reviews', reviews);

    return (
        <AppLayout>
            <Head title="Crítica" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Críticas</h1>
                        <Link href={route('reviews.create')} prefetch>
                            <Button>Cadastrar</Button>
                        </Link>
                    </div>

                    <PaginationControls pagination={reviews.meta} className="mt-4" />

                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {reviews?.data?.map((review) => (
                            <Card key={review.uuid} className="flex flex-col justify-between">
                                <CardHeader>
                                    {review.primary_image?.path ? (
                                        <img src={`${review.primary_image.path}`} alt={review.title} className="mb-3 aspect-square rounded-t object-cover" />
                                    ) : (
                                        <div className="text- mb-3 flex aspect-square items-center justify-center rounded-t bg-gray-800/50 text-white/50">
                                            Sem imagem
                                        </div>
                                    )}
                                    <CardTitle>
                                        <h3 className="line-clamp-1 font-semibold">{review.title}</h3>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div>
                                        <p className="text-sm">Autores</p>
                                        <p>{review.authors.map((author) => author.name).join(', ')}</p>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <div className="mt-2 flex w-full justify-end gap-2">
                                        <DeleteDialog
                                            resourceId={review.uuid}
                                            resourceName={review.title}
                                            deleteRoute="review.destroy"
                                            onSuccess={() => window.location.reload()}
                                        />
                                        <Link href={route('reviews.edit', { review: review })}>
                                            <Button variant={'secondary'}>
                                                <Edit className="h-5 w-5" />
                                            </Button>
                                        </Link>
                                        <Link href={route('public.reviews.show', { review })}>
                                            <Button variant={'secondary'}>
                                                <Eye className="h-5 w-5" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    <PaginationControls pagination={reviews.meta} className="mt-4" />

                </div>
            </section>
        </AppLayout>
    );
}
