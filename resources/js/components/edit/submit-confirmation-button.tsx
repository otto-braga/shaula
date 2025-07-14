import { Button } from '@/components/ui/button';
import { FormEventHandler, useEffect, useState, } from 'react';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { usePage } from '@inertiajs/react';
import SubmitButton from './submit-button';

export default function SubmitConfirmationButton({
    onSubmit,
    processing = false,
}: {
    onSubmit: FormEventHandler;
    processing?: boolean;
}) {
    const [isOpen, setIsOpen] = useState(false);

    const { flash } = usePage().props as { error?: boolean, flash?: { success?: boolean } };

    const timedMessageDuration: number = 3000;
    const [isTimedMessageShown, setIsTimedMessageShown] = useState<boolean>(false);

    useEffect(() => {
        if (flash?.success != undefined && !isTimedMessageShown) {
            setIsTimedMessageShown(true);
            setTimeout(() => {
                setIsTimedMessageShown(false);
            }, timedMessageDuration);
        }
    }, [flash]);

    return (<>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>

            <DialogTrigger asChild>
                <SubmitButton
                    processing={processing}
                    isSubmit={false}
                    onClick={() => setIsOpen(true)}
                />
            </DialogTrigger>

            <DialogContent>
                <DialogTitle>Confirmar</DialogTitle>
                <p>Tem certeza de que deseja continuar?</p>
                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button variant="secondary" onClick={() => setIsOpen(false)}>
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button variant="default" onClick={(e) => {
                        setIsOpen(false);
                        onSubmit(e);
                    }}>
                        Continuar
                    </Button>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    </>);
}
