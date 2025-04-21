import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Review } from '@/types/review';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import Tabs from './tabs';

import { FilePondFile, FilePondInitialFile } from 'filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';
import { FilePond, registerPlugin } from 'react-filepond';
import { Button } from '@/components/ui/button';
import { CheckIcon, DeleteIcon } from 'lucide-react';
registerPlugin(FilePondPluginImagePreview);

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Críticas',
        href: route('review.index'),
    },
];

export default function Images({
    review,
}: {
    review: { data: Review };
}) {
    const { data, setData, post, errors, processing } = useForm({
        files: Array<File>(),
        filesToRemove: Array<number>(),
        primaryImageId: review.data.primary_image?.id || 0,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log('data', data);
        post(route('review.update.images', review.data), {
            preserveScroll: true,
            preserveState: false,
        });
    };

    const [images, setImages] = useState<Array<FilePondInitialFile | File | Blob | string>>([]);

    useEffect(() => {
        setData('files', images as File[]);
    }, [images]);

    const [imagesToRemove, setImagesToRemove] = useState<Array<number>>([]);

    useEffect(() => {
        console.log('imagesToRemove', imagesToRemove);
        setData('filesToRemove', imagesToRemove);
    }, [imagesToRemove]);

    const [imageToSelect, setImageToSelect] = useState<number>(review.data.primary_image?.id || 0);

    useEffect(() => {
        setData('primaryImageId', imageToSelect);
        console.log('imageToSelect', imageToSelect);
    }, [imageToSelect]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produções" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="">
                        <form onSubmit={submit} className="space-y-6 bg-inherit">
                            <Tabs review={review} processing={processing} />

                            <FilePond
                                files={images}
                                onupdatefiles={(imageItems: FilePondFile[]) => {
                                    setImages(imageItems.map((imageItem) => imageItem.file as File));
                                }}
                                allowMultiple={true}
                            />

                            <div className="flex flex-row gap-2">
                                {review.data.images.map((image, index) => (
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
                                                            if (image.id === review.data.primary_image?.id && imageToSelect === 0) {
                                                                setImageToSelect(review.data.primary_image?.id || 0);
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
                        </form>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}

