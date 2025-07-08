import DeleteDialog from '@/components/common/delete-dialog';
import { PaginationControls, PaginationProps } from '@/components/pagination/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Period } from '@/types/period';
import { Head, Link } from '@inertiajs/react';

type Props = {
    data: Period[];
    meta: PaginationProps;
};

export default function Index({ periods }: { periods: Props }) {
    console.log(periods);
    return (
        <AppLayout>
            <Head title="Periodização" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Periodização</h1>
                        <Link href={route('periods.create')} prefetch>
                            <Button>Cadastrar</Button>
                        </Link>
                    </div>

                    <PaginationControls pagination={periods.meta} className="mt-4" />

                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {periods.data.map((period) => (
                            <Card className="rounded" key={period.uuid}>
                                <CardHeader className="">
                                    <CardTitle>{period.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {period.primary_image?.path ? (
                                        <img src={`${period.primary_image.path}`} alt={period.name} className="mb-3 aspect-square rounded-t object-cover" />
                                    ) : (
                                        <div className="text- mb-3 flex aspect-square items-center justify-center rounded-t bg-gray-800/50 text-white/50">
                                            Sem imagem
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm text-slate-500">Início</p>
                                        <p>{period.start_date ? period.start_date : 'Data de início não inserida'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Fim</p>
                                        <p>{period.end_date ? period.end_date : 'Data final não inserida'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Sobre</p>
                                        <div dangerouslySetInnerHTML={{ __html: period.content }} className="line-clamp-3" />
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end gap-2">
                                    <Link href={route('periods.edit', period)}>
                                        <Button variant="secondary" size="sm">
                                            Editar
                                        </Button>
                                    </Link>
                                    <DeleteDialog
                                        resourceId={period.uuid}
                                        resourceName={period.name}
                                        deleteRoute="periods.destroy"
                                        onSuccess={() => window.location.reload()}
                                    />
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    <PaginationControls pagination={periods.meta} className="mt-4" />

                </div>
            </section>
        </AppLayout>
    );
}
