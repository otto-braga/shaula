import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginatedLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginatedLink[];
    className?: string;
    anchor?: string;
}

export default function Pagination({ links, className = '', anchor = '' }: PaginationProps) {
    function getLabel(label: string) {
        if (label === '&laquo; Previous') {
            return <ChevronLeft className="h-8 w-8" />;
        }
        if (label === 'Next &raquo;') {
            return <ChevronRight className="h-8 w-8" />;
        }
        return label;
    }

    // Se não houver links para paginar, não renderiza nada.
    if (links.length <= 3) {
        return null;
    }

    return (
        <nav aria-label="Paginação">
            <div className={`mt-8 flex flex-wrap items-center justify-center gap-2 ${className}`}>
                {links.map((link, index) => {
                    const labelContent = getLabel(link.label);
                    const commonClasses = `flex h-10 items-center justify-center  px-4  font-medium`;

                    if (!link.url) {
                        return (
                            <span key={index} className={`${commonClasses} cursor-not-allowed text-gray-300`}>
                                {labelContent}
                            </span>
                        );
                    }

                    return (
                        <Link
                            key={index}
                            href={link.url + anchor}
                            className={`${commonClasses} transition-colors ${link.active ? 'border-black bg-black font-semibold text-white hover:bg-black/90' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            {labelContent}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
