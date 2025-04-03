import { PageProps } from "@/types";
import PublicLayout from '@/Layouts/PublicLayout';
import { Grid2, Pagination } from "@mui/material";
import { Link } from "@inertiajs/react";
import { Person } from "@/types/person";

export default function Index({
    people,
}:PageProps<{ 
        people: { data: Person[], meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
    pagination_links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    }; } 
    }>) {

    console.log(people.meta)

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        window.location.href = `${people.meta.path}?page=${value}`
    };

    return <>
    
        <PublicLayout>
            
            <Grid2 container spacing={4}>

                <Grid2 size={{ xs: 0, sm: 3 }}>
                    <div className="hidden sm:block bg-gray-100 w-full h-[300px]">

                    </div>
                </Grid2>

                <Grid2 size={{ xs:12, sm: 7}}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {
                            people.data.map((person) => (
                                <div className="" key={person.id}>
                                    <Link href={route('public.person.show', person.slug)}>
                                        <div key={person.id} className="">
                                            <div>
                                                <img src='https://placehold.co/150x150' alt={person.name} className="w-full" />
                                            </div>
                                            <div className="text-center mt-2">
                                                <h3 className="text-xl text-primary">{person.name}</h3>
                                                <p className="text-sm">Artista, Crítica</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                        ))
                        }
                    </div>
                    <div className="flex justify-center mt-8">
                        <Pagination
                            count={people.meta.last_page}
                            page={people.meta.current_page}
                            onChange={handlePageChange}
                            size="large"
                            showFirstButton
                            showLastButton
                            className=""
                        />
                    </div>
                </Grid2>

                <Grid2 size={{ xs: 0, sm: 2 }}>
                    <div className="hidden sm:block bg-gray-100 w-full h-[300px]">
                                asda
                    </div>
                </Grid2>

            </Grid2>

        </PublicLayout>

    </>

}