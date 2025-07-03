import DeleteDialog from '@/components/common/delete-dialog';
import GenderDialogForm from '@/components/gender/gender-dialog-form';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Gender } from '@/types/gender';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Identidades de Gênero',
        href: '/admin/generos',
    },
];

export default function Index({ genders }: { genders: { data: Gender[] } }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />
            <div className="mt-3 flex justify-end p-3">
                <GenderDialogForm />
            </div>
            <div className="grid gap-4 p-3 md:grid-cols-3">
                {genders.data.map((gender) => (
                    <Card className="rounded" key={gender.uuid}>
                        <CardHeader className="">
                            <CardTitle>{gender.name}</CardTitle>
                        </CardHeader>
                        <CardFooter className="flex justify-end gap-2">
                            <GenderDialogForm gender={gender} />
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
        </AppLayout>
    );
}
