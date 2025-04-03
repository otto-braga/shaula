import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Work } from '@/types/work';
import { Head, Link } from '@inertiajs/react';
import { Edit } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Produções',
        href: '/admin/work',
    },
];

export default function Index({ works }: { works: { data: Work[] } }) {
    console.log(works);

    // const [confirmingDeletion, setConfirmingDeletion] = useState(false);
    // const [resourceToDelete, setResourceToDelete] = useState<string | null>(null);

    // const { delete: destroy, processing, reset, errors, clearErrors } = useForm();

    // const confirmDeletion = (uuid: string) => {
    //     setResourceToDelete(uuid);
    //     setConfirmingDeletion(true);
    // };

    // const deleteUser = () => {
    //     destroy(route('work.destroy', { id: resourceToDelete }), {
    //         preserveScroll: true,
    //         onSuccess: () => closeModal(),
    //         onFinish: () => reset(),
    //     });
    // };

    // const closeModal = () => {
    //     setConfirmingDeletion(false);
    //     setResourceToDelete(null);
    //     clearErrors();
    //     reset();
    // };

    // const workToDelete = works?.data?.find((work) => work.uuid === resourceToDelete);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produções" />
            {/* <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div> */}
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="flex justify-end">
                        <Link href={route('work.create')} prefetch>
                            <Button>Cadastrar</Button>
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
                                    {/* <Button variant={'destructive'} onClick={() => confirmDeletion(work.uuid)}>
                                        <Delete className="h-5 w-5" />
                                    </Button> */}
                                    <Link href={route('work.edit', { id: work.uuid })}>
                                        <Button variant={'destructive'}>
                                            <Edit className="h-5 w-5" />
                                        </Button>
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

            {/* {workToDelete && (
                <Modal show={confirmingDeletion} onClose={closeModal}>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            deleteUser();
                        }}
                        className="p-6"
                    >
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Tem certeza que deseja deletar o departamento {workToDelete.id}?
                        </h2>

                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Uma vez que o departamento é deletado, todos os seus recursos e dados serão permanentemente deletados.
                        </p>

                        <div className="mt-6 flex justify-end">
                            <Button variant={'secondary'} onClick={closeModal}>
                                Cancelar
                            </Button>

                            <Button variant={'destructive'} className="ms-3" disabled={processing}>
                                Deletar Departamento
                            </Button>
                        </div>
                    </form>
                </Modal>
            )} */}
        </AppLayout>
    );
}
