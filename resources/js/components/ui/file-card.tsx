import { Label } from '@/components/ui/label';
import { FileProps } from '@/types/file';
import { Button } from '@/components/ui/button';
import { CheckIcon, DeleteIcon } from 'lucide-react';

function FileCard({
    file,
    className = "",
    ...props
}: {
    file: FileProps | null,
    className?: string
}) {
    return (
        file === null ? (
            <div className={`flex flex-col items-center justify-items-center ${className}`}>
            </div>
        ) : (
            <div className={`flex flex-col items-center justify-items-center ${className}`} {...props}>
                <p className='text-xs text-center break-all text-wrap my-2'>
                    {file.original_name || `Arquivo ${file.uuid}`}
                </p>
                {file?.mime_type === 'application/pdf' ? (
                    <iframe
                        key={file.uuid + 'pdf'}
                        src={file.path}
                        className={`object-cover flex flex-col items-center justify-items-center ${className}`}
                        title={file.path}
                    />
                ) : (
                    <img key={file?.uuid + 'file'} src={file?.path} alt={file?.path}
                        className={`object-cover flex flex-col items-center justify-items-center ${className}`}
                    />
                )}
            </div>
        )
    )
}

export { FileCard }
