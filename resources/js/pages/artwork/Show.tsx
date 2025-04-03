import { DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/Components/Drawer';
import PublicLayout from '@/Layouts/PublicLayout';
import { PageProps } from '@/types';
import { Artwork, Review, Work } from '@/types/work';
import { Link } from '@inertiajs/react';
import { Drawer, Grid2 } from '@mui/material';

import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { useEffect, useState } from 'react';

export default function Show({
    artwork,
 }:PageProps<{ artwork: { data: Work } }>) {

    const [open, setOpen] = useState(true)
    
    console.log(artwork.data);
    
    // Função para usar definir o tipo de workable
    function isArtwork(workable: Artwork | Review): workable is Artwork {
        return (workable as Artwork).dimensions !== undefined;
    }
    
    return <>
    
        <PublicLayout>

            <Grid2 container spacing={4} paddingX={{ xs: 0, sm: 4, lg: 16 }}>

                <Grid2 size={{ xs: 12, md: 4 }}>

                    <h1 className='text-center sm:text-left text-2xl md:text-3xl font-medium text-primary'>{artwork.data.title}</h1>

                    <div className='hidden sm:block mt-8 space-y-3 text-lg'>

                        <div>
                            <p className='font-semibold'>Autoria</p>
                            Autor dos Santos
                            { artwork.data.authors.map(author =>
                                <div>
                                    <Link 
                                        key={author.id} 
                                        href={route('public.person.show', { slug: author.slug })}
                                        className='underline underline-offset-4'
                                    >
                                        { author.name }
                                    </Link>
                                </div>
                            ) }
                        </div>
                        
                        <div className='border-y py-4'>
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit 
                                libero autem nulla itaque placeat quaerat nihil, voluptate possimus voluptatum 
                                tempore iusto eos aliquam animi iste vitae enim consectetur expedita. Sapiente.
                                Itaque facilis recusandae nihil vitae, ullam neque quisquam cum mollitia consequatur 
                                natus pariatur esse ipsam minima iste eligendi, unde molestiae eum in perspiciatis odit! 
                                Deleniti numquam magni repellendus facere dolores!
                            </p>
                            <div className='text-sm text-slate-400 mt-2'>
                                <p>por Maria Sucar</p>
                            </div>
                        </div>


                        <div>
                            <p className='font-semibold'>Linguagens</p>
                            <p> Escultura, Performance, Hardcoded </p>
                        </div>

                        { isArtwork(artwork.data.workable) && (
                            <div>
                                {
                                    artwork.data.workable.dimensions && (
                                        <div>
                                            <p className='font-semibold'>Dimensões</p>
                                            <p>{ artwork.data.workable.dimensions }</p>
                                        </div>
                                    )
                                }
                            </div>
                        ) }

                        { isArtwork(artwork.data.workable) && (
                            <div>
                                {
                                    artwork.data.workable.materials && (
                                        <div>
                                            <p className='font-semibold'>Materiais</p>
                                            <p>{ artwork.data.workable.materials }</p>
                                        </div>
                                    )
                                }
                            </div>
                        ) }


                        <div>
                            <p className='font-semibold'>Musealizada</p>
                            { isArtwork(artwork.data.workable) && (
                                <p>{ artwork.data.workable.is_museumized === true ? 'Sim' : 'Não' }</p>
                            ) }
                        </div>
                        
                        {
                            (artwork.data.date && !artwork.data.date_end) && (
                                <div>
                                    <p className='font-semibold'>Data</p>
                                    <p> {new Date(artwork.data.date).toLocaleDateString()} </p>
                                </div>
                            )
                        }

                        {
                            (artwork.data.date && artwork.data.date_end) && (
                                <div>
                                    <p className='font-semibold'>Duração</p>
                                    <p> { new Date(artwork.data.date).toLocaleDateString() } - {new Date(artwork.data.date_end).toLocaleDateString()} </p>
                                </div>
                            )
                        }
                        


                    </div>

                    

                </Grid2>

                <Grid2 size={{ xs:12, md: 8}} >

                    <div className='hidden md:block'>
                        <ImageList variant="masonry" cols={2} gap={32}  >

                            <ImageListItem>
                                <img
                                src='https://placehold.co/150x150'
                                alt={'artwork.title'}
                                loading="lazy"
                                />
                            </ImageListItem>   

                            <ImageListItem>
                                <img
                                src='https://placehold.co/1280x720'
                                alt={'artwork.title'}
                                loading="lazy"
                                />
                            </ImageListItem>       

                            <ImageListItem>
                                <img
                                src='https://placehold.co/720x900'
                                alt={'artwork.title'}
                                loading="lazy"
                                />
                            </ImageListItem>                

                        </ImageList>
                    </div>

                    <div className='md:hidden space-y-3'>
                        <img src='https://placehold.co/1280x720' alt={artwork.data.title} className='w-full' />
                        <img src='https://placehold.co/1280x1900' alt={artwork.data.title} className='w-full' />
                        <img src='https://placehold.co/900x600' alt={artwork.data.title} className='w-full' />
                    </div>


                </Grid2>

            </Grid2>

        </PublicLayout>
    
    </>
}