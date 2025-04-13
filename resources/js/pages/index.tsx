import PublicLayout from '@/layouts/public-layout';

export default function Index() {
    return (
        <PublicLayout head="SHAULA">
            <div className="flex h-screen flex-col items-center justify-center">
                <h1 className="text-4xl font-bold">Welcome to SHAULA</h1>
                <p className="mt-4 text-lg">Your one-stop solution for all your needs.</p>
            </div>
        </PublicLayout>
    );
}
