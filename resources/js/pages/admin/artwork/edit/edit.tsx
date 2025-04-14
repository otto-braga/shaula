import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import { Person } from '@/types/person';
import { Work } from '@/types/work';
import { handleReactSelectStyling } from '@/utils/react-select-styling';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import Select from 'react-select';
import Tabs from './tabs';
import { Artwork } from '@/types/artwork';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Produções',
        href: '/admin/work',
    },
];

export default function Index({
    work,
}: {
    work: { data: Work };
}) {
    const artwork = work.data.workable as Artwork;

    // -------------------------------------------------------------------------
    // form

    const { data, setData, post, patch, errors, processing } = useForm({
        dimensions: artwork ? artwork.dimensions : '',
        materials: artwork ? artwork.materials : '',
        is_museumized: artwork ? artwork.is_museumized : false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('artwork.update', work.data), {
            preserveScroll: true,
            preserveState: false,
        });
    };

    // -------------------------------------------------------------------------
    // render

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produções" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="">
                        <form onSubmit={submit} className="space-y-3 bg-inherit">
                            <Tabs work={work} processing={processing} />

                            <div>
                                <Label htmlFor="dimensions">Dimensões</Label>
                                <Input
                                    id="title"
                                    value={data.dimensions ?? ''}
                                    onChange={(e) => setData('dimensions', e.target.value)}
                                />
                                <InputError className="mt-2" message={errors.dimensions} />
                            </div>

                            <div>
                                <Label htmlFor="materials">Materiais</Label>
                                <Input
                                    id="materials"
                                    value={data.materials ?? ''}
                                    onChange={(e) => setData('materials', e.target.value)}
                                />
                                <InputError className="mt-2" message={errors.materials} />
                            </div>

                            <div>
                                <Label htmlFor="is_museumized">Musealizado</Label>
                                <Input
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
        </AppLayout>
    );
}
