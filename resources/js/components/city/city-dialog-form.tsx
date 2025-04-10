import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { City } from '@/types/city';
import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface CityDialogFormProps {
    city?: City;
}

export default function CityDialogForm({ city }: CityDialogFormProps) {
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
        name: city ? city.name : '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (city) {
            update(route('cities.update', city.id), {
                preserveScroll: true,
                onSuccess: () => closeModal(),
                onFinish: () => reset(),
            });
        } else {
            post(route('cities.store'), {
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
                <Button variant={`${city ? 'secondary' : 'default'}`} onClick={openModal}>
                    <div className="flex items-center">
                        {!city ? (
                            <>
                                <Plus size={16} />
                                <span>Cidade</span>
                            </>
                        ) : (
                            <span>Editar</span>
                        )}
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>{city ? 'Editar Cidade' : 'Criar Cidade'}</DialogTitle>
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
                            <button type="submit">{city ? 'Salvar' : 'Criar'}</button>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
