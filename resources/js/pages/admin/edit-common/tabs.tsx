import { Button } from '@/components/ui/button';
import { Artwork } from '@/types/artwork';
import { Review } from '@/types/review';
import { HistoryArticle } from '@/types/historyArticle';
import { Person } from '@/types/person';
import { Link, usePage } from '@inertiajs/react';
import { CheckIcon, XIcon } from 'lucide-react';
import { useEffect, useState,  } from 'react';

type TabsProps = {
    model?: { data: Artwork | Review | HistoryArticle | Person },
    type: string,
    processing: boolean;
    className?: string;
};

export default function Tabs({ model, type, processing, className }: TabsProps) {
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
                <h2 className="text-lg">{isEdit ? `${ 'title' in model.data ? model.data.title : ('name' in model.data ? model.data.name : '')}` : '[novo cadastro]'}</h2>
            </div>
            <div className="flex flex-row items-center justify-between rounded p-3 dark:border">
                <div className={'flex flex-wrap gap-2 divide-x' + (!isEdit ? ' pointer-events-none' : '')}>
                    {isEdit && (
                        <>
                            <Link
                                className={
                                    'px-3' + (!isEdit ? ' text-slate-300' : '') + (route().current(type + '.edit') ? ' font-bold underline' : '')
                                }
                                href={isEdit ? route(type + '.edit', model?.data) : ''}
                            >
                                Dados
                            </Link>
                            <Link
                                className={
                                    'px-3' + (!isEdit ? ' text-slate-300' : '') + (route().current(type + '.edit.people') ? ' font-bold underline' : '')
                                }
                                href={isEdit ? route(type + '.edit.people', model?.data) : ''}
                            >
                                Pessoas
                            </Link>
                            <Link
                                className={
                                    'px-3' + (!isEdit ? ' text-slate-300' : '') + (route().current(type + '.edit.images') ? ' font-bold underline' : '')
                                }
                                href={isEdit ? route(type + '.edit.images', model?.data) : ''}
                            >
                                Imagens
                            </Link>
                            <Link
                                className={
                                    'px-3' + (!isEdit ? ' text-slate-300' : '') + (route().current(type + '.edit.content') ? ' font-bold underline' : '')
                                }
                                href={isEdit ? route(type + '.edit.content', model?.data) : ''}
                            >
                                Conteúdo
                            </Link>
                            <Link
                                className={
                                    'px-3' + (!isEdit ? ' text-slate-300' : '') + (route().current(type + '.edit.sources') ? ' font-bold underline' : '')
                                }
                                href={isEdit ? route(type + '.edit.sources', model?.data) : ''}
                            >
                                Fontes
                            </Link>
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
