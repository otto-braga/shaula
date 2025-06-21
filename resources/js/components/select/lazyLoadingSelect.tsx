import { handleReactSelectStyling } from "@/utils/react-select-styling";
import { useState } from "react";
import Select, { SingleValue, components } from 'react-select';

type Option = {
    value: number;
    label: string;
};

export type { Option };

type FetchDataForMultiSelectProps = {
    route: string | '';
    search: string | '';
    setterFunction: (options: Option[]) => void;
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
                }) as Option) as Option[]
            );
        });

    return response;
};

type LazyLoadingSelectProps = {
    initialOption: Option;
    routeName: string;
    setterFunction: (option: Option) => void;
}

export const CustomMenuList = (props: any) => {
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

function LazyLoadingSelect({
    initialOption,
    routeName,
    setterFunction,
    ...props
} : LazyLoadingSelectProps) {

    const [selectedOption, setSelectedOption] = useState<Option>(initialOption);

    const [fetchedOptions, setFetchedOptions] = useState<Option[]>([]);

    const onOptionSelectChange = (option: Option) => {
        setSelectedOption(option);
        setFetchedOptions([]);
        setterFunction(option);
    };

    const onOptionSelectInputChange = (inputValue: string) => {
        fetchDataForMultiSelect({
            route: route(routeName, { search: inputValue }),
            search: inputValue,
            setterFunction: setFetchedOptions,
        });
    };

    return (<>
        <Select
            options={fetchedOptions}
            value={selectedOption}
            onChange={
                (option: SingleValue<Option>) => {
                    if (option) {
                        onOptionSelectChange(option);
                    }
                }
            }
            onInputChange={onOptionSelectInputChange}
            loadingMessage={() => 'Carregando...'}
            noOptionsMessage={() => 'Nenhum resultado.'}
            placeholder="Digite para buscar..."
            components={{ MenuList: CustomMenuList }}
            styles={handleReactSelectStyling()}
        />
    </>)
}
export { LazyLoadingSelect }
