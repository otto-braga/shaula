import DeleteDialog from '@/components/common/delete-dialog';
import { PaginationControls, PaginationProps } from '@/components/pagination/pagination';
import SourceCategoryDialogForm from '@/components/sourceCategory/sourceCategory-dialog-form';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { SourceCategory } from '@/types/source-category';
import { Head } from '@inertiajs/react';

type Props = {
    data: SourceCategory[];
    meta: PaginationProps;
};

export default function Index({ sourceCategories }: { sourceCategories: Props }) {
    return (
        <AppLayout>
            <Head title="Categorias de Fonte" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Categorias de Fonte</h1>
                        <SourceCategoryDialogForm />
                    </div>

                    <PaginationControls pagination={sourceCategories.meta} className="mt-4" />

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

                    <PaginationControls pagination={sourceCategories.meta} className="mt-4" />

                </div>
            </section>
        </AppLayout>
    );
}
