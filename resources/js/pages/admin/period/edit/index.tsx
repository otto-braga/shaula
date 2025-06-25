import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Period } from '@/types/period';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import { LazyLoadingMultiSelect } from '@/components/select/lazyLoadingMultiSelect';
import EditTabs from '@/components/edit/edit-tabs';
import { LazyLoadingSelectWithStates } from '@/components/select/lazy-loading-select';
import { SearchResult } from '@/types/search-result';
import { MultiValue } from 'react-select';

export default function Index({
    period,
}: {
    period: { data: Period },
}) {
    const isEdit = !!period;

    const { data, setData, post, patch, errors, processing } = useForm({
        name: period ? period.data.name : '' as string,
        start_date: period ? period.data.start_date : '' as string,
        end_date: period ? period.data.end_date : '' as string,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            post(route('periods.update', period.data), {
                preserveScroll: true,
                preserveState: false,
            });
        } else {
            post(route('periods.store'), {
                preserveScroll: true,
                preserveState: false,
            });
        }
    };

    useEffect(() => {
        console.log('data', data);
    }, [data]);

    return (
        <AppLayout>
            <Head/>
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="">
                        <form onSubmit={submit} className="space-y-3 bg-inherit">
                            <EditTabs
                                model={period}
                                route_base_name="periods"
                                processing={processing}
                            />

                            {isEdit}

                            <div>
                                <Label htmlFor="name">Título</Label>
                                <Input id="name" value={data.name ?? ''} onChange={(e) => setData('name', e.target.value)} autoComplete="name" />
                                <InputError className="mt-2" message={errors.name} />
                            </div>

                            <div>
                                <Label htmlFor="start_date">Data de início</Label>
                                <Input id="start_date" value={data.start_date ?? ''} onChange={(e) => setData('start_date', e.target.value)} autoComplete="start_date" />
                                <InputError className="mt-2" message={errors.start_date} />
                            </div>

                            <div>
                                <Label htmlFor="end_date">Data de término</Label>
                                <Input id="end_date" value={data.end_date ?? ''} onChange={(e) => setData('end_date', e.target.value)} autoComplete="end_date" />
                                <InputError className="mt-2" message={errors.end_date} />
                            </div>

                        </form>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
