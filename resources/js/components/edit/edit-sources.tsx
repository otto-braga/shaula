import InputError from '@/components/input-error';
import { useState, useEffect } from 'react';
import { FileCard } from '@/components/ui/file-card';
import { Source } from '@/types/source';
import Select, { SingleValue } from 'react-select';
import { Option } from '@/utils/selectHelpers';
import { CustomMenuList } from '@/components/select/lazyLoadingSelect';
import { handleReactSelectStyling } from '@/utils/react-select-styling';
import { Button } from '@/components/ui/button';

type EditSourcesProps = {
    model: { data: { sources?: Source[] } },
    data: any,
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
                .map((object: { value: number; label: string; description?: string }) => ({
                    value: object.value,
                    label: object.label + ' - ' + object.description,
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
            <InputError className="mt-2" message={errors?.sources_ids} />

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
    );
}
