import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Person } from '@/types/person';
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
        title: 'Pessoas',
        href: '/admin/pessoas',
    },
];

export default function Images({
    person,
}: {
    person: { data: Person };
}) {
    const { data, setData, post, errors, processing } = useForm({
        files: Array<File>(),
        filesToRemove: Array<number>(),
        primaryImageId: person.data.primary_image?.id || 0,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log('data', data);
        post(route('person.update.images', person.data), {
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

    const [imageToSelect, setImageToSelect] = useState<number>(person.data.primary_image?.id || 0);

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
                            <Tabs person={person} processing={processing} />

                            <FilePond
                                files={images}
                                onupdatefiles={(imageItems: FilePondFile[]) => {
                                    setImages(imageItems.map((imageItem) => imageItem.file as File));
                                }}
                                allowMultiple={true}
                            />

                            <div className="flex flex-row gap-2">
                                {person.data.images.map((image, index) => (
                                    <ImageCard
                                        key={index}
                                        image={image}
                                        initSelected={image.id === imageToSelect}
                                        onSelectedChange={(isSelected) => {
                                            if (isSelected) {
                                                setImageToSelect(image.id);
                                            }
                                            if (!isSelected && image.id === imageToSelect) {
                                                setImageToSelect(0);
                                            }
                                        }}
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

