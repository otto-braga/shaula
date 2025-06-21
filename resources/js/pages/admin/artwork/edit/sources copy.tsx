import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import { Artwork } from '@/types/artwork';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Tabs from './tabs';
import { LazyLoadingMultiSelect } from '@/components/select/lazyLoadingMultiSelect';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Obras',
        href: '/admin/artwork',
    },
];

export default function Sources({
    artwork,
}: {
    artwork: { data: Artwork },
}) {
    const isEdit = !!artwork;

    const { data, setData, post, patch, errors, processing } = useForm({
        sources_ids: artwork ? artwork.data.sources?.map((source) => source.id) : [] as number[],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        console.log('data', data);

        if (isEdit) {
            post(route('artworks.update', artwork.data), {
                preserveScroll: true,
                preserveState: false,
            });
        } else {
            post(route('artworks.store'), {
                preserveScroll: true,
                preserveState: false,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produções" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="">
                        <form onSubmit={submit} className="space-y-3 bg-inherit">
                            <Tabs artwork={artwork} processing={processing} />
                            {isEdit}

                            <div>
                                <Label htmlFor="sources_ids">Fontes</Label>
                                <LazyLoadingMultiSelect
                                    initialOptions={
                                        artwork?.data.sources?.map(
                                            source => ({ value: source.id, label: source.title })
                                        ) ?? []
                                    }
                                    routeName={
                                        'sources.fetch.options'
                                    }
                                    setterFunction={
                                        (options) => {
                                            setData('sources_ids', options.map((option) => (option.value)));
                                        }
                                    }
                                />
                                <InputError className="mt-2" message={errors.sources_ids} />
                            </div>

                        </form>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
