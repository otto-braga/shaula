import DeleteDialog from '@/components/common/delete-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Person } from '@/types/person';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pessoas',
        href: route('person.index'),
    },
];

export default function Index({ people }: { people: { data: Person[] } }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />
            <div className="mt-3 flex justify-end p-3">
                <Link href={route('person.create')}>
                    <Button variant="secondary">
                        <div className="flex items-center gap-1">
                            <Plus className="h-4 w-4" />
                            <span>Pessoa</span>
                        </div>
                    </Button>
                </Link>
            </div>
            <div className="grid gap-4 p-3 md:grid-cols-3">
                {people.data.map((person) => (
                    <Card className="rounded" key={person.id}>
                        <CardHeader className="">
                            {person.primary_image?.path ? (
                                <img src={`${person.primary_image.path}`} alt={person.name} className="mb-3 aspect-square rounded-t object-cover" />
                            ) : (
                                <div className="text- mb-3 flex aspect-square items-center justify-center rounded-t bg-gray-800/50 text-white/50">
                                    Sem imagem
                                </div>
                            )}
                            <CardTitle>{person.name}</CardTitle>
                        </CardHeader>
                        <CardFooter className="flex justify-end gap-2">
                            <Link href={route('person.edit', { person: person })}>
                                <Button variant="secondary">Editar</Button>
                            </Link>
                            <DeleteDialog
                                resourceId={person.uuid || ''}
                                resourceName={person.name}
                                deleteRoute="person.destroy"
                                onSuccess={() => window.location.reload()}
                            />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </AppLayout>
    );
}
