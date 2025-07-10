import { Button } from '@/components/ui/button';
import Select, { SingleValue } from 'react-select';

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
}

export type PaginationProps = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

function PaginationControls({ pagination, className }: { pagination: PaginationProps } & { className?: string }) {
    return (
        <div className={`${className}`}>
            <div className="flex flex-col items-center justify-between p-3">
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!pagination.links[1].url}
                        onClick={() => window.location.href = pagination.links[1].url || ''}
                    >
                        {'<<'}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!pagination.links[0].url}
                        onClick={() => window.location.href = pagination.links[0].url || ''}
                    >
                        {'<'}
                    </Button>

                    <Select
                        className="w-24"
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option: PaginationLink) => option.url || ''}
                        options={pagination.links
                            .filter((link, index) => index !== 0 && index !== pagination.links.length - 1)
                            .map((link, index) => ({
                                url: link.url || '',
                                label: link.label,
                                active: link.active,
                            }))
                        }
                        value={pagination.links.find(link => link.active) || { url: '', label: 'Página atual', active: true }}
                        onChange={(option: SingleValue<PaginationLink>) => {
                            window.location.href = option?.url || '';
                        }}
                        isSearchable={false}
                        isClearable={false}
                        styles={{
                            control: (base) => ({
                                ...base,
                                minHeight: '32px',
                                height: '32px',
                            }),
                        }}
                    />

                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!pagination.links[pagination.links.length - 1].url}
                        onClick={() => window.location.href = pagination.links[pagination.links.length - 1].url || ''}
                    >
                        {'>'}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!pagination.links[pagination.links.length - 2].url}
                        onClick={() => window.location.href = pagination.links[pagination.links.length - 2].url || ''}
                    >
                        {'>>'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export { PaginationControls }
