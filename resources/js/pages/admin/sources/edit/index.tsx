import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Source } from '@/types/source';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import EditTabs from '@/components/edit/edit-tabs';
import HtmlEditor from '@/components/edit/html-editor';
import EditFile from '@/components/edit/edit-file';
import EditLayout from '@/components/edit/edit-layout';

export default function Index({
    source,
}: {
    source: { data: Source },
}) {
    const isEdit = !!source;

    const { data, setData, post, processing } = useForm({
        title: source ? source.data.title : String(),
        files: Array<File>(),
        delete_file: false as boolean,
        content: source ? source.data.content as string : String(),
    });
    const { errors } = usePage().props;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        console.log('data', data);

        if (isEdit) {
            post(route('sources.update', source.data), {
                preserveScroll: true,
                preserveState: false,
            });
        } else {
            post(route('sources.store'), {
                preserveScroll: true,
                preserveState: false,
            });
        }
    };

    return (
        <EditLayout>
            <form onSubmit={submit} className="space-y-3 bg-inherit">
                <EditTabs
                    model={source}
                    route_base_name="sources"
                    processing={processing}
                />

                {isEdit}

                <div>
                    <Label htmlFor="title">Título</Label>
                    <Input id="title" value={data.title ?? ''} onChange={(e) => setData('title', e.target.value)} autoComplete="title" />
                    <InputError className="mt-2" message={errors.title} />
                </div>

                <EditFile
                    stored_file={source?.data.file}
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                />

                <HtmlEditor
                    content={source?.data.content ?? ''}
                    content_images={[]}
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    submit={submit}
                    hasGallery={false}
                />

            </form>
        </EditLayout>
    );
}
