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
    stored_primary_image_id?: number;
    data: {
        files: Array<File>;
        filesToRemove: Array<number>;
        primaryImageId: number;
    };
    setData: (key: string, value: any) => void;
    errors?: Record<string, string>;
    processing?: boolean;
};

export default function EditImages({
    stored_images = [],
    stored_primary_image_id = 0,
    data,
    setData,
    errors,
    processing,
}: EditImagesProps) {
    const [images, setImages] = useState<Array<FilePondInitialFile | File | Blob | string>>([]);

    useEffect(() => {
        setData('files', images as File[]);
    }, [images]);

    const [imagesToRemove, setImagesToRemove] = useState<Array<number>>([]);

    useEffect(() => {
        console.log('imagesToRemove', imagesToRemove);
        setData('filesToRemove', imagesToRemove);
    }, [imagesToRemove]);

    const [imageToSelect, setImageToSelect] = useState<number>(stored_primary_image_id);

    useEffect(() => {
        setData('primaryImageId', imageToSelect);
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
                    <div key={image.id} className='flex flex-col items-center'>
                        <img key={image.id + 'image'} src={image.path} alt={image.path}
                            className={
                                'object-cover w-32 h-32 rounded-lg shadow-md'
                                + (imagesToRemove.find(id => id === image.id) ? ' opacity-50' : '')
                            }
                        />
                        <div className='w-full flex flex-col justify-between'>
                            <Button
                                key={image.id + 'select_button'}
                                type="button"
                                className={
                                    (image.id == imageToSelect ? 'bg-blue-600 hover:bg-blue-300' : 'bg-gray-100 hover:bg-blue-300')
                                }
                                onClick={
                                    () => {
                                        setImageToSelect(image.id);
                                    }
                                }
                            >
                                <CheckIcon /> Principal
                            </Button>
                            <Button
                                key={image.id + 'delete_button'}
                                type="button"
                                className={
                                    (imagesToRemove.find(id => id === image.id) ? 'bg-red-600 hover:bg-red-300' : 'bg-gray-100 hover:bg-red-300')
                                }
                                onClick={
                                    () => {
                                        if (!imagesToRemove.find(id => id === image.id)) {
                                            setImagesToRemove([...imagesToRemove, image.id]);
                                            if (image.id === imageToSelect) {
                                                setImageToSelect(0);
                                            }
                                        } else {
                                            setImagesToRemove(imagesToRemove.filter((i) => i !== image.id));
                                            if (image.id === stored_primary_image_id && imageToSelect === 0) {
                                                setImageToSelect(stored_primary_image_id);
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

