import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Person } from '@/types/person';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pessoas',
        href: '/admin/pessoas',
    },
];

export default function Index({ person }: { person: { data: Person } }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />
            <div className="grid gap-4 p-3 md:grid-cols-3">{person.data.name}</div>
        </AppLayout>
    );
}
