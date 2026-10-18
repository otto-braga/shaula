import NavBar from '@/Components/NavBar';
import theme from '@/Theme/theme';
import { ThemeProvider } from '@mui/material';
import { PropsWithChildren } from 'react';

export default function Public({ children }: PropsWithChildren) {
    return (
        <ThemeProvider theme={theme}>
            <div className="min-h-screen w-full max-w-full overflow-x-hidden px-4 dark:bg-gray-900">
                <div className="w-full max-w-full min-w-0 text-gray-700 dark:text-gray-200">
                
                    <NavBar />

                    <div className="min-h-svh w-full max-w-full min-w-0 overflow-x-hidden py-4 md:pt-8">
                        {children}
                    </div> 

                    <footer className="mt-12 w-full max-w-full border-t pt-4">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">

                            <div className="min-w-0 break-words">
                                <h2 className="inline bg-black text-lg font-medium text-white md:text-xl">SHAULA</h2>
                                <p className="leading-4 tracking-tighter break-words">Departamento de Artes - Universidade Federal do Rio Grande do Norte</p>
                            </div>

                        </div>
                    </footer>

                </div>
            </div>
        </ThemeProvider>
    );
}
