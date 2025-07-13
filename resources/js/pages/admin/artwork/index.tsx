import { AdminIndexBar } from '@/components/admin-index-bar/admin-index-bar';
import DeleteDialog from '@/components/common/delete-dialog';
import { PaginationProps } from '@/components/pagination/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Artwork } from '@/types/artwork';
import { Person } from '@/types/person';
import { Head, Link } from '@inertiajs/react';
import { Edit, Eye } from 'lucide-react';

type Props = {
    data: Artwork[];
    meta: PaginationProps;
};

export default function Index({ artworks }: { artworks: Props }) {
    console.log(artworks);

    return (
        <AppLayout>
            <Head title="Obras" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Obras</h1>
                        <Link href={route('artworks.create')} prefetch>
                            <Button>Cadastrar</Button>
                        </Link>
                    </div>

                    <AdminIndexBar index_route='artworks.index' pagination_meta={artworks.meta} />

                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {artworks?.data?.map((artwork) => (
                            <Card key={artwork.uuid} className="flex flex-col justify-between">
                                <CardHeader>
                                    {artwork.primary_image?.path ? (
                                        <img src={`${artwork.primary_image.path}`} alt={artwork.title} className="mb-3 aspect-square rounded-t object-cover" />
                                    ) : (
                                        <div className="text- mb-3 flex aspect-square items-center justify-center rounded-t bg-gray-800/50 text-white/50">
                                            Sem imagem
                                        </div>
                                    )}
                                    <CardTitle>
                                        <h3 className="line-clamp-1 font-semibold">{artwork.title}</h3>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div>
                                        <p className="text-sm">Autores</p>
                                        <p>{artwork.authors.map((author: Person) => author.name).join(', ')}</p>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <div className="mt-2 flex w-full justify-end gap-2">
                                        <DeleteDialog
                                            resourceId={artwork.uuid}
                                            resourceName={artwork.title}
                                            deleteRoute="artworks.destroy"
                                            onSuccess={() => window.location.reload()}
                                        />
                                        <Link href={route('artworks.edit', { artwork: artwork })}>
                                            <Button variant={'secondary'}>
                                                <Edit className="h-5 w-5" />
                                            </Button>
                                        </Link>
                                        <Link href={route('artworks.show', { id: artwork.uuid })}>
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
