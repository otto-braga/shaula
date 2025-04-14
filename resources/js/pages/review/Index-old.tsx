import { PageProps } from "@/types";
import { Review } from "@/types/review";
import PublicLayout from '@/Layouts/PublicLayout';
import { Grid2 } from "@mui/material";
import { Work } from "@/types/work";
import { Link } from "@inertiajs/react";
import ReviewCard from "@/Components/Public/ReviewCard";

export default function Index({
    reviews,
}:PageProps<{ reviews: { data: Work[] } } >) {

    console.log(reviews.data)

    return <>

        <PublicLayout>

            <Grid2 container spacing={4}>

                <Grid2 size={{ xs: 0, sm: 4 }}>
                    <div className="hidden sm:block bg-gray-100 w-full h-[300px]">

                    </div>
                </Grid2>

                <Grid2 size={{ xs:12, sm: 8}}>

                    {/* <Grid2 size={12}>

                        <div className="border-b border-t py-2">
                            Crítica
                        </div>

                    </Grid2> */}

                    <div className="divide-y">


                        {
                            reviews.data.map((review) => (

                                <ReviewCard review={review} key={review.id} />

                            ))
                        }

                    </div>
                </Grid2>

            </Grid2>

        </PublicLayout>

    </>

}