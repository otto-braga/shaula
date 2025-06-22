import InputError from '@/components/input-error';
import { useState, useEffect } from 'react';
import { FileCard } from '@/components/ui/file-card';
import { Source } from '@/types/source';
import Select, { SingleValue } from 'react-select';
import { Option } from '@/utils/selectHelpers';
import { CustomMenuList } from '@/components/select/lazyLoadingSelect';
import { handleReactSelectStyling } from '@/utils/react-select-styling';
import { Button } from '@/components/ui/button';
import { SearchResult } from '@/types/search-result';

type EditSourcesProps = {
    model: { data: { sources?: Source[] } },
    data: {
        sources_ids: number[],
    },
    setData: (key: string, value: any) => void,
    errors?: Record<string, string>,
    processing?: boolean,
};

export default function EditSources({
    model,
    data,
    setData,
    errors,
    processing
}: EditSourcesProps) {
    const [sources, setSources] = useState<Source[]>(model?.data.sources || []);
    const [fetchedSources, setFetchedSources] = useState<SearchResult[]>([]);

    function loadOptions(inputValue: string)  {
        if (inputValue.length < 1) {
            return;
        }

        let response;

        fetch(
            route('sources.fetch.options', { q: inputValue }),
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
            response = data as { results: SearchResult[] };
            setFetchedSources(
                response.results
                .filter((object: SearchResult) => !sources?.map((source) => source.uuid).includes(object.uuid ?? ''))
                .map((object: SearchResult) => ({
                    value: object.uuid,
                    label: object.label + ' - ' + object.content,
                }))
            );
        });

        return response;
    };

    function loadSelectedSource(inputValue: string) {
        setFetchedSources([]);

        if (inputValue === '' || inputValue === null) {
            return;
        }

        let response;

        fetch(
            route('sources.fetch.single', { uuid: inputValue }),
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

    async function selectSource(option: SingleValue<SearchResult>) {
        if (option) {
            const source = loadSelectedSource(option.uuid ?? '') as Source | undefined;
        }
    }

    useEffect(() => {
        setData('sources_ids', sources.map((source) => source.id));
    }, [sources]);

    return (
        <div>
            <Select
                options={fetchedSources}
                onChange={
                    (option: SingleValue<SearchResult>) => {
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
            <InputError className="mt-2" message={errors?.sources_ids} />

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {sources?.map((source) => (
                    <div key={source.id + source.title} className="mt-2 p-4 border rounded-lg bg-white dark:bg-gray-800 flex flex-col justify-between">
                            <p className="text-sm font-semibold">{source.title}</p>
                            <p className="text-sm text-gray-500 h-32 overflow-hidden mb-2"
                                dangerouslySetInnerHTML={{ __html: source.content ?? '' }}
                            />
                            <FileCard
                                file={source.file ?? null}
                                className="h-32"
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                className="mt-2"
                                onClick={() => {
                                    setSources(sources.filter((s) => s.uuid !== source.uuid));
                                }}
                            >
                                Remover Fonte
                            </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
