import { PageProps } from "@/types";
import PublicLayout from '@/Layouts/PublicLayout';
import { Grid2, Pagination } from "@mui/material";
import { Link } from "@inertiajs/react";
import { Person } from "@/types/person";
import { Artwork, Work } from "@/types/work";

import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

export default function Index({
    artworks,
}:PageProps<{ 
        artworks: { data: Work[], meta: {
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

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        window.location.href = `${artworks.meta.path}?page=${value}`
    };

    console.log(artworks.data)

    return <>
    
        <PublicLayout>
            
            <Grid2 container spacing={4}>

                <Grid2 size={{ xs: 0, sm: 3 }}>
                    <div className="hidden sm:block bg-gray-100 w-full h-[300px]">

                    </div>
                </Grid2>

                <Grid2 size={{ xs:12, sm: 9}}>

                    <ImageList variant="masonry" cols={3} gap={40} >

                        {
                            artworks.data.map((artwork) => (
                                <Link href={route('public.artwork.show', { uuid: artwork.uuid })} key={artwork.id}>
                                    <ImageListItem>
                                        <img
                                            src='https://placehold.co/150x150'
                                            alt={'artwork.title'}
                                            loading="lazy"
                                        />
                                        {/* <ImageListItemBar position="below" title={'artwork.title'} /> */}
                                        <div className="mt-2">
                                            <p className="text-xl text-primary font-medium">{artwork.title}</p>
                                            <p>
                                                {
                                                    artwork.authors.map((author: Person) => author.name).join(', ')
                                                }
                                            </p>
                                        </div>
                                    </ImageListItem>
                                </Link>
                            ))
                        }

                    </ImageList>

                    {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {
                            artworks.data.map((artwork) => (
                                <div className="" key={artwork.id}>
                                    <Link href={route('public.artwork.show', artwork.uuid)}>
                                        <div key={artwork.id} className="">
                                            <div>
                                                <img src='https://placehold.co/150x150' alt={artwork.title} className="w-full" />
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                        ))
                        }
                    </div> */}
                    <div className="flex justify-center mt-20">
                        <Pagination
                            count={artworks.meta.last_page}
                            page={artworks.meta.current_page}
                            onChange={handlePageChange}
                            size="large"
                            showFirstButton
                            showLastButton
                            className=""
                        />
                    </div>
                </Grid2>

                {/* <Grid2 size={{ xs: 0, sm: 2 }}>
                    <div className="hidden sm:block bg-gray-100 w-full h-[300px]">
                                asda
                    </div>
                </Grid2> */}

            </Grid2>

        </PublicLayout>

    </>

}