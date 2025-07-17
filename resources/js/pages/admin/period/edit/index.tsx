import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Period } from '@/types/period';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import EditTabs from '@/components/edit/edit-tabs';
import EditLayout from '@/components/edit/edit-layout';

export default function Index({
    period,
}: {
    period: { data: Period },
}) {
    const isEdit = !!period;

    const { data, setData, post, processing } = useForm({
        name: period ? period.data.name : '' as string,
        start_date: period ? period.data.start_date : '' as string,
        end_date: period ? period.data.end_date : '' as string,
    });
    const { errors } = usePage().props;

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
        <EditLayout>
            <form onSubmit={submit} className="space-y-3 bg-inherit">
                <EditTabs
                    model={period}
                    route_base_name="periods"
                    processing={processing}
                />

                {isEdit}

                <div>
                    <Label htmlFor="name">Nome</Label>
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
        </EditLayout>
    );
}
