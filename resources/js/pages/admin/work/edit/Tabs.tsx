import { Button } from '@/components/ui/button';
import { Work } from '@/types/work';
import { Link } from '@inertiajs/react';

type TabsProps = {
    work?: { data: Work };
    processing: boolean;
};

export default function Tabs({ work, processing }: TabsProps) {
    // console.log('success', usePage().props.flash?.success);
    // console.log('error', usePage().props.flash?.error);

    const isEdit = !!work;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col">
                <h2 className="text-lg">{isEdit ? `${work.data.title}` : '[novo cadastro]'}</h2>
            </div>
            <div className="flex flex-row items-center justify-between rounded p-3 dark:border">
                <div className={'flex flex-wrap gap-2 divide-x' + (!isEdit ? ' pointer-events-none' : '')}>
                    {isEdit && (
                        <>
                            <Link
                                className={'px-3' + (!isEdit ? ' text-slate-300' : '') + (route().current('work.edit') ? ' font-bold underline' : '')}
                                href={isEdit ? route('work.edit', { id: work?.data.uuid }) : ''}
                            >
                                Dados
                            </Link>
                            <Link
                                className={
                                    'px-3' + (!isEdit ? ' text-slate-300' : '') + (route().current('work.edit.people') ? ' font-bold underline' : '')
                                }
                                href={isEdit ? route('work.edit.people', { id: work?.data.uuid }) : ''}
                            >
                                Pessoas
                            </Link>
                            <Link
                                className={
                                    'px-3' +
                                    (!isEdit ? ' text-slate-300' : '') +
                                    (route().current('work.edit.relations') ? ' font-bold underline' : '')
                                }
                                href={isEdit ? route('work.edit.relations', { id: work?.data.uuid }) : ''}
                            >
                                Relações
                            </Link>
                            <Link
                                className={
                                    'px-3' + (!isEdit ? ' text-slate-300' : '') + (route().current('work.edit.images') ? ' font-bold underline' : '')
                                }
                                href={isEdit ? route('work.edit.images', { id: work?.data.uuid }) : ''}
                                // active={route().current('work.edit.images')}
                            >
                                Imagens
                            </Link>
                            <Link
                                className={
                                    'px-3' + (!isEdit ? ' text-slate-300' : '') + (route().current('work.edit.content') ? ' font-bold underline' : '')
                                }
                                href={isEdit ? route('work.edit.content', { id: work?.data.uuid }) : ''}
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
                                    href={isEdit ? route('work.edit.details', { id: work?.data.uuid }) : ''}
                                    // active={route().current('work.edit.details')}
                                >
                                    Detalhes
                                </Link>
                            )}
                        </>
                    )}
                </div>
                <div className="ml-8 flex justify-end">
                    <Button type="submit" disabled={processing}>
                        Salvar
                    </Button>
                </div>
            </div>

            {/* {usePage().props.flash?.success && (
                <TimedMessage variant="success" duration={3000}>
                    <p className="w-full rounded bg-yellow-100 text-center  text-gray-600 dark:text-gray-400">
                        salvamento realizado com sucesso
                    </p>
                </TimedMessage>
            )}

            {usePage().props.flash?.error && (
                <TimedMessage variant="success" duration={3000}>
                    <p className="w-full rounded bg-red-100 text-center  text-gray-600 dark:text-gray-400">erro ao salvar</p>
                </TimedMessage>
            )} */}
        </div>
    );
}
