import PrimaryButton from '@/Components/PrimaryButton';
import TabLink from '@/Components/TabLink';
import TimedMessage from '@/Components/TimedMessage';
import { PageProps } from '@/types';
import { Work } from '@/types/work';
import { Transition } from '@headlessui/react';
import { usePage } from '@inertiajs/react';

type TabsProps = {
    work?: { data: Work },
    processing: boolean,
}

export default function Tabs({
    work,
    processing,
}: TabsProps) {
    // console.log('success', usePage().props.flash?.success);
    // console.log('error', usePage().props.flash?.error);

    const isEdit = !!work;

    return (
        <div className='flex flex-col gap-2 sticky top-0 z-10 bg-inherit p-2 border-b-2 h-[100px]'>
            <div className='flex flex-col'>
                <h2 className='text-lg'>
                    {isEdit ? `${work.data.title}` : '[novo cadastro]'}
                </h2>
            </div>
            <div className='flex flex-row justify-between items-center'>
                <div className={"flex flex-row gap-8" + (!isEdit ? " pointer-events-none" : "")} >
                    { isEdit && <>
                    <TabLink className={'text-sm' + (!isEdit ? " text-slate-300" : "")} href={isEdit ? route('work.edit', { id: work?.data.uuid }) : ''} active={isEdit ? route().current('work.edit') : route().current('work.create')}>
                        Dados
                    </TabLink>
                    <TabLink className={'text-sm' + (!isEdit ? " text-slate-300" : "")} href={isEdit ? route('work.edit.people', { id: work?.data.uuid }) : ''} active={route().current('work.edit.people')}>
                        Pessoas
                    </TabLink>
                    <TabLink className={'text-sm' + (!isEdit ? " text-slate-300" : "")} href={isEdit ? route('work.edit.relations', { id: work?.data.uuid }) : ''} active={route().current('work.edit.relations')}>
                        Relações
                    </TabLink>
                        <TabLink className={'text-sm' + (!isEdit ? " text-slate-300" : "")} href={isEdit ? route('work.edit.images', { id: work?.data.uuid }) : ''} active={route().current('work.edit.images')}>
                        Imagens
                    </TabLink>
                    <TabLink className={'text-sm' + (!isEdit ? " text-slate-300" : "")} href={isEdit ? route('work.edit.content', { id: work?.data.uuid }) : ''} active={route().current('work.edit.content')}>
                        Conteúdo
                    </TabLink>
                    {
                        work?.data.work_type !== 'review' && (
                            <TabLink className={'text-sm' + (!isEdit ? " text-slate-300" : "")} href={isEdit ? route('work.edit.details', { id: work?.data.uuid }) : ''} active={route().current('work.edit.details')}>
                                Detalhes
                            </TabLink>
                        )
                    }
                    </>}
                </div>
                <div className='flex justify-end ml-8'>
                    <PrimaryButton type="submit" disabled={processing}>
                        Salvar
                    </PrimaryButton>
                </div>
            </div>

            { usePage().props.flash?.success && (
                <TimedMessage variant="success" duration={3000}>
                    <p className="text-sm text-center text-gray-600 dark:text-gray-400 w-full bg-yellow-100 rounded">
                        salvamento realizado com sucesso
                    </p>
                </TimedMessage>
            )}

            { usePage().props.flash?.error && (
                <TimedMessage variant="success" duration={3000}>
                    <p className="text-sm text-center text-gray-600 dark:text-gray-400 w-full bg-red-100 rounded">
                        erro ao salvar
                    </p>
                </TimedMessage>
            )}
        </div>
    )
}