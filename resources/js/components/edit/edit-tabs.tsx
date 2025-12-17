import { Button } from '@/components/ui/button';
import { Person, PersonLabels } from '@/types/person';
import { Artwork, ArtworkLabels } from '@/types/artwork';
import { Exhibit, ExhibitLabels } from '@/types/exhibit';
import { Review, ReviewLabels } from '@/types/review';
import { Period, PeriodLabels } from '@/types/period';
import { HistoryArticle, HistoryArticleLabels } from '@/types/historyArticle';
import { Source, SourceLabels } from '@/types/source';
import { Link, usePage } from '@inertiajs/react';
import { CheckIcon, XIcon } from 'lucide-react';
import { useEffect, useState,  } from 'react';

enum Labels {
    people = PersonLabels.TYPE_LABEL,
    artworks = ArtworkLabels.TYPE_LABEL,
    exhibits = ExhibitLabels.TYPE_LABEL,
    reviews = ReviewLabels.TYPE_LABEL,
    history_articles = HistoryArticleLabels.TYPE_LABEL,
    periods = PeriodLabels.TYPE_LABEL,
    sources = SourceLabels.TYPE_LABEL,
};

type EditTabsProps = {
    model?: { data: Person | Artwork | Exhibit | Review | HistoryArticle | Period | Source };
    // model?: { data: any };
    route_base_name: string;
    processing: boolean;
    className?: string;
    hasPeopleTab?: boolean;
    hasImagesTab?: boolean;
    hasContentTab?: boolean;
    hasSourcesTab?: boolean;
};

function EditTabsLink({
    slug,
    route_base_name,
    desired_route,
    isEdit,
    children,
}: {
    slug: string;
    route_base_name: string;
    desired_route: string;
    isEdit: boolean;
    children: React.ReactNode;
}) {
    desired_route = desired_route ? '.' + desired_route : '';
    return (
        <Link
            className={
                'flex items-center pl-8 justify-center h-8 border-r border-t rounded-t px-3' + (!isEdit ? ' text-slate-300' : '') + (route().current(route_base_name + '.edit' + desired_route) ? ' border-r-2 font-semibold bg-accent' : '')
            }
            href={isEdit ? route(route_base_name + '.edit' + desired_route, slug) : ''}
        >
            {children}
        </Link>
    );
}

export default function EditTabs({
    model,
    route_base_name,
    processing,
    className,
    hasPeopleTab = false,
    hasImagesTab = false,
    hasContentTab = false,
    hasSourcesTab = false,
}: EditTabsProps) {
    switch (route_base_name) {
        case 'people':
            hasImagesTab = hasImagesTab || true;
            hasContentTab = hasContentTab || true;
            hasSourcesTab = hasSourcesTab || true;
            break;
        case 'artworks':
            hasPeopleTab = hasPeopleTab || true;
            hasImagesTab = hasImagesTab || true;
            hasContentTab = hasContentTab || true;
            hasSourcesTab = hasSourcesTab || true;
            break;
        case 'exhibits':
            hasPeopleTab = hasPeopleTab || true;
            hasImagesTab = hasImagesTab || true;
            hasContentTab = hasContentTab || true;
            hasSourcesTab = hasSourcesTab || true;
            break;
        case 'reviews':
            hasImagesTab = hasImagesTab || true;
            hasContentTab = hasContentTab || true;
            hasSourcesTab = hasSourcesTab || true;
            break;
        case 'history_articles':
            hasImagesTab = hasImagesTab || true;
            hasContentTab = hasContentTab || true;
            hasSourcesTab = hasSourcesTab || true;
            break;
        case 'periods':
            hasImagesTab = hasImagesTab || true;
            hasContentTab = hasContentTab || true;
            hasSourcesTab = hasSourcesTab || true;
            break;
        case 'sources':
            break;
        default:
            break;
    }

    const { flash } = usePage().props as { error?: boolean, flash?: { success?: boolean } };

    const timedMessageDuration: number = 3000;
    const [isTimedMessageShown, setIsTimedMessageShown] = useState<boolean>(false);

    useEffect(() => {
        if (flash?.success != undefined && !isTimedMessageShown) {
            setIsTimedMessageShown(true);
            setTimeout(() => {
                setIsTimedMessageShown(false);
            }, timedMessageDuration);
        }
    }, [ flash ]);

    const isEdit = !!model;

    console.log('EditTabs model',  (model));

    return (
        <div className={"flex flex-col gap-2 pt-4" + (className ? ' ' + className : '')}>
            <div className="flex flex-col">
                <div className="flex flex-col items-center justify-center flex-wrap gap-2 sm:flex-row">
                <h2 className="flex-1 text-xl font-bold text-center">{isEdit ? `${
                    'title' in model.data ? model.data.title : (
                        'name' in model.data ? model.data.name : ''
                    )
                }` : '[novo cadastro]'}</h2>
                {Labels[route_base_name as keyof typeof Labels] && (
                    <span className="self-center text-xs text-muted-foreground border py-1 px-2 rounded sm:self-end">
                        {Labels[route_base_name as keyof typeof Labels]}
                    </span>
                )}
                </div>
            </div>
            <div className="text-xs flex flex-col overflow-x-hidden w-full items-center justify-between rounded sm:flex-row">
                <div className={'flex py-4 mr-4 overflow-x-scroll w-full'
                    + (!isEdit ? ' pointer-events-none' : '')
                }>
                    {isEdit && (
                        <>

                            <EditTabsLink slug={model.data.slug ?? ''} route_base_name={route_base_name} desired_route="" isEdit={isEdit}>
                                Editar
                            </EditTabsLink>

                            {hasPeopleTab && (
                                <EditTabsLink slug={model.data.slug ?? ''} route_base_name={route_base_name} desired_route="people" isEdit={isEdit}>
                                    Pessoas
                                </EditTabsLink>
                            )}

                            {hasImagesTab && (
                                <EditTabsLink slug={model.data.slug ?? ''} route_base_name={route_base_name} desired_route="images" isEdit={isEdit}>
                                    Imagens
                                </EditTabsLink>
                            )}

                            {hasContentTab && (
                                <EditTabsLink slug={model.data.slug ?? ''} route_base_name={route_base_name} desired_route="content" isEdit={isEdit}>
                                    Conteúdo
                                </EditTabsLink>
                            )}

                            {hasSourcesTab && (
                            <EditTabsLink slug={model.data.slug ?? ''} route_base_name={route_base_name} desired_route="sources" isEdit={isEdit}>
                                Fontes
                            </EditTabsLink>
                            )}

                        </>
                    )}
                </div>

                <div className="flex justify-end">
                    <Button type="submit"
                        disabled={processing || isTimedMessageShown}
                        className={
                            'w-24 text-xs' +
                            (
                                isTimedMessageShown ?
                                    (
                                        flash?.success ?
                                            ' bg-green-400'
                                            : ' bg-red-400'
                                    )
                                    : (
                                        ''
                                    )
                            )
                        }
                        >
                        {
                            processing ?
                                'Salvando...'
                                : isTimedMessageShown ?
                                    (
                                        flash?.success ?
                                            (
                                                <div className="flex items-center gap-2">
                                                    Salvo! <CheckIcon className="h-16 w-16" />
                                                </div>
                                            )
                                            : (
                                                <div className="flex items-center gap-2">
                                                    Erro! <XIcon className="h-16 w-16" />
                                                </div>
                                            )
                                    )
                                    : 'Salvar'
                        }
                    </Button>
                </div>
            </div>
        </div>
    );
}
