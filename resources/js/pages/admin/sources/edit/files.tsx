import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Source } from '@/types/source';
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
import { Label } from '@/components/ui/label';
import { FileEditCard } from '@/components/ui/file-card';
registerPlugin(FilePondPluginImagePreview);

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pessoas',
        href: route('sources.index'),
    },
];

export default function Files({
    source,
}: {
    source: { data: Source };
}) {
    const { data, setData, post, errors, processing } = useForm({
        files: Array<File>(),
        filesToRemove: Array<number>(),
        primaryFileId: source.data.primary_file?.id || 0,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log('data', data);
        post(route('sources.update.files', source.data), {
            preserveScroll: true,
            preserveState: false,
        });
    };

    const [files, setFiles] = useState<Array<FilePondInitialFile | File | Blob | string>>([]);

    useEffect(() => {
        setData('files', files as File[]);
    }, [files]);

    const [filesToRemove, setFilesToRemove] = useState<Array<number>>([]);

    useEffect(() => {
        console.log('filesToRemove', filesToRemove);
        setData('filesToRemove', filesToRemove);
    }, [filesToRemove]);

    const [fileToSelect, setFileToSelect] = useState<number>(source.data.primary_file?.id || 0);

    useEffect(() => {
        setData('primaryFileId', fileToSelect);
        console.log('fileToSelect', fileToSelect);
    }, [fileToSelect]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produções" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="">
                        <form onSubmit={submit} className="space-y-6 bg-inherit">
                            <Tabs source={source} processing={processing} />

                            <FilePond
                                files={files}
                                onupdatefiles={(fileItems: FilePondFile[]) => {
                                    setFiles(fileItems.map((fileItem) => fileItem.file as File));
                                }}
                                allowMultiple={true}
                            />

                            <div className="flex flex-row gap-2">
                                {source.data.files.map((file, index) => (
                                    <FileEditCard
                                        key={file.id}
                                        file={file}
                                        filesToRemove={filesToRemove}
                                        setFilesToRemove={setFilesToRemove}
                                        fileToSelect={fileToSelect}
                                        setFileToSelect={setFileToSelect}
                                        primaryFileId={source.data.primary_file?.id || 0}
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

