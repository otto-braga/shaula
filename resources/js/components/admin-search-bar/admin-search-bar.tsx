import { Button } from '@/components/ui/button';
import { Input } from '../ui/input';
import { FormEventHandler } from 'react';
import { useForm } from '@inertiajs/react';

export type AdminSearchBarProps = {
    route: string;
    className?: string;
}

function AdminSearchBar(props : AdminSearchBarProps) {
    const { data, setData, get, errors, processing } = useForm({
        q: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        get(route(props.route), {
            preserveState: true,
            preserveScroll: true,
        });
    }

    return (
        <form onSubmit={submit} className={'flex items-center justify-between gap-4 w-full' + (props.className ? ` ${props.className}` : '')}>
            <Input
                type="text"
                placeholder="digite sua pesquisa"
                className="w-full"
                onChange={(e) => {
                    setData('q', e.target.value);
                }}
            />
            <Button
                type='submit'
                variant="secondary"
                // className="ml-2"
                disabled={processing}
            >
                Pesquisar
            </Button>
        </form>
    );
}

export { AdminSearchBar }
