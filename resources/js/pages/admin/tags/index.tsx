import DeleteDialog from '@/components/common/delete-dialog';
import TagDialogForm from '@/components/tag/tag-dialog-form';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Tag } from '@/types/tag';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tags',
        href: '/admin/tags',
    },
];

export default function Index({ tags }: { tags: { data: Tag[] } }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />
            <div className="mt-3 flex justify-end p-3">
                <TagDialogForm />
            </div>
            <div className="grid gap-4 p-3 md:grid-cols-3">
                {tags.data.map((tag) => (
                    <Card className="rounded" key={tag.id}>
                        <CardHeader className="">
                            <CardTitle>{tag.name}</CardTitle>
                        </CardHeader>
                        <CardFooter className="flex justify-end gap-2">
                            <TagDialogForm tag={tag} />
                            <DeleteDialog
                                resourceId={tag.id}
                                resourceName={tag.name}
                                deleteRoute="tags.destroy"
                                onSuccess={() => window.location.reload()}
                            />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </AppLayout>
    );
}
