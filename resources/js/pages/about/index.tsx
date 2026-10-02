import ExpandableImage from '@/components/expandable-image';
import PublicLayout from '@/layouts/public-layout';

export interface AboutFile {
    uuid: string;
    name?: string;
    original_name?: string;
    mime_type?: string;
    path: string;
    collection?: string;
    size?: number;
    is_primary?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface AboutData {
    id?: number;
    uuid: string;
    title: string;
    content: string | null;
    cover_image?: AboutFile | null;
    coverImage?: AboutFile | null;
    created_at?: string;
    updated_at?: string;
}

export interface AboutPageProps {
    about:
        | {
              data: AboutData;
          }
        | AboutData;
}

export default function Index({ about }: AboutPageProps) {
    const data = 'data' in about ? about.data : about;
    const coverImage = data?.cover_image || data?.coverImage;

    return (
        <PublicLayout head={data?.title || 'Sobre'}>
            <article className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
                {/* Header Section */}
                <header className="mb-8 space-y-3 sm:mb-12">
                    <span className="text-xs font-semibold tracking-widest text-zinc-500 uppercase dark:text-zinc-400">Institucional</span>
                    <h1 className="text-3xl font-medium tracking-tight text-zinc-950 sm:text-4xl lg:text-5xl dark:text-zinc-50">
                        {data?.title || 'Sobre o Shaula'}
                    </h1>
                </header>

                {/* Hero Section for Cover Image */}
                {coverImage?.path && (
                    <div className="mb-10 overflow-hidden rounded-sm bg-zinc-100 shadow-sm sm:mb-14 dark:bg-zinc-900">
                        <div className="relative aspect-[16/9] w-full sm:aspect-[21/9] md:h-[420px] lg:h-[480px] xl:h-[540px]">
                            <ExpandableImage
                                src={coverImage.path}
                                alt={coverImage.original_name || data?.title || 'Imagem de Capa'}
                                className="h-full w-full object-cover object-center"
                            />
                        </div>
                    </div>
                )}

                {/* Prose Content Container */}
                {data?.content ? (
                    <div
                        dangerouslySetInnerHTML={{ __html: data.content }}
                        className="[&_a]:text-primary [&_th]:border-border [&_td]:border-border max-w-none text-lg leading-relaxed text-zinc-800 md:text-xl md:leading-relaxed lg:text-2xl lg:leading-relaxed dark:text-zinc-200 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:opacity-80 [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-zinc-400 [&_blockquote]:pl-4 [&_blockquote]:text-zinc-700 [&_blockquote]:italic dark:[&_blockquote]:border-zinc-600 dark:[&_blockquote]:text-zinc-300 [&_h1]:mt-10 [&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-medium [&_h1]:text-zinc-950 md:[&_h1]:text-3xl dark:[&_h1]:text-zinc-50 [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-xl [&_h2]:font-medium [&_h2]:text-zinc-950 md:[&_h2]:text-2xl dark:[&_h2]:text-zinc-50 [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-zinc-950 md:[&_h3]:text-xl dark:[&_h3]:text-zinc-50 [&_img]:mx-auto [&_img]:my-8 [&_img]:block [&_img]:max-w-full [&_img]:rounded-sm [&_li]:leading-relaxed [&_ol]:mb-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_p]:mb-6 [&_p]:leading-relaxed [&_strong]:font-semibold [&_strong]:text-zinc-950 dark:[&_strong]:text-zinc-50 [&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:p-2 [&_th]:border [&_th]:p-2 [&_th]:text-left [&_th]:font-semibold [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6"
                    />
                ) : (
                    <div className="rounded-lg border border-dashed border-zinc-200 p-8 text-center text-zinc-500 dark:border-zinc-800">
                        Nenhum conteúdo cadastrado para a página Sobre até o momento.
                    </div>
                )}
            </article>
        </PublicLayout>
    );
}
