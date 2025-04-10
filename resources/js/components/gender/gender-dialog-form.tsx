import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gender } from '@/types/gender';
import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface GenderDialogFormProps {
    gender?: Gender;
}

export default function GenderDialogForm({ gender }: GenderDialogFormProps) {
    const [isOpen, setIsOpen] = useState(false);

    const {
        data,
        setData,
        post,
        put: update,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        name: gender ? gender.name : '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (gender) {
            update(route('genders.update', gender.id), {
                preserveScroll: true,
                onSuccess: () => closeModal(),
                onFinish: () => reset(),
            });
        } else {
            post(route('genders.store'), {
                preserveScroll: true,
                onSuccess: () => closeModal(),
                onFinish: () => reset(),
            });
        }
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
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant={`${gender ? 'secondary' : 'default'}`} onClick={openModal}>
                    <div className="flex items-center">
                        {!gender ? (
                            <>
                                <Plus size={16} />
                                <span>Gênero</span>
                            </>
                        ) : (
                            <span>Editar</span>
                        )}
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>{gender ? 'Editar Id. de Gênero' : 'Criar Id. de Gênero'}</DialogTitle>
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
                            <button type="submit">{gender ? 'Salvar' : 'Criar'}</button>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
