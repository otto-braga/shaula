import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Review } from '@/types/review';
import { Head, Link } from '@inertiajs/react';

export default function Edit({
    review,
}: PageProps<{ review: { data: Review } }>) {


    return (
        <AuthenticatedLayout
            header={
                <h2 className="">
                    { `Crítica - ${review.data.title}` }
                </h2>
            }
        >
            <Head title={`Crítica - ${review.data.title}`} />

            <section className='py-12 px-4 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto lg:px-8">

                    <div className="mb-4">
                        <Link href={route('review.index')}>
                            <SecondaryButton>Voltar</SecondaryButton>
                        </Link>
                    </div>

                    <div className='bg-white border p-3 rounded dark:border-gray-600 dark:bg-slate-800'>
                        asdas
                    </div>

                </div>
            </section>

        </AuthenticatedLayout>
    )
}