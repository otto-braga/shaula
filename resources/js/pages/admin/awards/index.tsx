import DeleteDialog from '@/components/common/delete-dialog';
import AwardDialogForm from '@/components/award/award-dialog-form';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Award } from '@/types/award';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Prêmios',
        href: '/admin/premios',
    },
];

export default function Index({ awards }: { awards: { data: Award[] } }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />
            <div className="mt-3 flex justify-end p-3">
                <AwardDialogForm />
            </div>
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
        </AppLayout>
    );
}
