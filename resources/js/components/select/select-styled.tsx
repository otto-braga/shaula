import SelectBase, { Props as SelectProps } from "react-select";

export default function Select(props: SelectProps<any>) {
    const darkMode = document.documentElement.classList.contains('dark');
    let customStyles = props.styles;

    // Apply custom styles for both light and dark modes
    customStyles = {
        ...customStyles,
        control: (base) => ({
            ...base,
            borderRadius: '0.5rem',
            zIndex: 1000, // Ensure the control appears above other elements
        }),
        menu: (base) => ({
            ...base,
            borderRadius: '0.5rem',
            zIndex: 1000, // Ensure the menu appears above other elements
        }),
    };

    // Apply custom styles for dark mode
    if (darkMode) {
        customStyles = {
            ...customStyles,
            control: (base) => ({
                ...base,
                backgroundColor: 'var(--background)',
                borderColor: 'var(--border)',
                boxShadow: 'none',
                '&:hover': {
                    borderColor: 'var(--border-hover)',
                },
            }),
            option: (base) => ({
                ...base,
                backgroundColor: 'var(--background)',
                color: 'var(--text)',
                '&:hover': {
                    backgroundColor: 'var(--secondary)',
                    color: 'var(--text)',
                },
            }),
            placeholder: (base) => ({
                ...base,
                color: 'var(--placeholder)',
            }),
            input: (base) => ({
                ...base,
                color: 'var(--text)',
            }),
            singleValue: (base) => ({
                ...base,
                color: 'var(--text)',
            }),
            multiValue: (base) => ({
                ...base,
                backgroundColor: 'var(--secondary)',
            }),
            multiValueLabel: (base) => ({
                ...base,
                color: 'var(--text)',
            }),
            multiValueRemove: (base) => ({
                ...base,
                color: 'var(--text)',
                '&:hover': {
                    backgroundColor: 'var(--primary)',
                    color: 'var(--secondary)',
                },
            }),
            menuList: (base) => ({
                ...base,
                backgroundColor: 'var(--background)',
                color: 'var(--text)',
            }),
            menu: (base) => ({
                ...base,
                backgroundColor: 'var(--background)',
                color: 'var(--text)',
                borderRadius: '0.5rem',
                border: '1px solid grey',
                zIndex: 3,
            }),
        };
    }

    // Handle custom styling for light mode
    if (!darkMode && props.styles) {
        customStyles = {
            ...customStyles,
            control: (base) => ({
                ...base,
                backgroundColor: 'white',
                borderColor: '#ccc',
                boxShadow: 'none',
                '&:hover': {
                    borderColor: '#aaa',
                },
            }),
            menu: (base) => ({
                ...base,
                backgroundColor: 'white',
            }),
        };
    }

    return (
        <SelectBase
            {...props}
            styles={{
                ...customStyles,
            }}
        />
    );
}
