import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Award } from '@/types/award';
import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface AwardDialogFormProps {
    award?: Award;
}

export default function AwardDialogForm({ award }: AwardDialogFormProps) {
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
        name: award ? award.name : '',
        promoter: award ? award.promoter : '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (award) {
            update(route('awards.update', award), {
                preserveScroll: true,
                onSuccess: () => closeModal(),
                onFinish: () => reset(),
            });
        } else {
            post(route('awards.store'), {
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
                <Button variant={`${award ? 'secondary' : 'default'}`} onClick={openModal}>
                    <div className="flex items-center">
                        {!award ? (
                            <>
                                <Plus size={16} />
                                <span>Prêmio</span>
                            </>
                        ) : (
                            <span>Editar</span>
                        )}
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>{award ? 'Editar Prêmio' : 'Criar Prêmio'}</DialogTitle>
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

                        <Input
                            id="promoter"
                            type="text"
                            name="promoter"
                            value={data.promoter || ''}
                            onChange={(e) => setData('promoter', e.target.value)}
                            placeholder="Promotor (opcional)"
                        />

                        <InputError message={errors.promoter} />
                    </div>

                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary" onClick={closeModal}>
                                Cancelar
                            </Button>
                        </DialogClose>

                        <Button variant="default" disabled={processing} asChild>
                            <button type="submit">{award ? 'Salvar' : 'Criar'}</button>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
