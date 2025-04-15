import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Period } from '@/types/period';
import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface PeriodDialogFormProps {
    period?: Period;
}

export default function PeriodDialogForm({ period }: PeriodDialogFormProps) {
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
        name: period ? period.name : '',
        start_date: period ? period.start_date : '',
        end_date: period ? period.end_date : '',
        about: period ? period.about : '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (period) {
            update(route('categories.update', period.id), {
                preserveScroll: true,
                onSuccess: () => closeModal(),
                onFinish: () => reset(),
            });
        } else {
            post(route('categories.store'), {
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
                <Button variant={`${period ? 'secondary' : 'default'}`} onClick={openModal}>
                    <div className="flex items-center">
                        {!period ? (
                            <>
                                <Plus size={16} />
                                <span>Período histórico</span>
                            </>
                        ) : (
                            <span>Editar</span>
                        )}
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>{period ? 'Editar Tag' : 'Criar Tag'}</DialogTitle>
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
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="sr-only">
                            Data de início
                        </Label>

                        {/* <Select
                            id="languages"
                            isMulti
                            options={years.map((year) => ({ value: year, label: year.toString() }))}
                            value={data.start_date.map((year: string) => ({ value: year, label: year.toString() }))}
                            onChange={(options) => {
                                setData(
                                    'languages',
                                    options.map((option) => ({ id: option.value, name: option.label, label: option.label })),
                                );
                            }}
                            styles={handleReactSelectStyling()}
                        /> */}

                        <Input
                            id="start_date"
                            type="date"
                            name="name"
                            value={data.start_date}
                            onChange={(e) => setData('start_date', e.target.value)}
                            placeholder="Data de início"
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
                            <button type="submit">{period ? 'Salvar' : 'Criar'}</button>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
