import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { type BreadcrumbItem } from '@/types';
import { Artwork } from '@/types/artwork';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';
import Tabs from './tabs';
import { FileCard } from '@/components/ui/file-card';
import { Source } from '@/types/source';
import Select, { SingleValue } from 'react-select';
import { Option } from '@/utils/selectHelpers';
import { CustomMenuList } from '@/components/select/lazyLoadingSelect';
import { handleReactSelectStyling } from '@/utils/react-select-styling';
import { Button } from '@/components/ui/button';

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
    const { data, setData, post, patch, errors, processing } = useForm({
        sources_ids: artwork ? artwork.data.sources?.map((source) => source.id) : [] as number[],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        console.log('data', data);

        post(route('artworks.update.sources', artwork.data), {
            preserveScroll: true,
            preserveState: false,
        });
    };

    const [sources, setSources] = useState<Source[]>(artwork?.data.sources || []);
    const [fetchedSources, setFetchedSources] = useState<Option[]>([]);

    function loadOptions(inputValue: string)  {
        if (inputValue.length < 1) {
            return;
        }

        let response;

        fetch(
            route('sources.fetch.options', { search: inputValue }),
            {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
            }
        )
        .then((res) => res.json())
        .then((data) => {
            response = data as Option[];
            console.log('response', response);
            setFetchedSources(
                response
                .filter((object: Option) => !sources?.map((source) => source.id).includes(object.value))
                .map((object: Option) => ({
                    value: object.value,
                    label: object.label,
                }) as Option) as Option[]
            );
        });

        return response;
    };

    function loadSelectedSource(inputValue: number) {
        setFetchedSources([]);

        if (inputValue < 1) {
            return;
        }

        let response;

        fetch(
            route('sources.fetch.single', { id: inputValue }),
            {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
            }
        )
        .then((res) => res.json())
        .then((data) => {
            response = data as Source;
            console.log('response', response);
            setSources([...sources, response]);
        });

        return response;
    };

    async function selectSource(option: SingleValue<Option>) {
        if (option) {
            const source = loadSelectedSource(option.value) as Source | undefined;
        }
    }

    useEffect(() => {
        setData('sources_ids', sources.map((source) => source.id));
    }, [sources]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produções" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="">
                        <form onSubmit={submit} className="space-y-3 bg-inherit">
                            <Tabs artwork={artwork} processing={processing} />
                            <div>
                                <Select
                                    options={fetchedSources}
                                    onChange={
                                        (option: SingleValue<Option>) => {
                                            if (option) {
                                                selectSource(option);
                                            }
                                        }
                                    }
                                    value={null}
                                    onInputChange={loadOptions}
                                    loadingMessage={() => 'Carregando...'}
                                    noOptionsMessage={() => 'Nenhum resultado.'}
                                    placeholder="Digite para buscar..."
                                    components={{ MenuList: CustomMenuList }}
                                    styles={handleReactSelectStyling()}
                                />
                                <InputError className="mt-2" message={errors.sources_ids} />

                                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                                    {sources?.map((source) => (
                                        <div key={source.id + source.title} className="mt-2 p-4 border rounded-lg bg-white dark:bg-gray-800 max-h-content flex justify-between">
                                            <div className="flex flex-col space-x-2">
                                                <p className="text-sm font-semibold">{source.title}</p>
                                                <p className="text-sm text-gray-500">{source.content}</p>
                                                <FileCard
                                                    file={source.file ?? null}
                                                    className="w-full h-full mt-2"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    className="mt-2"
                                                    onClick={() => {
                                                        setSources(sources.filter((s) => s.id !== source.id));
                                                    }}
                                                >
                                                    Remover Fonte
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </form>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
