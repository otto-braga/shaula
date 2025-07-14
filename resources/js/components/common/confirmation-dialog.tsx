import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Circle } from 'lucide-react';
import React, { useState } from 'react';

interface ConfirmationDialogProps {
    className?: string;
    onClick: () => void;
    button_children?: React.ReactNode;
    children?: React.ReactNode;
    submit_button?: React.ReactNode;
    message?: string;
}

export default function ConfirmationDialog({ className, onClick, button_children, children, submit_button, message }: ConfirmationDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild className={className}>
                {/* <Button onClick={() => setIsOpen(true)}>
                    {button_children || <Circle />}
                </Button> */}
                {button_children || (
                    <Button variant="outline" onClick={() => setIsOpen(true)}>
                        <Circle className="text-blue-600" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Confirmar</DialogTitle>
                {message ? <p>{message}</p> : <p>Tem certeza de que deseja continuar?</p>}
                {children}
                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button variant="secondary" onClick={() => setIsOpen(false)}>
                            Cancelar
                        </Button>
                    </DialogClose>
                    {submit_button || (
                        <Button variant="default" onClick={onClick}>
                            Continuar
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
