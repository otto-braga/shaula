import { FileProps } from '@/types/file';
import { Button } from '../ui/button';
import { CheckIcon, DeleteIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

type ContentImageCardProps = {
    image: FileProps,
    initToRemove?: boolean,
    onSelectedChange: () => void,
    onRemoveChange: (isToRemove: boolean) => void,
}

export default function ContentImageCard({
    image,
    initToRemove = false,
    onSelectedChange,
    onRemoveChange,
}: ContentImageCardProps) {

    const [isToRemove, setIsToRemove] = useState(initToRemove);

    useEffect(() => {
        onRemoveChange(isToRemove);
    }, [isToRemove]);

    return (
        <>
            <div className='flex flex-col'>
                <img key={image.id} src={image.path} alt={image.path}
                    className={
                        'object-cover w-32 h-32 rounded-lg shadow-md'
                        + (isToRemove ? ' opacity-50' : '')
                    }
                />
                <Button
                    key={image.id + 'select_button'}
                    type="button"
                    className='bg-gray-100 hover:bg-blue-300'
                    onClick={
                        () => {
                            onSelectedChange();
                        }
                    }
                >
                    <CheckIcon/>
                </Button>
                <Button
                    key={image.id + 'delete_button'}
                    type="button"
                    className={
                        (isToRemove ? 'bg-red-600 hover:bg-red-300' : 'bg-gray-100 hover:bg-red-300')
                    }
                    onClick={
                        () => {
                            if (!isToRemove) {
                                setIsToRemove(true);
                            }
                            else {
                                setIsToRemove(false);
                            }
                        }
                    }
                >
                    <DeleteIcon/>
                </Button>
            </div>
        </>
    );
}
