import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Work } from '@/types/work';
import { Head, Link, useForm } from '@inertiajs/react';
import { Delete, Edit, RemoveRedEye } from '@mui/icons-material';
import { useState } from 'react';


export default function Index({
    works,
}: PageProps<{
    works: { data: Work[]}
}>) {
    console.log(works);

    const [confirmingDeletion, setConfirmingDeletion] = useState(false);
    const [resourceToDelete, setResourceToDelete] = useState<string | null>(null);

    const {
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm();

    const confirmDeletion = (uuid: string) => {
        setResourceToDelete(uuid);
        setConfirmingDeletion(true);
    };

    const deleteUser = () => {
        destroy(route('work.destroy', { id: resourceToDelete }), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingDeletion(false);
        setResourceToDelete(null);
        clearErrors();
        reset();
    };

    const workToDelete = works?.data?.find(work => work.uuid === resourceToDelete);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Produções
                </h2>
            }
        >
            <Head title="Produções" />

            <section className='py-12 px-4 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto lg:px-8">

                    <div className='flex justify-end'>
                        <Link href={route('work.create')}>
                            <PrimaryButton>
                                Cadastrar
                            </PrimaryButton>
                        </Link>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4'>
                        {
                            works?.data?.map((work) => (
                                <div key={work.id} className='flex flex-col border-b border-gray-700 p-4'>
                                    <h3 className='font-semibold'>{work.title}</h3>
                                    <p>{work.authors.map(author => author.name).join(', ')}</p>
                                    {/* <p>{work.categories.map(category => category.name).join(', ')}</p> */}
                                    <small className='font-semibold'>{new Date(work.date).toLocaleDateString()}</small>
                                    <br />
                                    <small>{work.description}</small>
                                    <div className='h-full'></div>
                                    <div className='flex gap-2 mt-2 justify-end'>
                                        <DangerButton onClick={() => confirmDeletion(work.uuid)}>
                                            <Delete className='w-5 h-5' />
                                        </DangerButton>
                                        <Link href={route('work.edit', { id: work.uuid })}>
                                            <SecondaryButton>
                                                <Edit className='w-5 h-5' />
                                            </SecondaryButton>
                                        </Link>
                                        {/* <Link href={route('work.show', { id: work.uuid })}>
                                            <PrimaryButton>
                                                <RemoveRedEye className='w-5 h-5' />
                                            </PrimaryButton>
                                        </Link> */}
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </section>

            {workToDelete && (
                <Modal show={confirmingDeletion} onClose={closeModal}>
                    <form onSubmit={(e) => { e.preventDefault(); deleteUser(); }} className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Tem certeza que deseja deletar o departamento {workToDelete.id}?
                        </h2>

                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Uma vez que o departamento é deletado, todos os seus recursos e dados serão permanentemente deletados.
                        </p>

                        <div className="mt-6 flex justify-end">
                            <SecondaryButton onClick={closeModal}>
                                Cancelar
                            </SecondaryButton>

                            <DangerButton className="ms-3" disabled={processing}>
                                Deletar Departamento
                            </DangerButton>
                        </div>
                    </form>
                </Modal>
            )}
        </AuthenticatedLayout>
    )
}