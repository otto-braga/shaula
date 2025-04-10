import DeleteDialog from '@/components/common/delete-dialog';
import LanguageDialogForm from '@/components/language/language-dialog-form';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Language } from '@/types/language';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Linguagens',
        href: '/admin/linguagens',
    },
];

export default function Index({ languages }: { languages: { data: Language[] } }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />
            <div className="mt-3 flex justify-end p-3">
                <LanguageDialogForm />
            </div>
            <div className="grid gap-4 p-3 md:grid-cols-3">
                {languages.data.map((activity) => (
                    <Card className="rounded" key={activity.id}>
                        <CardHeader className="">
                            <CardTitle>{activity.name}</CardTitle>
                        </CardHeader>
                        <CardFooter className="flex justify-end gap-2">
                            <LanguageDialogForm language={activity} />
                            <DeleteDialog
                                resourceId={activity.id}
                                resourceName={activity.name}
                                deleteRoute="languages.destroy"
                                onSuccess={() => window.location.reload()}
                            />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </AppLayout>
    );
}
