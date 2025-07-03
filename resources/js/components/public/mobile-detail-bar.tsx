import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function MobileDetailBar({ children, title }: { children: React.ReactNode; title?: string }) {
    const [isOpen, setIsOpen] = useState(false);

    // Falta colocar como props a opção de quando
    // a barra deve aparecer (lg, md, sm, etc) para
    // que não fique fixo como lg

    return (
        <div
            className={`${isOpen ? 'bottom-0' : '-bottom-4'} fixed right-0 z-10 w-full space-y-3 bg-gradient-to-b from-white/70 via-white to-white shadow backdrop-blur-lg transition-all lg:hidden`}
        >
            <div className="flex h-14 justify-center">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex w-full items-center justify-center gap-1 text-lg focus:border-0 focus:ring-0"
                >
                    <p>{title ? title : 'Detalhes'}</p>
                    <ChevronDown size={24} className={`transition-transform ${isOpen ? 'rotate-0' : 'rotate-180'}`} />
                </button>
            </div>
            <div className={`px-4 pb-4 ${isOpen ? 'block' : 'hidden'} max-h-[400px] overflow-y-scroll`}>{children}</div>
        </div>
    );
}
