import ActivityDialogForm from '@/components/activity/activity-dialog-form';
import DeleteDialog from '@/components/common/delete-dialog';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Activity } from '@/types/activity';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Atividades',
        href: '/admin/atividades',
    },
];

export default function Index({ activities }: { activities: { data: Activity[] } }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />
            <div className="mt-3 flex justify-end p-3">
                <ActivityDialogForm />
            </div>
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
        </AppLayout>
    );
}
