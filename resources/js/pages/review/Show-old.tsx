import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/Components/Carousel";
import PublicLayout from "@/Layouts/PublicLayout";
import { PageProps } from "@/types";
import { Work } from "@/types/work";
import { Grid2 } from "@mui/material";
import AutoPlay from "embla-carousel-autoplay";

import './TinyMCEContent.css';

export default function Show({
    review,
}: PageProps<{ review: { data: Work } }>) {
    console.log(review.data);

    return (
        <>
            <PublicLayout>
                <Carousel
                    opts={
                        {
                            // loop:true,
                        }
                    }
                    plugins={[
                        AutoPlay({
                            delay: 3000,
                            stopOnMouseEnter: true,
                            stopOnFocusIn: false,
                            // stopOnInteraction: false,
                        }),
                    ]}
                >
                    <CarouselContent className="-mr-0">
                        {review.data.general_images.map((file) => (
                            <CarouselItem
                                className="basis-1/3 pl-4 h-[30vw]"
                                key={file.id}
                            >
                                <img
                                    src={file.path}
                                    className="h-full object-cover"
                                    alt="placeholder"
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="mt-4 flex justify-end gap-4 px-4">
                        <CarouselPrevious />
                        <CarouselNext />
                    </div>
                </Carousel>

                <Grid2 container spacing={4} className={"mt-16"}>
                    <Grid2 size={{ xs: 12 }}>
                        <div className="flex flex-col items-center justify-center mb-4">
                            <h1 className="text-3xl lg:text-4xl font-semibold max-w-4xl text-center text-primary">
                                {review.data.title}
                            </h1>
                            <p className="lg:text-xl mt-4">
                                {review.data.authors
                                    .map((author) => author.name)
                                    .join(", ")}
                            </p>
                        </div>
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 3, lg: 2 }}>
                        <div className="hidden md:block md:sticky md:top-32 md:pt-0 text-sm md:text-md lg:text-lg space-y-4 md:px-4">
                            <h2 className="font-semibold text-primary">
                                {review.data.title}
                            </h2>
                            <div>
                                <p className="font-semibold ">Autoria</p>
                                <p>
                                    {/* {review.data.authors
                                        .map((author) => author.name)
                                        .join(", ")} */}

                                    {review.data.authors
                                        .map((author) => {
                                            return (<>
                                                <a
                                                    key={author.id}
                                                    href={`/pessoa/${author.uuid}`}
                                                >
                                                    {author.name}
                                                </a>
                                                <br />
                                            </>)
                                        })
                                    }
                                </p>
                            </div>
                            {review.data.activities.map((activity) => (
                                <div key={activity.id}>
                                    <p className="font-semibold">
                                        {activity.name}
                                    </p>
                                    <p>
                                        {review.data.people
                                            .filter((person) =>
                                                person.activity.id === activity.id
                                            )
                                            .map((person) => person.name)
                                            .join(", ")}
                                    </p>
                                </div>
                            ))
                            }
                            <div>
                                <p className="font-semibold ">Tipo</p>
                                <p>Critica</p>
                            </div>
                            <div>
                                <p className="font-semibold ">Categoria</p>
                                <p>Territorialismo</p>
                                <p>Colonialismo e Imperialismo</p>
                            </div>
                            <div>
                                <p className="font-semibold ">Menções</p>
                                {/* diminuir line height */}
                                <p className="">Jota Mombaça</p>
                            </div>
                            <div>
                                <p className="font-semibold ">
                                    Data de publicação
                                </p>
                                <p>
                                    {new Date(
                                        review.data.date
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 6, lg: 8 }}>
                        <div
                            className="space-y-8 text-xl lg:text-2xl w-full max-w-5xl mx-auto"
                            dangerouslySetInnerHTML={{
                                __html: review.data.content,
                            }}
                        ></div>
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 3, lg: 2 }}>
                        <div className="text-lg space-y-4 md:hidden">
                            <div>
                                <p className="font-semibold">Tipo</p>
                                <p>Critica</p>
                            </div>
                            <div>
                                <p className="font-semibold">Categoria</p>
                                <p>Territorialismo</p>
                                <p>Colonialismo e Imperialismo</p>
                            </div>
                            <div>
                                <p className="font-semibold">Autoria</p>
                                <p>Maria Sucar</p>
                            </div>
                            <div>
                                <p className="font-semibold">Meções</p>
                                <p>Jota Mombaça</p>
                                <p>Pessoa 2</p>
                            </div>
                        </div>
                    </Grid2>
                </Grid2>

                <Grid2>
                    <div className="mt-24 border-t pt-4">
                        <div className="mt-4">
                            <h2 className=" text-lg md:text-xl font-medium">
                                Conteúdo Relacionado
                            </h2>
                        </div>

                        <section></section>
                    </div>
                </Grid2>
            </PublicLayout>
        </>
    );
}
