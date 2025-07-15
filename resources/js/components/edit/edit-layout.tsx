import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function EditLayout({
    children,
    ...props
}: {
    children: React.ReactNode;
} & Record<string, any>) {
    return (
        <AppLayout>
            <Head title="Editor" />
            <section className="px-4 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className={props.className}>
                        {children}
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
