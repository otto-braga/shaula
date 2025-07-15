import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

interface DashboardLatestCardProps {
    uuid?: any;
    slug?: string;
    name: string;
    route_base_name: string;
    children?: React.ReactNode;
    is_aux?: boolean;
    className?: string;
}

export default function DashboardLatestCard({
    uuid = '',
    slug = '',
    name = '',
    route_base_name = '',
    children,
    is_aux = false,
    className = '',
}: DashboardLatestCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    const {
        data,
        setData,
        post,
        put: update,
        processing,
        reset,
        clearErrors,
    } = useForm({
        name: name,
    });
    const { errors } = usePage().props;

    const route_name = route_base_name + '.update';

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        update(route(route_name, uuid), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        clearErrors();
        reset();
        setIsOpen(false);
    };

    const openModal = () => {
        setIsOpen(true);
    };

    return (
        <div className={className}>
        {is_aux ? (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant={'outline'}
                        onClick={openModal}
                        className="w-full overflow-hidden justify-start"
                    >
                        {name}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>{'Editar'}</DialogTitle>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="sr-only">
                                Nome
                            </Label>

                            <Input
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Nome"
                            />

                            <InputError message={errors.name} />
                        </div>

                        <DialogFooter className="gap-2">
                            <DialogClose asChild>
                                <Button variant="secondary" onClick={closeModal}>
                                    Cancelar
                                </Button>
                            </DialogClose>

                            <Button variant="default" disabled={processing} asChild>
                                <button type="submit">{'Salvar'}</button>
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        ) : (
            <Button
                variant={'outline'}
                onClick={(e) => {
                    e.preventDefault();
                    window.location.href = route_base_name;
                }}
                className="w-full overflow-hidden justify-start"
            >
                {name}
            </Button>
        )}
        </div>
    );
}
