import DeleteDialog from '@/components/common/delete-dialog';
import PeriodDialogForm from '@/components/period/period-dialog-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Period } from '@/types/period';
import { Head, Link } from '@inertiajs/react';
import { Edit, Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Periodização',
        href: '/admin/periodos',
    },
];

export default function Index({ periods }: { periods: { data: Period[] } }) {
    console.log(periods);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Periodização" />
            <div className="mt-3 flex justify-end p-3">
                <PeriodDialogForm />
            </div>
            <div>
                <Link href={route('periods.create')}>
                    <Button>
                        <Plus size={16} className="mr-2" />
                        Novo Período
                    </Button>
                </Link>
            </div>
            <div className="grid gap-4 p-3 md:grid-cols-3">
                {periods.data.map((period) => (
                    <Card className="rounded" key={period.id}>
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
                            <PeriodDialogForm period={period} />
                            <Link href={route('periods.edit', period)}>
                                <Button variant="secondary" size="sm">
                                    <Edit size={16} className="mr-1" /> Editar
                                </Button>
                            </Link>
                            <DeleteDialog
                                resourceId={period.id}
                                resourceName={period.name}
                                deleteRoute="periods.destroy"
                                onSuccess={() => window.location.reload()}
                            />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </AppLayout>
    );
}
