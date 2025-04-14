import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Review } from '@/types/review';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import Tabs from './tabs';

import ImageCard from '@/components/image/image-card';

import { FilePondFile, FilePondInitialFile } from 'filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';
import { FilePond, registerPlugin } from 'react-filepond';
registerPlugin(FilePondPluginImagePreview);

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Críticas',
        href: '/admin/review',
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
                                {review.data.general_images.map((image, index) => (
                                    <ImageCard
                                        key={index}
                                        image={image}
                                        onSelectedChange={(isSelected) => {}}
                                        onRemoveChange={(isToRemove) => {
                                            if (isToRemove) {
                                                setImagesToRemove([...imagesToRemove, image.id]);
                                            } else {
                                                setImagesToRemove(imagesToRemove.filter((i) => i !== image.id));
                                            }
                                        }}
                                    />
                                ))}
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}

