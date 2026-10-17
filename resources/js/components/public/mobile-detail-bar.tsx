import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function MobileDetailBar({ children, title }: { children: React.ReactNode; title?: string }) {
    const [isOpen, setIsOpen] = useState(false);

    // Falta colocar como props a opção de quando
    // a barra deve aparecer (lg, md, sm, etc) para
    // que não fique fixo como lg

    return (
        <div
            className={`${isOpen ? 'bottom-0' : '-bottom-4'} fixed right-0 z-10 w-full space-y-3 border-t border-zinc-200 bg-gradient-to-b from-white/85 via-white to-white text-zinc-950 shadow backdrop-blur-lg transition-all lg:hidden dark:border-zinc-800 dark:from-zinc-950/85 dark:via-zinc-950 dark:to-zinc-950 dark:text-zinc-50`}
        >
            <div className="flex h-14 justify-center">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex w-full cursor-pointer items-center justify-center gap-1 text-lg font-medium text-zinc-950 focus:border-0 focus:ring-0 dark:text-zinc-50"
                >
                    <p>{title ? title : 'Detalhes'}</p>
                    <ChevronDown size={24} className={`transition-transform ${isOpen ? 'rotate-0' : 'rotate-180'}`} />
                </button>
            </div>
            <div className={`px-4 pb-6 ${isOpen ? 'block' : 'hidden'} max-h-[60vh] overflow-y-auto`}>{children}</div>
        </div>
    );
}
