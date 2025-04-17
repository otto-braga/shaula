import PublicLayout from '@/layouts/public-layout';
import { formatDate } from '@/lib/utils';

import { Work } from '@/types/work';
import { Link } from '@inertiajs/react';

import 'keen-slider/keen-slider.min.css';

export default function Index({ review }: { review: { data: Work } }) {
    console.log(review);

    return (
        <PublicLayout head="Crítica">
            {/* relative e object-cover para todos ficarem do mesmo tamanho. */}

            <div className="relative h-full max-h-[800px] w-full overflow-hidden">
                <img
                    src={`${review.data.general_images[0].path ? review.data.general_images[1].path : 'https://placehold.co/1280x900'}`}
                    alt="Review Image"
                    className="aspect-video w-full object-cover"
                />
                <div className="absolute bottom-1/4 left-1/2 z-20 flex justify-center bg-black/30 p-1 backdrop-blur-2xl">
                    <div>
                        <h1 className="font-semibold text-white md:text-3xl">{review.data.title}</h1>
                        <div className="flex gap-1">
                            {review.data.authors.map((author) => (
                                <Link href={route('person-public.show', author.id)} key={author.id}>
                                    <span className="text-gray-300 underline md:text-lg">{author.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <section className="mt-8 grid gap-8 p-4 md:grid-cols-8 md:px-8">
                <div className="md:col-span-2 lg:col-span-2">
                    <div className="sticky h-full w-full bg-zinc-100">asdsa</div>
                </div>
                <div className="md:col-span-5 lg:col-span-4">
                    <div>
                        <span className="text-sm text-slate-500">{formatDate(review.data.date)}</span>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: review.data.content }} className="mt-3 text-lg lg:text-xl" />
                </div>
                <div className="md:col-span-1 lg:col-span-2"></div>
            </section>

            {/* <div className="flex gap-3">
                {review.data.general_images.map((image) => (
                    <div key={image.id} className="">
                        <img src={`${image.path ? image.path : 'https://placehold.co/1280x900'}`} alt="Review Image" className="max-h-[600px]" />
                    </div>
                ))}
            </div> */}
        </PublicLayout>
    );
}
