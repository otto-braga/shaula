import ExpandableImage from '@/components/expandable-image';
import MobileDetailBar from '@/components/public/mobile-detail-bar';
import PublicLayout from '@/layouts/public-layout';
import { ArrowDownRight } from 'lucide-react';

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
    team?: string | null;
    support?: string | null;
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

function hasRichTextContent(html?: string | null): boolean {
    if (!html) return false;
    const text = html
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/gi, ' ')
        .trim();
    return text.length > 0 || /<img\b/i.test(html);
}

const mainProseClasses =
    'tinymce-content max-w-none text-lg leading-relaxed text-zinc-800 md:text-xl md:leading-relaxed dark:text-zinc-200 dark:[&_*]:!bg-transparent dark:[&_*]:!text-zinc-200 [&_a]:text-zinc-950 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:opacity-75 dark:[&_a]:!text-zinc-50 [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-zinc-400 [&_blockquote]:pl-4 [&_blockquote]:text-zinc-700 [&_blockquote]:italic dark:[&_blockquote]:border-zinc-600 dark:[&_blockquote]:!text-zinc-300 [&_h1]:mt-10 [&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-medium [&_h1]:text-zinc-950 md:[&_h1]:text-3xl dark:[&_h1]:!text-zinc-50 [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-xl [&_h2]:font-medium [&_h2]:text-zinc-950 md:[&_h2]:text-2xl dark:[&_h2]:!text-zinc-50 [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-zinc-950 md:[&_h3]:text-xl dark:[&_h3]:!text-zinc-50 [&_img]:my-6 [&_img]:block [&_img]:max-w-full [&_li]:leading-relaxed [&_ol]:mb-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_p]:mb-6 last:[&_p]:mb-0 [&_p]:leading-relaxed [&_strong]:font-semibold [&_strong]:text-zinc-950 dark:[&_strong]:!text-zinc-50 [&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-zinc-200 [&_td]:p-2 dark:[&_td]:border-zinc-800 [&_th]:border [&_th]:border-zinc-200 [&_th]:p-2 [&_th]:text-left [&_th]:font-semibold dark:[&_th]:border-zinc-800 [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6';

const secondaryProseClasses =
    'tinymce-content max-w-none text-base leading-relaxed text-zinc-700 md:text-lg dark:text-zinc-300 dark:[&_*]:!bg-transparent dark:[&_*]:!text-zinc-300 [&_a]:text-zinc-950 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:opacity-75 dark:[&_a]:!text-zinc-50 [&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-zinc-300 [&_blockquote]:pl-4 [&_blockquote]:italic dark:[&_blockquote]:border-zinc-700 [&_h1]:mt-6 [&_h1]:mb-2 [&_h1]:text-lg [&_h1]:font-semibold [&_h1]:text-zinc-950 dark:[&_h1]:!text-zinc-50 [&_h2]:mt-5 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:text-zinc-950 dark:[&_h2]:!text-zinc-50 [&_h3]:mt-4 [&_h3]:mb-1.5 [&_h3]:text-base [&_h3]:font-medium [&_h3]:text-zinc-950 dark:[&_h3]:!text-zinc-50 [&_img]:my-4 [&_img]:block [&_img]:max-w-full [&_li]:leading-relaxed [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5 [&_p]:mb-3 last:[&_p]:mb-0 [&_p]:leading-relaxed [&_strong]:font-semibold [&_strong]:text-zinc-950 dark:[&_strong]:!text-zinc-50 [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-zinc-200 [&_td]:p-2 dark:[&_td]:border-zinc-800 [&_th]:border [&_th]:border-zinc-200 [&_th]:p-2 [&_th]:text-left [&_th]:font-semibold dark:[&_th]:border-zinc-800 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5';

