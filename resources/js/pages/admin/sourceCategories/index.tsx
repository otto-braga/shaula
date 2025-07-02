import DeleteDialog from '@/components/common/delete-dialog';
import SourceCategoryDialogForm from '@/components/sourceCategory/sourceCategory-dialog-form';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { SourceCategory } from '@/types/source-category';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categorias de Fontes',
        href: '/admin/categorias-fontes',
    },
];

export default function Index({ sourceCategories }: { sourceCategories: { data: SourceCategory[] } }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />
            <div className="mt-3 flex justify-end p-3">
                <SourceCategoryDialogForm />
            </div>
            <div className="grid gap-4 p-3 md:grid-cols-3">
                {sourceCategories.data.map((sourceCategory) => (
                    <Card className="rounded" key={sourceCategory.uuid}>
                        <CardHeader className="">
                            <CardTitle>{sourceCategory.name}</CardTitle>
                        </CardHeader>
                        <CardFooter className="flex justify-end gap-2">
                            <SourceCategoryDialogForm sourceCategory={sourceCategory} />
                            <DeleteDialog
                                resourceId={sourceCategory.uuid}
                                resourceName={sourceCategory.name}
                                deleteRoute="sourceCategories.destroy"
                                onSuccess={() => window.location.reload()}
                            />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </AppLayout>
    );
}
