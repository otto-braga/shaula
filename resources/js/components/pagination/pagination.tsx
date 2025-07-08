import { Button } from '@/components/ui/button';
import Select, { MultiValue, SingleValue, components } from 'react-select';
import { isNumberObject } from 'util/types';

export type PaginationPropsOld = {
    data: any[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
}

export type PaginationProps = {
    // data: any[];
    // meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    // }
}

function PaginationControls({ pagination, className }: { pagination: PaginationProps } & { className?: string }) {
    return (
        <div className={`flex justify-center ${className}`}>
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
                        options={pagination.links
                            .filter((link, index) => index !== 0 && index !== pagination.links.length - 1)
                            .map((link, index) => ({
                                value: link.url || '',
                                label: link.label,
                                isDisabled: !link.url,
                                isSelected: link.active,
                            }))
                        }
                        value={pagination.links.find(link => link.active) || { value: '', label: 'Página atual' }}
                        onChange={(option: SingleValue<{ value: string; label: string }>) => {
                            if (option && option.value) {
                                window.location.href = option.value;
                            }
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

                    {/* {pagination.links
                        .filter((link, index) => index !== 0 && index !== pagination.links.length - 1)
                        .map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                className={link.active ? 'bg-blue-500 text-white' : ''}
                                onClick={
                                    () => link.url && window.location.href === link.url ? undefined : window.location.href = link.url || ''
                                }
                            >
                                {link.label}
                            </Button>
                        )
                    )} */}

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
                {/* <p className="text-sm text-gray-500 mt-2">
                    página {pagination.current_page} de {pagination.last_page}
                </p> */}
            </div>
        </div>
    );
}

export { PaginationControls }
