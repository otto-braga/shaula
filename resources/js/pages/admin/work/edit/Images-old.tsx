import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Work } from '@/types/work';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import Tabs from './Tabs';

import { FilePondFile, FilePondInitialFile } from 'filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';
import { FilePond, registerPlugin } from 'react-filepond';
registerPlugin(FilePondPluginImagePreview);

import ImageCard from '@/Components/ImageCard';

export default function Images({
    work,
}: PageProps<{
    work: { data: Work };
}>) {
    const { data, setData, post, errors, processing } = useForm({
        files: Array<File>(),
        filesToRemove: Array<number>(),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log('data', data);
        post(route('work.update.images', work.data.uuid), {
            preserveScroll: true,
            preserveState: false,
        });
    };

    const [images, setImages] = useState<Array<FilePondInitialFile | File | Blob | string>>([]);

    useEffect(() => {
        setData('files', images as File[]);
        // console.log('files', images);
    }, [images]);

    // useEffect(() => {
    //     console.log('data.files', data.files);
    // }, [data.files]);

    const [imagesToRemove, setImagesToRemove] = useState<Array<number>>([]);

    useEffect(() => {
        console.log('imagesToRemove', imagesToRemove);
        setData('filesToRemove', imagesToRemove);
    }, [imagesToRemove]);

    return (
        <AuthenticatedLayout header={<h2 className="">Editor</h2>}>
            <Head title={'Editor'} />

            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="rounded border bg-white p-3 dark:border-gray-600 dark:bg-slate-800">
                        <form onSubmit={submit} className="space-y-6 bg-inherit">
                            <Tabs work={work} processing={processing} />

                            <FilePond
                                files={images}
                                onupdatefiles={(imageItems: FilePondFile[]) => {
                                    setImages(imageItems.map((imageItem) => imageItem.file as File));
                                }}
                                allowMultiple={true}
                            />

                            <div className="flex flex-row gap-2">
                                {work.data.general_images.map((image, index) => (
                                    <ImageCard
                                        key={index}
                                        image={image}
                                        toRemove={imagesToRemove.includes(image.id)}
                                        onSelected={() => {}}
                                        onRemove={(remove) => {
                                            if (remove) {
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
        </AuthenticatedLayout>
    );
}
