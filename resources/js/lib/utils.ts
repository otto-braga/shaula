import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
    return new Date(date).toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        // hour: 'numeric',
        // minute: 'numeric',
        timeZone: 'UTC',
    });
}

export function safeFormatDate(dateStr?: string | null): string | null {
    if (!dateStr) return null;
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return formatDate(dateStr);
    } catch {
        return dateStr;
    }
}

export interface FormatExhibitDateOptions {
    prefixSince?: string;
    prefixUntil?: string;
}

export function formatExhibitDateRange(startDate?: string | null, endDate?: string | null, options?: FormatExhibitDateOptions): string | null {
    const formattedStart = safeFormatDate(startDate);
    const formattedEnd = safeFormatDate(endDate);

    const prefixSince = options?.prefixSince ?? 'A partir de ';
    const prefixUntil = options?.prefixUntil ?? 'Até ';

    if (formattedStart && formattedEnd) {
        return `${formattedStart} – ${formattedEnd}`;
    }

    if (formattedStart) {
        return `${prefixSince}${formattedStart}`;
    }

    if (formattedEnd) {
        return `${prefixUntil}${formattedEnd}`;
    }

    return null;
}
