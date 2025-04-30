export function modelLabel(type: string): string {
    switch (type) {
        case 'App\\Models\\Artwork':
            return 'Obra';
        case 'App\\Models\\Review':
            return 'Crítica';
        case 'App\\Models\\Person':
            return 'Pessoa';
        default:
            return type;
    }
}

export function modelLabelPlural(type: string): string {
    switch (type) {
        case 'App\\Models\\Artwork':
            return 'Obras';
        case 'App\\Models\\Review':
            return 'Críticas';
        case 'App\\Models\\Person':
            return 'Pessoas';
        default:
            return type;
    }
}
