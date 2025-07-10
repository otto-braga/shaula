import { Button } from '@/components/ui/button';
import { Link, usePage } from '@inertiajs/react';
import { CheckIcon, XIcon } from 'lucide-react';
import { useEffect, useState, } from 'react';

export default function SubmitButton({
    processing,
    isEdit = false,
}: {
    processing: boolean;
    isEdit?: boolean;
}) {
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

    return (
        <Button type="submit"
            disabled={processing || isTimedMessageShown}
            className={
                'rounded min-w-[8em]' +
                (
                    isTimedMessageShown ?
                        (
                            flash?.success ?
                                ' bg-green-400'
                                : ' bg-red-400'
                        )
                        : (
                            ''
                        )
                )
            }
            >
            {
                processing ?
                    'Salvando...'
                    : isTimedMessageShown ?
                        (
                            flash?.success ?
                                (
                                    <div className="flex items-center gap-2">
                                        Salvo! <CheckIcon className="h-16 w-16" />
                                    </div>
                                )
                                : (
                                    <div className="flex items-center gap-2">
                                        Erro! <XIcon className="h-16 w-16" />
                                    </div>
                                )
                        )
                        : 'Salvar'
            }
        </Button>
    );
}
