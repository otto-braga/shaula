import { useEffect, useState } from 'react';

import { FilePondFile, FilePondInitialFile } from 'filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';
import { FilePond, registerPlugin } from 'react-filepond';
import { Button } from '@/components/ui/button';
import { DeleteIcon } from 'lucide-react';
import { FileProps } from '@/types/file';
import { FileCard } from '../ui/file-card';
registerPlugin(FilePondPluginImagePreview);

type EditFileProps = {
    stored_file: FileProps | null;
    data: {
        files: Array<File>;
        delete_file: false | boolean;
    };
    setData: (key: string, value: any) => void;
    errors?: Record<string, string>;
    processing?: boolean;
};

export default function EditFile({
    stored_file,
    data,
    setData,
    errors,
    processing,
}: EditFileProps) {
    const [files, setFiles] = useState<Array<FilePondInitialFile | File | Blob | string>>([]);

    useEffect(() => {
        setData('files', files as File[]);
    }, [files]);

    return (
        <>
            <div className="flex flex-col gap-2 mb-4">
            <div className="flex-1">
                <FilePond
                    files={files}
                    onupdatefiles={(imageItems: FilePondFile[]) => {
                        setFiles(imageItems.map((imageItem) => imageItem.file as File));
                    }}
                    allowMultiple={false}
                />
            </div>

            <div className="flex flex-1 flex-row gap-2">
                { stored_file && (
                    <div key={stored_file?.uuid} className='flex flex-col items-center w-full'>
                        <FileCard
                            key={stored_file?.uuid + 'file_card'}
                            file={stored_file}
                            className={
                                'w-full h-96 flex flex-col items-center justify-between'
                                + (data.delete_file ? ' opacity-50' : '')
                            }
                        />
                        <div className='w-full flex flex-col justify-between'>
                            <Button
                                key={stored_file?.uuid + 'delete_button'}
                                type="button"
                                className={
                                    (data.delete_file ? 'bg-red-600 hover:bg-red-300' : 'bg-gray-100 hover:bg-red-300')
                                }
                                onClick={
                                    () => {
                                        setData('delete_file', !data.delete_file);
                                    }
                                }
                            >
                                <DeleteIcon /> Deletar
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            </div>
        </>
    );
}

