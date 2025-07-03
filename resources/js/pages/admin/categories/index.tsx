import CategoryDialogForm from '@/components/category/category-dialog-form';
import DeleteDialog from '@/components/common/delete-dialog';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Category } from '@/types/category';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categorias',
        href: '/admin/categorias',
    },
];

export default function Index({ categories }: { categories: { data: Category[] } }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />
            <div className="mt-3 flex justify-end p-3">
                <CategoryDialogForm />
            </div>
            <div className="grid gap-4 p-3 md:grid-cols-3">
                {categories.data.map((category) => (
                    <Card className="rounded" key={category.uuid}>
                        <CardHeader className="">
                            <CardTitle>{category.name}</CardTitle>
                        </CardHeader>
                        <CardFooter className="flex justify-end gap-2">
                            <CategoryDialogForm category={category} />
                            <DeleteDialog
                                resourceId={category.uuid}
                                resourceName={category.name}
                                deleteRoute="categories.destroy"
                                onSuccess={() => window.location.reload()}
                            />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </AppLayout>
    );
}
