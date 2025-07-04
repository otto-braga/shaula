import DeleteDialog from '@/components/common/delete-dialog';
import { PaginationControls, PaginationProps } from '@/components/pagination/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Person } from '@/types/person';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

export default function Index({ people }: { people: PaginationProps & { data: Person[] } }) {
    console.log(people);

    return (
        <AppLayout>
            <Head title="Profile settings" />
            <div className="mt-3 flex justify-between items-center p-3">
                <h1 className="text-2xl font-bold">Pessoas</h1>
                <Link href={route('people.create')}>
                    <Button variant="secondary">
                        <div className="flex items-center gap-1">
                            <Plus className="h-4 w-4" />
                            <span>Pessoa</span>
                        </div>
                    </Button>
                </Link>
            </div>

            <PaginationControls pagination={people} />

            <div className="grid gap-4 p-3 md:grid-cols-3">
                {people.data.map((person) => (
                    <Card className="rounded" key={person.uuid}>
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
                            <Link href={route('people.edit', { person: person })}>
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
