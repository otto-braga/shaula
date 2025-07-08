import CategoryDialogForm from '@/components/category/category-dialog-form';
import DeleteDialog from '@/components/common/delete-dialog';
import { PaginationControls, PaginationProps } from '@/components/pagination/pagination';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Category } from '@/types/category';
import { Head } from '@inertiajs/react';

type Props = {
    data: Category[];
    meta: PaginationProps;
};

export default function Index({ categories }: { categories: Props }) {
    return (
        <AppLayout>
            <Head title="Categorias" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Categorias</h1>
                        <CategoryDialogForm />
                    </div>

                    <PaginationControls pagination={categories.meta} className="mt-4" />

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

                    <PaginationControls pagination={categories.meta} className="mt-4" />

                </div>
            </section>
        </AppLayout>
    );
}
