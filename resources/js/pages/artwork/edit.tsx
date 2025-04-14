import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Artwork, Work } from '@/types/work';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Tabs from '../Tabs';
import InputLabel from '@/Components/InputLabel';
import CreatableSelect from 'react-select/creatable';
import { City } from '@/types/city';
import InputError from '@/Components/InputError';
import { Language } from '@/types/language';
import { Checkbox, Input, TextField } from '@mui/material';
import { Category } from '@/types/category';
import { Award } from '@/types/award';
import { Label } from '@mui/icons-material';
import { Tag } from '@/types/tag';

type SelectOption = {
    id: number,
    name: string,
    label: string,
}

export default function Index({
    work,
}: PageProps<{
    work: { data: Work }
}>) {
    const artwork = work.data.workable as Artwork;

    const { data, setData, post, errors, processing } = useForm({
        dimensions: artwork ? artwork.dimensions : '',
        materials: artwork ? artwork.materials : '',
        is_museumized: artwork ? artwork.is_museumized : false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('artwork.update', work.data.uuid));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="">
                    Editor
                </h2>
            }
        >
            <Head title={'Editor'} />

            <section className='py-12 px-4 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto lg:px-8">
                    <div className='bg-white border p-3 rounded dark:border-gray-600 dark:bg-slate-800'>
                        <form onSubmit={submit} className="space-y-6 bg-inherit">

                            <Tabs work={work} processing={processing} />

                            <div>
                                <InputLabel htmlFor="dimensions" value="Dimensões" />
                                <TextField
                                    id="dimensions"
                                    value={data.dimensions ?? ''}
                                    onChange={(e) => setData('dimensions', e.target.value)}
                                    fullWidth
                                    multiline
                                    rows={4}
                                    variant='outlined'
                                />
                                <InputError className="mt-2" message={errors.dimensions} />
                            </div>

                            <div>
                                <InputLabel htmlFor="materials" value="Materiais" />
                                <TextField
                                    id="materials"
                                    value={data.materials ?? ''}
                                    onChange={(e) => setData('materials', e.target.value)}
                                    fullWidth
                                    multiline
                                    rows={4}
                                    variant='outlined'
                                />
                                <InputError className="mt-2" message={errors.materials} />
                            </div>

                            <div>
                                <InputLabel htmlFor="is_museumized" value="Musealizado" />
                                <input
                                    type="checkbox"
                                    id="is_museumized"
                                    checked={data.is_museumized}
                                    onChange={(e) => setData('is_museumized', e.target.checked)}
                                />
                                <InputError className="mt-2" message={errors.is_museumized} />
                            </div>

                        </form>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    )
}