import { Button } from '@/components/ui/button';
import { Artwork } from '@/types/artwork';
import { HistoryArticle } from '@/types/historyArticle';
import { Period } from '@/types/period';
import { Person } from '@/types/person';
import { Review } from '@/types/review';
import { Source } from '@/types/source';
import { Link, usePage } from '@inertiajs/react';
import { CheckIcon, XIcon } from 'lucide-react';
import { useEffect, useState,  } from 'react';

type EditTabsProps = {
    model?: { data: Person | Artwork | Review | HistoryArticle | Period | Source };
    route_base_name: string;
    processing: boolean;
    className?: string;
    hasPeopleTab?: boolean;
    hasImagesTab?: boolean;
    hasContentTab?: boolean;
    hasSourcesTab?: boolean;
};

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

    const { flash } = usePage().props;

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

    return (
        <div className={"flex flex-col gap-2" + (className ? ' ' + className : '')}>
            <div className="flex flex-col">
                <h2 className="text-lg">{isEdit ? `${
                    'title' in model.data ? model.data.title : (
                        'name' in model.data ? model.data.name : ''
                    )
                }` : '[novo cadastro]'}</h2>
            </div>
            <div className="flex flex-row items-center justify-between rounded p-3 dark:border">
                <div className={'flex flex-wrap gap-2 divide-x' + (!isEdit ? ' pointer-events-none' : '')}>
                    {isEdit && (
                        <>

                            <Link
                                className={
                                    'px-3' + (!isEdit ? ' text-slate-300' : '') + (route().current(route_base_name + '.edit') ? ' font-bold underline' : '')
                                }
                                href={isEdit ? route(route_base_name + '.edit', model?.data) : ''}
                            >
                                Dados
                            </Link>

                            { hasPeopleTab && (
                                <Link
                                    className={
                                        'px-3' + (!isEdit ? ' text-slate-300' : '') + (route().current(route_base_name + '.edit.people') ? ' font-bold underline' : '')
                                    }
                                    href={isEdit ? route(route_base_name + '.edit.people', model?.data) : ''}
                                >
                                    Pessoas
                                </Link>
                            )}

                            { hasImagesTab && (
                                <Link
                                    className={
                                        'px-3' + (!isEdit ? ' text-slate-300' : '') + (route().current(route_base_name + '.edit.images') ? ' font-bold underline' : '')
                                    }
                                    href={isEdit ? route(route_base_name + '.edit.images', model?.data) : ''}
                                >
                                    Imagens
                                </Link>
                            )}

                            { hasContentTab && (
                                <Link
                                    className={
                                        'px-3' + (!isEdit ? ' text-slate-300' : '') + (route().current(route_base_name + '.edit.content') ? ' font-bold underline' : '')
                                    }
                                    href={isEdit ? route(route_base_name + '.edit.content', model?.data) : ''}
                                >
                                    Conteúdo
                                </Link>
                            )}

                            { hasSourcesTab && (
                                <Link
                                    className={
                                        'px-3' + (!isEdit ? ' text-slate-300' : '') + (route().current(route_base_name + '.edit.sources') ? ' font-bold underline' : '')
                                    }
                                    href={isEdit ? route(route_base_name + '.edit.sources', model?.data) : ''}
                                >
                                    Fontes
                                </Link>
                            )}

                        </>
                    )}
                </div>

                <div className="ml-8 flex justify-end">
                    <Button type="submit"
                        disabled={processing || isTimedMessageShown}
                        className={
                            'rounded min-w-[8em]' +
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
