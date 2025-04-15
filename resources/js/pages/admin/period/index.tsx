import DeleteDialog from '@/components/common/delete-dialog';
import PeriodDialogForm from '@/components/period/period-dialog-form';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Period } from '@/types/period';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Períodos',
        href: '/admin/periodos',
    },
];

export default function Index({ periods }: { periods: { data: Period[] } }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Períodos" />
            <div className="mt-3 flex justify-end p-3">
                <PeriodDialogForm />
            </div>
            <div className="grid gap-4 p-3 md:grid-cols-3">
                {periods.data.map((period) => (
                    <Card className="rounded" key={period.id}>
                        <CardHeader className="">
                            <CardTitle>{period.name}</CardTitle>
                        </CardHeader>
                        <CardFooter className="flex justify-end gap-2">
                            <PeriodDialogForm period={period} />
                            <DeleteDialog
                                resourceId={period.id}
                                resourceName={period.name}
                                deleteRoute="categories.destroy"
                                onSuccess={() => window.location.reload()}
                            />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </AppLayout>
    );
}
