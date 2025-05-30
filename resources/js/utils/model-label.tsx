export function typeLabel(type: string): string {
    switch (type) {
        case 'App\\Models\\Artwork':
            return 'Obra';
        case 'App\\Models\\Review':
            return 'Crítica';
        case 'App\\Models\\Person':
            return 'Pessoa';
        case 'App\\Models\\Source':
            return 'Fonte';
        case 'App\\Models\\HistoryArticle':
            return 'Artigos de História';
        default:
            return type;
    }
}

export function typeLabelPlural(type: string): string {
    switch (type) {
        case 'App\\Models\\Artwork':
            return 'Obras';
        case 'App\\Models\\Review':
            return 'Críticas';
        case 'App\\Models\\Person':
            return 'Pessoas';
        case 'App\\Models\\Source':
            return 'Fontes';
        case 'App\\Models\\HistoryArticle':
            return 'Artigos de História';
        default:
            return type;
    }
}

export function typeLabelSearch(type: string): string {
    switch (type) {
        case 'artworks':
            return 'Obra';
        case 'reviews':
            return 'Crítica';
        case 'people':
            return 'Pessoa';
        case 'sources':
            return 'Fonte';
        case 'history_articles':
            return 'Artigo de História';
        default:
            return type;
    }
}
