import { SearchResult } from "@/types/search-result";
import { handleReactSelectStyling } from "@/utils/react-select-styling";
import { use, useEffect, useState } from "react";
import { MultiValue, SingleValue, components } from 'react-select';
import Select from "./select-styled";

type LazyLoadingSelectProps = {
    [key: string]: any; // Allow additional props
}

// -----------------------------------------------------------------------------
// Lazy Loading Select (generic)

function LazyLoadingSelect({
    ...props
}: LazyLoadingSelectProps) {
    return (<>
        <Select
            {...props}
            getOptionLabel={(option: SearchResult) => option.label}
            getOptionValue={(option: SearchResult) => option.uuid}
            loadingMessage={() => 'Carregando...'}
            noOptionsMessage={() => 'Nenhum resultado.'}
            placeholder="Digite para buscar..."
            components={{ MenuList: CustomMenuList }}
            // styles={handleReactSelectStyling()}
        />
    </>)
}

// -----------------------------------------------------------------------------
// Lazy Loading Select With States (generic for both single and multi select)

type LazyLoadingSelectWithStatesProps = {
    routeName: string;
    value?: SearchResult | SearchResult[];
    isMulti?: boolean;
    [key: string]: any; // Allow additional props
}

function LazyLoadingSelectWithStates({
    ...props
}: LazyLoadingSelectWithStatesProps) {
    const [fetchedOptions, setFetchedOptions] = useState<MultiValue<SearchResult>>([]);
    const [selectedOption, setSelectedOption] = useState<SearchResult | null>(props.value as SearchResult || null);
    const [selectedOptions, setSelectedOptions] = useState<MultiValue<SearchResult>>(props.value as SearchResult[] || []);

    const onSelectInputChange = (q: string) => {
        fetchDataForSelect({
            routeName: props.routeName,
            q: q,
            setter: setFetchedOptions
        });
    };

    useEffect(() => {
        console.log('selectedOptions', selectedOptions);
        console.log('selectedOption', selectedOption);
    }, [selectedOptions, selectedOption]);

    const onSelectChange = (options: SingleValue<SearchResult> | MultiValue<SearchResult>) => {
        if (props.isMulti) {
            setSelectedOption(null);
            setSelectedOptions(options as MultiValue<SearchResult>);
        } else {
            setSelectedOption(options as SingleValue<SearchResult>);
            setSelectedOptions([]);
        }

        setFetchedOptions([]);
        if (props.onChange) {
            props.onChange(options);
        }
    };

    return (<>
        <Select
            {...props}
            isMulti={props.isMulti || false}
            getOptionLabel={(option: SearchResult) => option.label}
            getOptionValue={(option: SearchResult) => option.uuid}
            onInputChange={onSelectInputChange}
            options={fetchedOptions}
            onChange={onSelectChange}
            value={props.isMulti ? selectedOptions : selectedOption}
            loadingMessage={() => 'Carregando...'}
            noOptionsMessage={() => 'Nenhum resultado.'}
            placeholder="Digite para buscar..."
            components={{ MenuList: CustomMenuList }}
            // styles={handleReactSelectStyling()}
        />
    </>)
}

// -----------------------------------------------------------------------------
// Select With States (generic for both single and multi select)

type SelectWithStatesProps = {
    routeName: string;
    value?: SearchResult | SearchResult[];
    isMulti?: boolean;
    [key: string]: any; // Allow additional props
}

function SelectWithStates({
    ...props
}: SelectWithStatesProps) {
    const [fetchedOptions, setFetchedOptions] = useState<MultiValue<SearchResult>>();
    const [selectedOption, setSelectedOption] = useState<SearchResult | null>(props.value as SearchResult || null);
    const [selectedOptions, setSelectedOptions] = useState<MultiValue<SearchResult>>(props.value as SearchResult[] || []);

    const onSelectInputChange = (q: string) => {
        fetchDataForSelect({
            routeName: props.routeName,
            q: q,
            setter: setFetchedOptions
        });
    };

    useEffect(() => {
        console.log('selectedOptions', selectedOptions);
        console.log('selectedOption', selectedOption);
    }, [selectedOptions, selectedOption]);

    const onSelectChange = (options: SingleValue<SearchResult> | MultiValue<SearchResult>) => {
        if (props.isMulti) {
            setSelectedOption(null);
            setSelectedOptions(options as MultiValue<SearchResult>);
        } else {
            setSelectedOption(options as SingleValue<SearchResult>);
            setSelectedOptions([]);
        }

        // setFetchedOptions([]);
        if (props.onChange) {
            props.onChange(options);
        }
    };

    useEffect(() => {
        fetchDataForSelect({
            routeName: props.routeName,
            q: 'all',
            setter: setFetchedOptions
        });
    }, []);

    return (<>
        <Select
            {...props}
            isMulti={props.isMulti || false}
            getOptionLabel={(option: SearchResult) => option.label}
            getOptionValue={(option: SearchResult) => option.uuid}
            // onInputChange={onSelectInputChange}
            options={fetchedOptions}
            onChange={onSelectChange}
            value={props.isMulti ? selectedOptions : selectedOption}
            loadingMessage={() => 'Carregando...'}
            noOptionsMessage={() => 'Nenhum resultado.'}
            // placeholder="Digite para buscar..."
            // components={{ MenuList: CustomMenuList }}
            // styles={handleReactSelectStyling()}
        />
    </>)
}

