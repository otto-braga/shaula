import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';

const footerLinks = [
    { title: 'Início', href: '/' },
    { title: 'Pessoas', href: '/pessoas' },
    { title: 'Exposições', href: '/exposicoes' },
    { title: 'História', href: '/historia/artigos' },
    { title: 'Crítica', href: '/critica' },
    { title: 'Busca', href: '/busca' },
    { title: 'Sobre', href: '/sobre' },
];

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-12 w-full border-t border-zinc-200 bg-white text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
            <div className="grid grid-cols-1 divide-y divide-zinc-200 md:grid-cols-3 md:divide-x md:divide-y-0 dark:divide-zinc-800">
                {/* Coluna 1: Identidade do Projeto */}
                <div className="space-y-3 p-6 sm:p-8">
                    <div>
                        <Link href="/" className="inline-block">
                            <span className="bg-zinc-950 px-2 py-0.5 text-lg font-bold tracking-wider text-white uppercase md:text-xl dark:bg-zinc-100 dark:text-zinc-950">
                                SHAULA
                            </span>
                        </Link>
                        <p className="mt-2 text-xs font-semibold tracking-widest text-zinc-500 uppercase dark:text-zinc-400">
                            Memória e Acervo da Arte Potiguar
                        </p>
                    </div>
                    <p className="max-w-sm text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                        Portal de memória, pesquisa e difusão dedicado às artes visuais, trajetórias artísticas, ensaios históricos e crítica de arte.
                    </p>
                </div>

                {/* Coluna 2: Navegação do Acervo */}
                <div className="space-y-3 p-6 sm:p-8">
                    <h2 className="text-xs font-semibold tracking-widest text-zinc-500 uppercase dark:text-zinc-400">Navegação</h2>
                    <nav aria-label="Links do rodapé" className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                        {footerLinks.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-zinc-700 transition-colors hover:text-zinc-950 hover:underline dark:text-zinc-300 dark:hover:text-zinc-50"
                            >
                                {item.title}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Coluna 3: Vínculo Institucional */}
                <div className="space-y-3 p-6 sm:p-8">
                    <h2 className="text-xs font-semibold tracking-widest text-zinc-500 uppercase dark:text-zinc-400">Realização Institucional</h2>
                    <div className="space-y-1.5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                        <p className="font-medium text-zinc-950 dark:text-zinc-100">Universidade Federal do Rio Grande do Norte (UFRN)</p>
                        <p>Departamento de Artes (DEART)</p>
                        <div className="pt-1">
                            <Link
                                href={route('public.about')}
                                className="group inline-flex items-center gap-1 font-medium text-zinc-950 hover:underline dark:text-zinc-100"
                            >
                                <span>Ver mais</span>
                                <ArrowUpRight className="size-3.5 text-zinc-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 dark:text-zinc-400" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Barra Inferior de Direitos Autorais */}
            <div className="flex flex-col items-center justify-between gap-2 border-t border-zinc-200 px-6 py-4 text-xs text-zinc-500 sm:flex-row sm:px-8 dark:border-zinc-800 dark:text-zinc-400">
                <p>© {currentYear} SHAULA — Memória e Acervo da Arte Potiguar.</p>
                <p>Departamento de Artes · UFRN</p>
            </div>
        </footer>
    );
}

export default Footer;
