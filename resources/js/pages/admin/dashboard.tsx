import { AdminDashboardSearchBar } from '@/components/admin-dashboard-search-bar/admin-dashboard-search-bar';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

type DashboardProps = {
    q: string;
};

export default function Dashboard(props: DashboardProps) {
    console.log('Dashboard props:', props);

    // const [result, setResult] = useState<{ data: SearchResult[] }>({ data: [] });

    return (
        <AppLayout>
            <Head title="Dashboard" />

            <section className="px-4 py-4 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="">
                        <h1 className="text-2xl font-bold">Dashboard</h1>
                    </div>

                    <AdminDashboardSearchBar
                        q={props.q}
                        className="mt-4"
                    />
                </div>
            </section>
        </AppLayout>
    );
}
