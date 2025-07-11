import { PaginationControls, PaginationProps } from '@/components/pagination/pagination';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Role } from '@/types/role';
import { Head } from '@inertiajs/react';

type Props = {
    data: Role[];
    meta: PaginationProps;
};

export default function Index({ roles }: { roles: Props }) {
    return (
        <AppLayout>
            <Head title="Funções" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Funções</h1>
                    </div>

                    <PaginationControls pagination={roles.meta} className="mt-4" />

                    <div className="grid gap-4 p-3 md:grid-cols-3">
                        {roles.data.map((role) => (
                            <Card className="rounded" key={role.uuid}>
                                <CardHeader className="">
                                    <CardTitle>{role.label}</CardTitle>
                                </CardHeader>
                                <div className="p-3 text-sm text-gray-600 dark:text-gray-400">
                                    {role.description}
                                </div>
                                <CardFooter className="flex justify-end gap-2">
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    <PaginationControls pagination={roles.meta} className="mt-4" />

                </div>
            </section>
        </AppLayout>
    );
}
