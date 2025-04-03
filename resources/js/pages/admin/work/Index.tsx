import DangerButton from '@/Components/DangerButton';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Work } from '@/types/work';
import { Head, Link } from '@inertiajs/react';
import { Delete, Edit } from '@mui/icons-material';

export default function Index({
    works,
}: PageProps<{
    works: { data: Work[] };
}>) {
    console.log(works);

    return (
        <AuthenticatedLayout header={<h2 className="text-xl leading-tight font-semibold text-gray-800 dark:text-gray-200">Produções</h2>}>
            <Head title="Produções" />

            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="flex justify-end">
                        <Link href={route('work.create')}>
                            <PrimaryButton>Cadastrar</PrimaryButton>
                        </Link>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {works?.data?.map((work) => (
                            <div key={work.id} className="flex flex-col border-b border-gray-700 p-4">
                                <h3 className="font-semibold">{work.title}</h3>
                                <p>{work.authors.map((author) => author.name).join(', ')}</p>
                                {/* <p>{work.categories.map(category => category.name).join(', ')}</p> */}
                                <small className="font-semibold">{new Date(work.date).toLocaleDateString()}</small>
                                <br />
                                <small>{work.description}</small>
                                <div className="h-full"></div>
                                <div className="mt-2 flex justify-end gap-2">
                                    <DangerButton onClick={() => confirmDeletion(work.uuid)}>
                                        <Delete className="h-5 w-5" />
                                    </DangerButton>
                                    <Link href={route('work.edit', { id: work.uuid })}>
                                        <SecondaryButton>
                                            <Edit className="h-5 w-5" />
                                        </SecondaryButton>
                                    </Link>
                                    {/* <Link href={route('work.show', { id: work.uuid })}>
                                            <PrimaryButton>
                                                <RemoveRedEye className='w-5 h-5' />
                                            </PrimaryButton>
                                        </Link> */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}
