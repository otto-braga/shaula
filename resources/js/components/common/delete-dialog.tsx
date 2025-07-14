import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { Trash } from 'lucide-react';
import { useState } from 'react';

interface DeleteDialogProps {
    className?: string;
    resourceId: number | string;
    resourceName: string;
    deleteRoute: string;
    onSuccess: () => void;
}

export default function DeleteDialog({ className, resourceId, resourceName, deleteRoute, onSuccess }: DeleteDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(route(deleteRoute, resourceId), {
            preserveScroll: true,
            onSuccess: () => {
                setIsOpen(false);
                onSuccess();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild className={className}>
                <Button variant="outline" onClick={() => setIsOpen(true)}>
                    <Trash className="text-red-600" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <p>Tem certeza de que deseja excluir "<b>{resourceName}</b>"?</p>
                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button variant="secondary" onClick={() => setIsOpen(false)}>
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button variant="destructive" disabled={processing} onClick={handleDelete}>
                        Excluir
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
