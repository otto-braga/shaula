import TimedMessage from '@/components/tabs/timed-message';
import { Button } from '@/components/ui/button';
import { Work } from '@/types/work';
import { Link, usePage } from '@inertiajs/react';
import { CheckIcon, XIcon } from 'lucide-react';
import { useEffect, useState,  } from 'react';

type TabsProps = {
    work?: { data: Work };
    processing: boolean;
    className?: string;
};

export default function Tabs({ work, processing, className }: TabsProps) {
    const { flash } = usePage().props;

    console.log('flash', flash);

    const timedMessageDuration: number = 3000;
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isTimedMessageShown, setIsTimedMessageShown] = useState<boolean>(false);

    useEffect(() => {
        if (flash?.success != undefined && !isTimedMessageShown) {
            setIsTimedMessageShown(true);
            setTimeout(() => {
                setIsTimedMessageShown(false);
            }, timedMessageDuration);
        }
    }, [ flash ]);

    const isEdit = !!work;

    return (
        <div className={"flex flex-col gap-2" + (className ? ' ' + className : '')}>
            <div className="flex flex-col">
                <h2 className="text-lg">{isEdit ? `${work.data.title}` : '[novo cadastro]'}</h2>
            </div>
            <div className="flex flex-row items-center justify-between rounded p-3 dark:border">
                <div className={'flex flex-wrap gap-2 divide-x' + (!isEdit ? ' pointer-events-none' : '')}>
                    {isEdit && (
                        <>
                            <Link
                                className={'px-3' + (!isEdit ? ' text-slate-300' : '') + (route().current('work.edit') ? ' font-bold underline' : '')}
                                href={isEdit ? route('work.edit', { work: work?.data }) : ''}
                            >
                                Dados
                            </Link>
                            <Link
                                className={
                                    'px-3' + (!isEdit ? ' text-slate-300' : '') + (route().current('work.edit.people') ? ' font-bold underline' : '')
                                }
                                // href={isEdit ? route('work.edit.people', { id: work?.data.uuid }) : ''}
                                href={isEdit ? route('work.edit.people', { work: work?.data }) : ''}
                            >
                                Pessoas
                            </Link>
                            <Link
                                className={
                                    'px-3' +
                                    (!isEdit ? ' text-slate-300' : '') +
                                    (route().current('work.edit.relations') ? ' font-bold underline' : '')
                                }
                                href={isEdit ? route('work.edit.relations', { work: work?.data }) : ''}
                            >
                                Relações
                            </Link>
                            <Link
                                className={
                                    'px-3' + (!isEdit ? ' text-slate-300' : '') + (route().current('work.edit.images') ? ' font-bold underline' : '')
                                }
                                href={isEdit ? route('work.edit.images', { work: work?.data }) : ''}
                                // active={route().current('work.edit.images')}
                            >
                                Imagens
                            </Link>
                            <Link
                                className={
                                    'px-3' + (!isEdit ? ' text-slate-300' : '') + (route().current('work.edit.content') ? ' font-bold underline' : '')
                                }
                                href={isEdit ? route('work.edit.content', { work: work?.data }) : ''}
                                // active={route().current('work.edit.content')}
                            >
                                Conteúdo
                            </Link>
                            {work?.data.workable_type !== 'review' && (
                                <Link
                                    className={
                                        'px-3' +
                                        (!isEdit ? ' text-slate-300' : '') +
                                        (route().current('work.edit.details') ? ' font-bold underline' : '')
                                    }
                                    href={isEdit ? route('work.edit.details', { work: work?.data }) : ''}
                                    // active={route().current('work.edit.details')}
                                >
                                    Detalhes
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

            {/* {usePage().props.flash?.success && (
                <TimedMessage variant="success" duration={timedMessageDuration}>
                    <p className="w-full rounded bg-yellow-200 text-center  text-gray-600 dark:text-gray-200 dark:bg-yellow-900">
                        salvamento realizado com sucesso
                    </p>
                </TimedMessage>
            )}

            {usePage().props.flash?.error && (
                <TimedMessage variant="success" duration={timedMessageDuration}>
                    <p className="w-full rounded bg-red-400 text-center  text-gray-600 dark:text-gray-400 dark:bg-red-900">
                        erro ao salvar
                    </p>
                </TimedMessage>
            )} */}
        </div>
    );
}
