import { MultiValue } from "react-select";

export type Option = {
    value: number;
    label: string;
};

export const fetchDataForMultiSelect = async (route: string = '', search: string = '', setterFunction: (options: MultiValue<Option>) => void) => {
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
            console.log('response', response);
            setterFunction(
                response.map((object: Option) => ({
                    value: object.value,
                    label: object.label,
                }) as Option) as MultiValue<Option>
            );
        });

    return response;
};
