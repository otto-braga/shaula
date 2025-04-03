import NavBar from '@/Components/NavBar';
import theme from '@/Theme/theme';
import { ThemeProvider } from '@mui/material';
import { PropsWithChildren } from 'react';

export default function Public({ children }: PropsWithChildren) {
    return (
        <ThemeProvider theme={theme}>
            <div className="min-h-screen px-4 dark:bg-gray-900">
                <div className="text-gray-700 dark:text-gray-200">
                
                    <NavBar />

                    <div className='py-4 md:pt-8 min-h-svh'>
                        {children}
                    </div> 

                    <footer className='mt-12 border-t pt-4'>
                        <div className='grid grid-cols-3 gap-8'>

                            <div className=''>
                                <h2 className=' text-lg md:text-xl font-medium bg-black inline text-white'>SHAULA</h2>
                                <p className=' tracking-tighter leading-4'>Departamento de Artes - Universidade Federal do Rio Grande do Norte</p>
                            </div>

                        </div>
                    </footer>

                </div>
            </div>
        </ThemeProvider>
    );
}
