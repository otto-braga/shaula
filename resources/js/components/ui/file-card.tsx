import { Label } from '@/components/ui/label';
import { FileProps } from '@/types/file';
import { Button } from '@/components/ui/button';
import { CheckIcon, DeleteIcon } from 'lucide-react';

function FileEditCard({
    file,
    primaryFileId,
    filesToRemove,
    fileToSelect,
    setFilesToRemove,
    setFileToSelect,
    className = "",
    ...props
}: {
    file: FileProps,
    primaryFileId?: number | 0,
    filesToRemove: Array<number>,
    fileToSelect: number,
    setFilesToRemove: (filesToRemove: Array<number>) => void,
    setFileToSelect: (fileToSelect: number) => void,
    className?: string
}) {
  return (
      <div key={file.id} className='flex flex-col items-center justify-items-center justify-between w-64'>
            <Label className='w-full text-center'>
                {file.original_name}
            </Label>
            {file.mime_type === 'application/pdf' ? (
                <iframe
                    key={file.id + 'pdf'}
                    src={file.path}
                    className={
                        'object-cover w-full h-32 rounded-lg shadow-md'
                        + (filesToRemove.find(id => id === file.id) ? ' opacity-50' : '')
                    }
                    title={file.path}
                />
            ) : (
                <img key={file.id + 'file'} src={file.path} alt={file.path}
                    className={
                        'object-cover w-full h-32 rounded-lg shadow-md'
                        + (filesToRemove.find(id => id === file.id) ? ' opacity-50' : '')
                    }
                />
            )}
            <div className='w-full flex flex-col justify-between'>
                <Button
                    key={file.id + 'select_button'}
                    type="button"
                    className={
                        (file.id == fileToSelect ? 'bg-blue-600 hover:bg-blue-300' : 'bg-gray-100 hover:bg-blue-300')
                    }
                    onClick={
                        () => {
                            setFileToSelect(file.id);
                        }
                    }
                >
                    <CheckIcon /> Principal
                </Button>
                <Button
                    key={file.id + 'delete_button'}
                    type="button"
                    className={
                        (filesToRemove.find(id => id === file.id) ? 'bg-red-600 hover:bg-red-300' : 'bg-gray-100 hover:bg-red-300')
                    }
                    onClick={
                        () => {
                            if (!filesToRemove.find(id => id === file.id)) {
                                setFilesToRemove([...filesToRemove, file.id]);
                                if (file.id === fileToSelect) {
                                    setFileToSelect(0);
                                }
                            } else {
                                setFilesToRemove(filesToRemove.filter((i) => i !== file.id));
                                if (file.id === primaryFileId && fileToSelect === 0) {
                                    setFileToSelect(primaryFileId || 0);
                                }
                            }
                        }
                    }
                >
                    <DeleteIcon /> Deletar
                </Button>
            </div>
      </div>
  )
}

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
            <div className={`flex flex-col items-center justify-items-center ${className}`}>
            {file?.mime_type === 'application/pdf' ? (
                <iframe
                    key={file.id + 'pdf'}
                    src={file.path}
                    className={'object-cover w-full h-full rounded-lg'}
                />
            ) : (
                <img key={file?.id + 'file'} src={file?.path} alt={file?.path}
                    className={'object-cover w-full h-full rounded-lg'}
                />
            )}
            </div>
        )
    )
}

export { FileEditCard, FileCard }
