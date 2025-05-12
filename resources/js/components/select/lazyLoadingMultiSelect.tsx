import { handleReactSelectStyling } from "@/utils/react-select-styling";
import { useState } from "react";
import Select, { MultiValue, components } from 'react-select';

type Option = {
    value: number;
    label: string;
};

export type { Option };

type FetchDataForMultiSelectProps = {
    route: string | '';
    search: string | '';
    setterFunction: (options: MultiValue<Option>) => void;
}

async function fetchDataForMultiSelect({
    route,
    search,
    setterFunction,
} : FetchDataForMultiSelectProps): Promise<Option[] | undefined> {
    if (search.length < 1) {
        return;
    }

    let response;

    fetch(
        route,
        {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
            },
        })
        .then((res) => res.json())
        .then((data) => {
            response = data as Option[];
            setterFunction(
                response.map((object: Option) => ({
                    value: object.value,
                    label: object.label,
                }) as Option) as MultiValue<Option>
            );
        });

    return response;
};

type LazyLoadingMultiSelectProps = {
    initialOptions: MultiValue<Option>;
    routeName: string;
    type?: string;
    setterFunction: (options: MultiValue<Option>) => void;
}

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

function LazyLoadingMultiSelect({
    initialOptions,
    routeName,
    type = '',
    setterFunction,
    ...props
} : LazyLoadingMultiSelectProps) {

    const [selectedOptions, setSelectedOptions] = useState<MultiValue<Option>>(initialOptions);

    const [fetchedOptions, setFetchedOptions] = useState<MultiValue<Option>>([]);

    const onOptionSelectChange = (options: MultiValue<Option>) => {
        setSelectedOptions(options);
        setFetchedOptions([]);
        setterFunction(options);
    };

    const onOptionSelectInputChange = (inputValue: string, type: string = '') => {
        fetchDataForMultiSelect({
            route: route(routeName, { search: inputValue, type: type }),
            search: inputValue,
            setterFunction: setFetchedOptions,
        });
    };

    return (<>
        <Select
            isMulti
            options={fetchedOptions}
            value={selectedOptions}
            onChange={onOptionSelectChange}
            onInputChange={(inputValue: string) => {
                onOptionSelectInputChange(inputValue, type);
            }}
            loadingMessage={() => 'Carregando...'}
            noOptionsMessage={() => 'Nenhum resultado.'}
            placeholder="Digite para buscar..."
            components={{ MenuList: CustomMenuList }}
            styles={handleReactSelectStyling()}
        />
    </>)
}
export { LazyLoadingMultiSelect }
