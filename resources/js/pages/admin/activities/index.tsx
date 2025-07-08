import ActivityDialogForm from '@/components/activity/activity-dialog-form';
import DeleteDialog from '@/components/common/delete-dialog';
import { PaginationControls, PaginationProps } from '@/components/pagination/pagination';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Activity } from '@/types/activity';
import { Head } from '@inertiajs/react';

type Props = {
    data: Activity[];
    meta: PaginationProps;
};

export default function Index({ activities }: { activities: Props }) {
    return (
        <AppLayout>
            <Head title="Atividades" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Atividades</h1>
                        <ActivityDialogForm />
                    </div>

                    <PaginationControls pagination={activities.meta} className="mt-4" />


                    <div className="grid gap-4 p-3 md:grid-cols-3">
                        {activities.data.map((activity) => (
                            <Card className="rounded" key={activity.uuid}>
                                <CardHeader className="">
                                    <CardTitle>{activity.name}</CardTitle>
                                </CardHeader>
                                <CardFooter className="flex justify-end gap-2">
                                    <ActivityDialogForm activity={activity} />
                                    <DeleteDialog
                                        resourceId={activity.uuid}
                                        resourceName={activity.name}
                                        deleteRoute="activities.destroy"
                                        onSuccess={() => window.location.reload()}
                                    />
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    <PaginationControls pagination={activities.meta} className="mt-4" />

                </div>
            </section>
        </AppLayout>
    );
}
