import CityDialogForm from '@/components/city/city-dialog-form';
import DeleteDialog from '@/components/common/delete-dialog';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { City } from '@/types/city';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cidades',
        href: '/admin/cidades',
    },
];

export default function Index({ cities }: { cities: { data: City[] } }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />
            <div className="mt-3 flex justify-end p-3">
                <CityDialogForm />
            </div>
            <div className="grid gap-4 p-3 md:grid-cols-3">
                {cities.data.map((city) => (
                    <Card className="rounded" key={city.uuid}>
                        <CardHeader className="">
                            <CardTitle>{city.name}</CardTitle>
                        </CardHeader>
                        <CardFooter className="flex justify-end gap-2">
                            <CityDialogForm city={city} />
                            <DeleteDialog
                                resourceId={city.uuid}
                                resourceName={city.name}
                                deleteRoute="cities.destroy"
                                onSuccess={() => window.location.reload()}
                            />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </AppLayout>
    );
}
