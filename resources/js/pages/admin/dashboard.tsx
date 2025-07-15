import { AdminSearchBar } from '@/components/admin-search-bar/admin-search-bar';
import DashboardLatestCard from '@/components/dashboard/dashboard-latest-card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

type DashboardLatest = {
    uuid: string;
    slug?: string;
    label: string;
    route: string;
    created_at: string;
    updated_at: string;
};

type DashboardProps = {
    latest: { data: DashboardLatest[] };
    latest_aux: { data: DashboardLatest[] };
};

export default function Dashboard(props: DashboardProps) {
    console.log('Dashboard props:', props);
    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="m-4 border rounded-xl p-4">
                <AdminSearchBar
                    className=""
                    route="admin.dashboard"
                />
            </div>

            <div className="m-4 border rounded-xl p-4">
                <h1 className="mb-4 text-lg font-bold">Útimas Atualizações</h1>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

                    <div className="flex flex-col gap-2 w-full border rounded-xl p-4">
                        <h2 className="text-md font-semibold">Conteúdo Principal</h2>
                        {props.latest.data.length > 0 && (
                            props.latest.data.map((item, index) => (
                                <DashboardLatestCard
                                    key={item.uuid + item.label + item.route + index}
                                    slug={item.slug}
                                    name={item.label}
                                    route_base_name={item.route}
                                    is_aux={false}
                                />
                            ))
                        )}
                    </div>

                    <div className="flex flex-col gap-2 w-full border rounded-xl p-4">
                        <h2 className="text-md font-semibold">Conteúdo Auxiliar</h2>
                        {props.latest_aux.data.length > 0 && (
                            props.latest_aux.data.map((item, index) => (
                                <DashboardLatestCard
                                    key={item.uuid + item.label + item.route + index}
                                    uuid={item.uuid}
                                    name={item.label}
                                    route_base_name={item.route}
                                    is_aux={true}
                                />
                            ))
                        )}
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
