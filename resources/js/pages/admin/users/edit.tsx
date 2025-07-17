import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { User } from '@/types/user';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { SelectWithStates } from '@/components/select/lazy-loading-select';
import { SearchResult } from '@/types/search-result';
import SubmitConfirmationButton from '@/components/edit/submit-confirmation-button';
import EditLayout from '@/components/edit/edit-layout';

export default function Index({
    user,
}: {
    user: User,
}) {
    const isEdit = !!user;

    const { data, setData, post, processing } = useForm({
        role_uuid: user ? user.role?.uuid : '' as string,
    });
    const { errors } = usePage().props;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            post(route('users.update', user.uuid), {
                preserveScroll: true,
                preserveState: false,
            });
        } else {
            post(route('users.store'), {
                preserveScroll: true,
                preserveState: false,
            });
        }
    };

    return (
        <EditLayout className="py-4">
            <form onSubmit={submit} className="space-y-3 bg-inherit">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">{user.name}</h1>
                    <SubmitConfirmationButton
                        onSubmit={submit}
                        processing={processing}
                    />
                </div>

                {isEdit}

                <div>
                    <Label htmlFor="role_uuid">Função</Label>
                    <SelectWithStates
                        routeName={'roles.fetch.options.all'}
                        value={{ uuid: user?.role.uuid, label: user?.role.label }}
                        onChange={(option: SearchResult) => {
                            setData('role_uuid', option.uuid)
                        }}
                    />
                    <InputError className="mt-2" message={errors.role_uuid} />
                </div>

            </form>
        </EditLayout>
    );
}
