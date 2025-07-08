import CityDialogForm from '@/components/city/city-dialog-form';
import DeleteDialog from '@/components/common/delete-dialog';
import { PaginationControls, PaginationProps } from '@/components/pagination/pagination';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { City } from '@/types/city';
import { Head } from '@inertiajs/react';

type Props = {
    data: City[];
    meta: PaginationProps;
};

export default function Index({ cities }: { cities: Props }) {
    return (
        <AppLayout>
            <Head title="Cidades" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Cidades</h1>
                        <CityDialogForm />
                    </div>

                    <PaginationControls pagination={cities.meta} className="mt-4" />

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

                    <PaginationControls pagination={cities.meta} className="mt-4" />

                </div>
            </section>
        </AppLayout>
    );
}
