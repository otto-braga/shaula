import { Button } from '@/components/ui/button';
import { HistoryArticle } from '@/types/historyArticle';
import { Link, usePage } from '@inertiajs/react';
import { CheckIcon, XIcon } from 'lucide-react';
import { useEffect, useState,  } from 'react';

type TabsProps = {
    historyArticle?: { data: HistoryArticle };
    processing: boolean;
    className?: string;
};

export default function Tabs({ historyArticle, processing, className }: TabsProps) {
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

    const isEdit = !!historyArticle;

    return (
        <div className={"flex flex-col gap-2" + (className ? ' ' + className : '')}>
            <div className="flex flex-col">
                <h2 className="text-lg">{isEdit ? `${historyArticle.data.title}` : '[novo cadastro]'}</h2>
            </div>
            <div className="flex flex-row items-center justify-between rounded p-3 dark:border">
                <div className={'flex flex-wrap gap-2 divide-x' + (!isEdit ? ' pointer-events-none' : '')}>
                    {isEdit && (
                        <>
                            <Link
                                className={
                                    'px-3' + (!isEdit ? ' text-slate-300' : '') + (route().current('history_articles.edit') ? ' font-bold underline' : '')
                                }
                                href={isEdit ? route('history_articles.edit', { historyArticle: historyArticle?.data }) : ''}
                            >
                                Dados
                            </Link>
                            <Link
                                className={
                                    'px-3' + (!isEdit ? ' text-slate-300' : '') + (route().current('history_articles.edit.images') ? ' font-bold underline' : '')
                                }
                                href={isEdit ? route('history_articles.edit.images', { historyArticle: historyArticle?.data }) : ''}
                            >
                                Imagens
                            </Link>
                            <Link
                                className={
                                    'px-3' + (!isEdit ? ' text-slate-300' : '') + (route().current('history_articles.edit.content') ? ' font-bold underline' : '')
                                }
                                href={isEdit ? route('history_articles.edit.content', { historyArticle: historyArticle?.data }) : ''}
                            >
                                Conteúdo
                            </Link>
                            <Link
                                className={
                                    'px-3' + (!isEdit ? ' text-slate-300' : '') + (route().current('history_articles.edit.mentions') ? ' font-bold underline' : '')
                                }
                                href={isEdit ? route('history_articles.edit.mentions', { historyArticle: historyArticle?.data }) : ''}
                            >
                                Menções
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
