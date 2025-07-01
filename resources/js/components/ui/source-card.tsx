import { Source } from '@/types/source';

function SourceCard({
    source,
    className = "",
    ...props
}: {
    source: Source,
    className?: string
}) {
    return (
        <a className={`${className}`}
            href={source.file?.path}
        >
            {source.content}
        </a>
    )
}

export { SourceCard }
