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
        <a className={`${className} hover:underline`}
            href={source.file?.path}
            target='_blank'
        >
            {source.content}
        </a>
    )
}

export { SourceCard };

