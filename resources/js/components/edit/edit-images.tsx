import { useEffect, useState } from 'react';

import { FilePondFile, FilePondInitialFile } from 'filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';
import { FilePond, registerPlugin } from 'react-filepond';
import { Button } from '@/components/ui/button';
import { CheckIcon, DeleteIcon } from 'lucide-react';
import { FileProps } from '@/types/file';
registerPlugin(FilePondPluginImagePreview);

type EditImagesProps = {
    stored_images?: Array<FileProps>;
    stored_primary_image_uuid?: string;
    data: {
        files: Array<File>;
        files_to_remove: Array<string>;
        primary_image_uuid: string;
    };
    setData: (key: string, value: any) => void;
    errors?: Record<string, string>;
    processing?: boolean;
};

export default function EditImages({
    stored_images = [],
    stored_primary_image_uuid = '',
    data,
    setData,
    errors,
    processing,
}: EditImagesProps) {
    const [images, setImages] = useState<Array<FilePondInitialFile | File | Blob | string>>([]);

    useEffect(() => {
        setData('files', images as File[]);
    }, [images]);

    const [imagesToRemove, setImagesToRemove] = useState<Array<string>>([]);

    useEffect(() => {
        console.log('imagesToRemove', imagesToRemove);
        setData('files_to_remove', imagesToRemove);
    }, [imagesToRemove]);

    const [imageToSelect, setImageToSelect] = useState<string>(stored_primary_image_uuid);

    useEffect(() => {
        setData('primary_image_uuid', imageToSelect);
        console.log('imageToSelect', imageToSelect);
    }, [imageToSelect]);

    return (
        <>
            <FilePond
                files={images}
                onupdatefiles={(imageItems: FilePondFile[]) => {
                    setImages(imageItems.map((imageItem) => imageItem.file as File));
                }}
                allowMultiple={true}
            />

            <div className="flex flex-row gap-2">
                {stored_images.map((image, index) => (
                    <div key={image.uuid} className='flex flex-col items-center'>
                        <img key={image.uuid + 'image'} src={image.path} alt={image.path}
                            className={
                                'object-cover w-32 h-32 rounded-lg shadow-md'
                                + (imagesToRemove.find(uuid => uuid === image.uuid) ? ' opacity-50' : '')
                            }
                        />
                        <div className='w-full flex flex-col justify-between'>
                            <Button
                                key={image.uuid + 'select_button'}
                                type="button"
                                className={
                                    (image.uuid == imageToSelect ? 'bg-blue-600 hover:bg-blue-300' : 'bg-gray-100 hover:bg-blue-300')
                                }
                                onClick={
                                    () => {
                                        setImageToSelect(image.uuid);
                                    }
                                }
                            >
                                <CheckIcon /> Principal
                            </Button>
                            <Button
                                key={image.uuid + 'delete_button'}
                                type="button"
                                className={
                                    (imagesToRemove.find(uuid => uuid === image.uuid) ? 'bg-red-600 hover:bg-red-300' : 'bg-gray-100 hover:bg-red-300')
                                }
                                onClick={
                                    () => {
                                        if (!imagesToRemove.find(uuid => uuid === image.uuid)) {
                                            setImagesToRemove([...imagesToRemove, image.uuid]);
                                            if (image.uuid === imageToSelect) {
                                                setImageToSelect('');
                                            }
                                        } else {
                                            setImagesToRemove(imagesToRemove.filter((i) => i !== image.uuid));
                                            if (image.uuid === stored_primary_image_uuid && imageToSelect === '') {
                                                setImageToSelect(stored_primary_image_uuid);
                                            }
                                        }
                                    }
                                }
                            >
                                <DeleteIcon /> Deletar
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

