import { Source } from '@/types/source';

function SourceCard({
    source,
    className = "",
    ...props
}: {
    source: Source,
    className?: string
}) {
    let href = source.file?.path;
    let content = source.content;

    if (!href) {
        const contentHasLink = source.content.includes('<a ') && source.content.includes('</a>');

        if (href == null && contentHasLink) {
            href = source.content.split('<a ')[1].split('href="')[1].split('"')[0];
        }
    }
    else {
        // remove any <a> tags from content
        content = source.content.replace(/<a[^>]*>(.*?)<\/a>/g, '$1');
    }

    if (!href) {
        return (
            <span {...props} dangerouslySetInnerHTML={{ __html: source.content }} >
            </span>
        )
    }

    return (
        <a className={`${className} hover:underline`}
            href={href}
            target='_blank'
            dangerouslySetInnerHTML={{ __html: content }}
        >
        </a>
    )
}

export { SourceCard };