export default function Index({ about }: AboutPageProps) {
    const data = 'data' in about ? about.data : about;
    const coverImage = data?.cover_image || data?.coverImage;

    const hasCover = Boolean(coverImage?.path);
    const hasContent = hasRichTextContent(data?.content);
    const hasTeam = hasRichTextContent(data?.team);
    const hasSupport = hasRichTextContent(data?.support);

    return (
        <PublicLayout head={data?.title || 'Sobre'}>
            {/* Mobile bottom bar for quick access to Equipe and Apoio */}
            {(hasTeam || hasSupport) && (
                <MobileDetailBar title="Equipe e Apoio">
                    <div className="space-y-4 divide-y divide-zinc-200 *:pb-4 last:*:pb-0 dark:divide-zinc-800">
                        {hasTeam && (
                            <div>
                                <p className="mb-2 text-xs font-semibold tracking-widest text-zinc-500 uppercase dark:text-zinc-400">Equipe</p>
                                <div dangerouslySetInnerHTML={{ __html: data.team as string }} className={secondaryProseClasses} />
                            </div>
                        )}
                        {hasSupport && (
                            <div className={hasTeam ? 'pt-4' : ''}>
                                <p className="mb-2 text-xs font-semibold tracking-widest text-zinc-500 uppercase dark:text-zinc-400">Apoio</p>
                                <div dangerouslySetInnerHTML={{ __html: data.support as string }} className={secondaryProseClasses} />
                            </div>
                        )}
                    </div>
                </MobileDetailBar>
            )}

            <article className="bg-white dark:bg-zinc-950">
                {/* Editorial Split Header */}
                <header className="grid grid-cols-1 divide-y divide-zinc-200 border-b border-zinc-200 md:grid-cols-12 md:divide-x md:divide-y-0 dark:divide-zinc-800 dark:border-zinc-800">
                    <div
                        className={`flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-12 ${
                            hasCover ? 'md:col-span-5' : 'md:col-span-12'
                        }`}
                    >
                        <div className="space-y-4">
                            <span className="inline-block text-xs font-semibold tracking-widest text-zinc-500 uppercase dark:text-zinc-400">
                                Institucional
                            </span>
                            <h1 className="text-3xl font-medium tracking-tight text-zinc-950 sm:text-4xl lg:text-5xl dark:text-zinc-50">
                                {data?.title || 'Sobre o Shaula'}
                            </h1>
                        </div>

                        <nav
                            aria-label="Seções da página Sobre"
                            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-zinc-200 pt-6 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
                        >
                            <a
                                href="#apresentacao"
                                className="group inline-flex items-center gap-1 font-medium text-zinc-900 hover:underline dark:text-zinc-100"
                            >
                                <span>Apresentação</span>
                                <ArrowDownRight className="size-3.5 text-zinc-500 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5 dark:text-zinc-400" />
                            </a>
                            <a
                                href="#equipe"
                                className="group inline-flex items-center gap-1 font-medium text-zinc-900 hover:underline dark:text-zinc-100"
                            >
                                <span>Equipe</span>
                                <ArrowDownRight className="size-3.5 text-zinc-500 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5 dark:text-zinc-400" />
                            </a>
                            <a
                                href="#apoio"
                                className="group inline-flex items-center gap-1 font-medium text-zinc-900 hover:underline dark:text-zinc-100"
                            >
                                <span>Apoio</span>
                                <ArrowDownRight className="size-3.5 text-zinc-500 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5 dark:text-zinc-400" />
                            </a>
                        </nav>
                    </div>

                    {hasCover && coverImage && (
                        <div className="bg-zinc-100 p-4 sm:p-6 md:col-span-7 md:p-8 dark:bg-zinc-900">
                            <div className="aspect-video max-h-[55vh] w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                                <ExpandableImage
                                    src={coverImage.path}
                                    alt={coverImage.original_name || data?.title || 'Imagem de Capa'}
                                    className="h-full w-full object-cover object-center"
                                />
                            </div>
                        </div>
                    )}
                </header>

                {/* Divided Institutional Body: Presentation + Equipe & Apoio */}
                <div className="grid grid-cols-1 divide-y divide-zinc-200 lg:grid-cols-12 lg:divide-x lg:divide-y-0 dark:divide-zinc-800">
                    {/* Left Column: Main Institutional Presentation */}
                    <section id="apresentacao" className="p-4 sm:p-6 md:p-8 lg:col-span-7 lg:p-12 xl:col-span-8">
                        <div className="mb-6 space-y-1 border-b border-zinc-200 pb-4 dark:border-zinc-800">
                            <span className="block text-xs font-semibold tracking-widest text-zinc-500 uppercase dark:text-zinc-400">
                                01 / Apresentação
                            </span>
                            <h2 className="text-xl font-medium text-zinc-950 uppercase dark:text-zinc-50">O PROJETO</h2>
                        </div>

                        {hasContent ? (
                            <div dangerouslySetInnerHTML={{ __html: data.content as string }} className={mainProseClasses} />
                        ) : (
                            <p className="py-6 text-base text-zinc-500 dark:text-zinc-400">
                                Nenhum conteúdo institucional cadastrado para a página Sobre até o momento.
                            </p>
                        )}
                    </section>

                    {/* Right Column: Equipe and Apoio stacked with structural hairline divider */}
                    <aside className="divide-y divide-zinc-200 lg:col-span-5 xl:col-span-4 dark:divide-zinc-800">
                        {/* Equipe Section */}
                        <section id="equipe" className="p-4 sm:p-6 md:p-8 lg:p-10">
                            <div className="mb-6 space-y-1 border-b border-zinc-200 pb-4 dark:border-zinc-800">
                                <span className="block text-xs font-semibold tracking-widest text-zinc-500 uppercase dark:text-zinc-400">
                                    02 / Ficha Técnica
                                </span>
                                <h2 className="text-xl font-medium text-zinc-950 uppercase dark:text-zinc-50">EQUIPE</h2>
                            </div>

                            {hasTeam ? (
                                <div dangerouslySetInnerHTML={{ __html: data.team as string }} className={secondaryProseClasses} />
                            ) : (
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    Informações sobre a equipe ainda não cadastradas.
                                </p>
                            )}
                        </section>

                        {/* Apoio Section */}
                        <section id="apoio" className="p-4 sm:p-6 md:p-8 lg:p-10">
                            <div className="mb-6 space-y-1 border-b border-zinc-200 pb-4 dark:border-zinc-800">
                                <span className="block text-xs font-semibold tracking-widest text-zinc-500 uppercase dark:text-zinc-400">
                                    03 / Institucional
                                </span>
                                <h2 className="text-xl font-medium text-zinc-950 uppercase dark:text-zinc-50">APOIO</h2>
                            </div>

                            {hasSupport ? (
                                <div dangerouslySetInnerHTML={{ __html: data.support as string }} className={secondaryProseClasses} />
                            ) : (
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    Informações sobre apoio institucional ainda não cadastradas.
                                </p>
                            )}
                        </section>
                    </aside>
                </div>
            </article>
        </PublicLayout>
    );
}