// -----------------------------------------------------------------------------
// Lazy Loading Single Select With States (only single select)

type LazyLoadingSingleSelectWithStatesProps = {
    routeName?: string;
    options?: SearchResult[];
    value?: SearchResult | null;
    [key: string]: any; // Allow additional props
}

function LazyLoadingSingleSelectWithStates({
    ...props
}: LazyLoadingSingleSelectWithStatesProps) {
    const [fetchedOptions, setFetchedOptions] = useState<SearchResult[]>(props.options || []);
    const [selectedOption, setSelectedOption] = useState<SearchResult | null>(props.value || null);

    const onSelectInputChange = (q: string) => {
        fetchDataForSelect({
            routeName: props.routeName || '',
            q: q,
            setter: setFetchedOptions
        });
    };

    const onSelectChange = (option: SingleValue<SearchResult>) => {
        setSelectedOption(option);
        setFetchedOptions([]);
        if (props.onChange) {
            props.onChange(option || null);
        }
    };

    return (<>
        <Select
            {...props}
            getOptionLabel={(option: SearchResult) => option.label}
            getOptionValue={(option: SearchResult) => option.uuid}
            onInputChange={onSelectInputChange}
            options={fetchedOptions}
            onChange={onSelectChange}
            value={selectedOption}
            loadingMessage={() => 'Carregando...'}
            noOptionsMessage={() => 'Nenhum resultado.'}
            placeholder="Digite para buscar..."
            components={{ MenuList: CustomMenuList }}
            // styles={handleReactSelectStyling()}
        />
    </>)
}

// -----------------------------------------------------------------------------
// Lazy Loading Multi Select With States (only multi select)

type LazyLoadingMultiSelectWithStatesProps = {
    routeName: string;
    value?: SearchResult[];
    [key: string]: any; // Allow additional props
}

function LazyLoadingMultiSelectWithStates({
    ...props
}: LazyLoadingMultiSelectWithStatesProps) {
    const [fetchedOptions, setFetchedOptions] = useState<MultiValue<SearchResult>>([]);
    const [selectedOptions, setSelectedOptions] = useState<MultiValue<SearchResult>>(props.value || []);

    const onSelectInputChange = (q: string) => {
        fetchDataForSelect({
            routeName: props.routeName,
            q: q,
            setter: setFetchedOptions
        });
    };

    const onSelectChange = (options: MultiValue<SearchResult>) => {
        setSelectedOptions(options);
        setFetchedOptions([]);
        if (props.onChange) {
            props.onChange(options);
        }
    };

    return (<>
        <Select
            {...props}
            isMulti
            getOptionLabel={(option: SearchResult) => option.label}
            getOptionValue={(option: SearchResult) => option.uuid}
            onInputChange={onSelectInputChange}
            options={fetchedOptions}
            onChange={onSelectChange}
            value={selectedOptions}
            loadingMessage={() => 'Carregando...'}
            noOptionsMessage={() => 'Nenhum resultado.'}
            placeholder="Digite para buscar..."
            components={{ MenuList: CustomMenuList }}
            // styles={handleReactSelectStyling()}
        />
    </>)
}

// -----------------------------------------------------------------------------
// Fetch data for select options

type FetchDataForSelectProps = {
    routeName: string | '';
    q: string | '';
    setter: (options: SearchResult[]) => void;
}

async function fetchDataForSelect({
    routeName,
    q,
    setter
}: FetchDataForSelectProps): Promise<SearchResult[] | undefined> {
    if (q.length < 1) {
        return;
    }

    let response;

    fetch(
        route(routeName, { q: q }),
        {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
            },
        })
        .then((res) => res.json())
        .then((data) => {
            response = data as { results: SearchResult[] };
            setter(
                response.results.map((object: SearchResult) => ({
                    uuid: object.uuid,
                    label: object.label,
                }))
            );
        });

    return response;
};

// -----------------------------------------------------------------------------
// Custom Menu List component to show a message at the bottom

const CustomMenuList = (props: any) => {
    return (
        <>
            <components.MenuList {...props}>
                {props.children}
            </components.MenuList>
            <div className="text-center text-gray-400 text-md p-2">
                Digite para refinar a busca...
            </div>
        </>
    );
};

export {
    LazyLoadingSelect,
    LazyLoadingSelectWithStates,
    SelectWithStates,
    LazyLoadingSingleSelectWithStates,
    LazyLoadingMultiSelectWithStates,
    fetchDataForSelect,
    CustomMenuList
};
