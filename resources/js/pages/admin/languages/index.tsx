import DeleteDialog from '@/components/common/delete-dialog';
import LanguageDialogForm from '@/components/language/language-dialog-form';
import { PaginationControls, PaginationProps } from '@/components/pagination/pagination';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Language } from '@/types/language';
import { Head } from '@inertiajs/react';

type Props = {
    data: Language[];
    meta: PaginationProps;
};

export default function Index({ languages }: { languages: Props }) {
    return (
        <AppLayout>
            <Head title="Linguagens" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Linguagens</h1>
                        <LanguageDialogForm />
                    </div>

                    <PaginationControls pagination={languages.meta} className="mt-4" />

                    <div className="grid gap-4 p-3 md:grid-cols-3">
                        {languages.data.map((activity) => (
                            <Card className="rounded" key={activity.uuid}>
                                <CardHeader className="">
                                    <CardTitle>{activity.name}</CardTitle>
                                </CardHeader>
                                <CardFooter className="flex justify-end gap-2">
                                    <LanguageDialogForm language={activity} />
                                    <DeleteDialog
                                        resourceId={activity.uuid}
                                        resourceName={activity.name}
                                        deleteRoute="languages.destroy"
                                        onSuccess={() => window.location.reload()}
                                    />
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    <PaginationControls pagination={languages.meta} className="mt-4" />

                </div>
            </section>
        </AppLayout>
    );
}
