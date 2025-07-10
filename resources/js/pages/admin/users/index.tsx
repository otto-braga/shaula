import DeleteDialog from '@/components/common/delete-dialog';
import { PaginationControls, PaginationProps } from '@/components/pagination/pagination';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { User } from '@/types/user';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

type Props = {
    data: User[];
    meta: PaginationProps;
};

export default function Index({ users }: { users: Props }) {
    return (
        <AppLayout>
            <Head title="Usuários" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Usuários</h1>
                    </div>

                    <PaginationControls pagination={users.meta} className="mt-4" />

                    <div className="grid gap-4 p-3 md:grid-cols-3">
                        {users.data.map((user) => (
                            <Card className="rounded" key={user.uuid + user.name}>
                                <CardHeader className="">
                                    <CardTitle>{user.name}</CardTitle>
                                </CardHeader>
                                <CardFooter className="flex justify-end gap-2">
                                    <Link href={route('users.edit', user)}>
                                        <Button variant={'secondary'}>
                                            <Edit className="h-5 w-5" />
                                        </Button>
                                    </Link>
                                    {/* <DeleteDialog
                                        resourceId={user.uuid}
                                        resourceName={user.name}
                                        deleteRoute="users.destroy"
                                        onSuccess={() => window.location.reload()}
                                    /> */}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    <PaginationControls pagination={users.meta} className="mt-4" />

                </div>
            </section>
        </AppLayout>
    );
}
