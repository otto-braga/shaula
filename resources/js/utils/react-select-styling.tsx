import { CSSObjectWithLabel, Theme } from 'react-select';

export const handleReactSelectStyling = (isDisabled: boolean = false) => {
    const isDarkMode = document.documentElement.classList.contains('dark'); // Check if dark mode is active
    if (isDarkMode) {
        return {
            control: (base: CSSObjectWithLabel) => ({
                ...base,
                backgroundColor: isDisabled ? '#222' : 'black',
                color: 'white',
                borderColor: isDisabled ? '#222' : 'grey',
                boxShadow: 'none',
                '&:hover': {
                    borderColor: isDisabled ? 'grey' : 'white',
                },
            }),
            option: (base: CSSObjectWithLabel) => ({
                ...base,
                backgroundColor: 'black',
                color: 'white',
                '&:hover': {
                    backgroundColor: '#333',
                    color: 'white',
                },
            }),
            multiValue: (base: CSSObjectWithLabel) => ({
                ...base,
                backgroundColor: '#333',
                color: 'white',
            }),
            multiValueLabel: (base: CSSObjectWithLabel) => ({
                ...base,
                color: 'white',
            }),
            multiValueRemove: (base: CSSObjectWithLabel) => ({
                ...base,
                color: 'white',
                '&:hover': {
                    backgroundColor: 'black',
                    color: 'white',
                },
            }),
            input: (base: CSSObjectWithLabel) => ({
                ...base,
                color: 'white',
            }),
            placeholder: (base: CSSObjectWithLabel) => ({
                ...base,
                color: 'white',
            }),
            singleValue: (base: CSSObjectWithLabel) => ({
                ...base,
                color: isDisabled ? 'grey' : 'white',
            }),
            menu: (base: CSSObjectWithLabel) => ({
                ...base,
                backgroundColor: 'black',
                color: 'white',
                zIndex: 3,
            }),
            menuList: (base: CSSObjectWithLabel) => ({
                ...base,
                backgroundColor: 'black',
                color: 'white',
            }),
            indicatorSeparator: (base: CSSObjectWithLabel) => ({
                ...base,
                backgroundColor: isDisabled ? 'black' : 'grey',
                color: 'white',
            }),
            dropdownIndicator: (base: CSSObjectWithLabel) => ({
                ...base,
                backgroundColor: isDisabled ? '#222' : 'black',
                color: isDisabled ? 'grey' : 'white',
            }),
            clearIndicator: (base: CSSObjectWithLabel) => ({
                ...base,
                backgroundColor: 'black',
                color: 'white',
            }),
            loadingIndicator: (base: CSSObjectWithLabel) => ({
                ...base,
                backgroundColor: 'black',
                color: 'white',
            }),
            noOptionsMessage: (base: CSSObjectWithLabel) => ({
                ...base,
                backgroundColor: 'black',
                color: 'white',
            }),
            menuPortal: (base: CSSObjectWithLabel) => ({
                ...base,
                backgroundColor: 'black',
                color: 'white',
            }),
        }
    }
    else {
        return {
            menu: (base: CSSObjectWithLabel) => ({
                ...base,
                zIndex: 3,
            }),
        }
    }
}

export const handleReactSelectTheming = (theme: Theme) => {
    const isDarkMode = document.documentElement.classList.contains('dark'); // Check if dark mode is active
    if (isDarkMode) {
        return {
            ...theme,
            colors: {
                ...theme.colors,
                // Override the default colors for dark mode
                neutral0: "black", //background color
                neutral30: "hotpink", //control/borderColor(focused)
                neutral10: "grey", //selected option bg color
                neutral50: "grey", // pacleholder color
                neutral80: "white", //input color
                primary25: "grey", //option bg color focued
                primary: "black", //option bg color selected
                primary50: "white", // option bg color active(enavled or available)
            }
        }
    }
    else {
        return {
            ...theme
        }
    }
}
