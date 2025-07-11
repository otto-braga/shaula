import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { User } from '@/types/user';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { LazyLoadingSelectWithStates, SelectWithStates } from '@/components/select/lazy-loading-select';
import { SearchResult } from '@/types/search-result';
import { MultiValue } from 'react-select';
import SubmitButton from '@/components/edit/submit-button';

export default function Index({
    user,
}: {
    user: User,
}) {
    const isEdit = !!user;

    const { data, setData, post, patch, errors, processing } = useForm({
        name: user ? user.name : '' as string,

        roles_uuids: user ? user.roles.map((role) => role.uuid) : [] as string[],
    });

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
        <AppLayout>
            <Head title="Produções" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="">
                        <form onSubmit={submit} className="space-y-3 bg-inherit">
                            <div className="flex justify-between items-center">
                                <h1 className="text-2xl font-bold">{user.name}</h1>
                                <SubmitButton
                                    processing={processing}
                                    isEdit={isEdit}
                                />
                            </div>

                            {isEdit}

                            <div>
                                <Label htmlFor="roles_uuids">Funções</Label>
                                <SelectWithStates
                                    isMulti
                                    routeName={'roles.fetch.options.all'}
                                    value={user?.roles?.map(
                                        role => ({ uuid: role.uuid, label: role.name })
                                    )}
                                    onChange={(options: MultiValue<SearchResult>) => {
                                        setData('roles_uuids', options.map((option) => (option.uuid)))
                                    }}
                                />
                                <InputError className="mt-2" message={errors.roles_uuids} />
                            </div>

                        </form>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
