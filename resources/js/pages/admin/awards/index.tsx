import DeleteDialog from '@/components/common/delete-dialog';
import AwardDialogForm from '@/components/award/award-dialog-form';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Award } from '@/types/award';
import { Head } from '@inertiajs/react';
import { PaginationControls, PaginationProps } from '@/components/pagination/pagination';

type Props = {
    data: Award[];
    meta: PaginationProps;
};

export default function Index({ awards }: { awards: Props }) {
    return (
        <AppLayout>
            <Head title="Prêmios" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Prêmios</h1>
                        <AwardDialogForm />
                    </div>

                    <PaginationControls pagination={awards.meta} className="mt-4" />

                    <div className="grid gap-4 p-3 md:grid-cols-3">
                        {awards.data.map((award) => (
                            <Card className="rounded" key={award.uuid}>
                                <CardHeader className="">
                                    <CardTitle>{award.name}</CardTitle>
                                </CardHeader>
                                <CardFooter className="flex justify-end gap-2">
                                    <AwardDialogForm award={award} />
                                    <DeleteDialog
                                        resourceId={award.uuid}
                                        resourceName={award.name}
                                        deleteRoute="awards.destroy"
                                        onSuccess={() => window.location.reload()}
                                    />
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    <PaginationControls pagination={awards.meta} className="mt-4" />

                </div>
            </section>
        </AppLayout>
    );
}
