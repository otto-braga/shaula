import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/Components/Carousel';
import PublicLayout from '@/Layouts/PublicLayout';
import { PageProps } from '@/types';
import { Person } from '@/types/person';
import { Review } from '@/types/review';
import { Work } from '@/types/work';
import { Link } from '@inertiajs/react';
import { PersonAddDisabled } from '@mui/icons-material';
import { Grid2 } from '@mui/material';
import AutoPlay from "embla-carousel-autoplay";

export default function Show({
    person,
 }:PageProps<{ person: { data: Person } }>) {
    
    console.log(person.data);
    
    return <>
    
        <PublicLayout>

            <Grid2 container spacing={4}>

                <Grid2 size={{ xs: 0, sm: 2 }}>
                    <div className="hidden sm:block  w-full h-[300px]">

                    </div>
                </Grid2>

                <Grid2 size={{ xs:12, sm: 8}}>
                    <div className='text-center'>
                        <h1 className='text-4xl text-primary'>{person.data.name}</h1>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mt-16 text-lg'>

                        <div className='hidden md:block md:col-span-1 space-y-3'>

                            <div>
                                <p className='font-medium '>Atividades</p>
                                <p>
                                    Artista, Curador, Montador
                                </p>
                            </div>

                            <div>
                                <p className='font-medium '>Cidades</p>
                                <p>
                                    { person.data.cities.map(city => city.name).join(', ') }
                                </p>
                            </div>

                            <div>
                                <p className='font-medium '>Nascimento</p>
                                <p>{ person.data.date_of_birth }</p>
                            </div>

                            {
                                person.data.date_of_death && (
                                    <div>
                                        <p className='font-medium '>Falecimento</p>
                                        <p>{ person.data.date_of_death }</p>
                                    </div>
                                )
                            }

                            {
                                person.data.awards.length > 0 && (
                                    <div>
                                        <p className='font-medium '>Premiações</p>
                                        <p>
                                            { person.data.awards.map(award => award.name).join(', ') }
                                        </p>
                                    </div>
                                )
                            }

                            {
                                person.data.links.length > 0 && (
                                    <div>
                                        <p className='font-medium '>Links</p>
                                        <p>
                                            { person.data.links.map(link=> 
                                                <Link key={link.id} href={link.url} target='_blank'>{link.url}</Link>
                                            ).join(', ') }
                                        </p>
                                    </div>
                                )
                            }
                            
                        </div>
                        
                        <div className=' md:col-span-3 md:text-xl'>

                            <div className='flex flex-col md:flex-row gap-3 items-start'>
                                <img src="https://placehold.co/200x200" className='w-full max-w-[300px]' alt="" />
                                <div className='space-y-3'>
                                    <div>
                                        <p>{person.data.bio}</p>
                                    </div>
                                    <div>
                                        <p className='font-medium '>Cronologia</p>
                                        <p>{person.data.chrono}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className='mt-8 border-t pt-4'>
                                <h2 className=' font-medium '>Críticas</h2>
                                <div>
                                    
                                </div>
                            </div>

                            <div className='mt-8 border-t pt-4'>
                                <h2 className=' font-medium '>Produção Artística</h2>
                                <div>
                                    
                                </div>
                            </div>
                        
                            
                        </div>

                    </div>
                </Grid2>

                <Grid2 size={{ xs: 0, sm: 2 }}>
                    <div className="hidden sm:block  w-full h-[300px]">

                    </div>
                </Grid2>

            </Grid2>

        </PublicLayout>
    
    </>
}