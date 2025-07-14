import AuxDialogForm from '@/components/aux-form/aux-dialog-form';
import DeleteDialog from '@/components/common/delete-dialog';
import GenderDialogForm from '@/components/gender/gender-dialog-form';
import { PaginationControls, PaginationProps } from '@/components/pagination/pagination';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Gender } from '@/types/gender';
import { Head } from '@inertiajs/react';

type Props = {
    data: Gender[];
    meta: PaginationProps;
};

export default function Index({ genders }: { genders: Props }) {
    return (
        <AppLayout>
            <Head title="Identidades de Gênero" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Identidades de Gênero</h1>
                        <AuxDialogForm
                            model={null}
                            title='Id. de Gênero'
                            route_base_name='genders'
                        />
                    </div>

                    <PaginationControls pagination={genders.meta} className="mt-4" />

                    <div className="grid gap-4 p-3 md:grid-cols-3">
                        {genders.data.map((gender) => (
                            <Card className="rounded" key={gender.uuid}>
                                <CardHeader className="">
                                    <CardTitle>{gender.name}</CardTitle>
                                </CardHeader>
                                <CardFooter className="flex justify-end gap-2">
                                    <AuxDialogForm
                                        model={gender}
                                        title='Id. de Gênero'
                                        route_base_name='genders'
                                    />
                                    <DeleteDialog
                                        resourceId={gender.uuid}
                                        resourceName={gender.name}
                                        deleteRoute="genders.destroy"
                                        onSuccess={() => window.location.reload()}
                                    />
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    <PaginationControls pagination={genders.meta} className="mt-4" />

                </div>
            </section>
        </AppLayout>
    );
}
