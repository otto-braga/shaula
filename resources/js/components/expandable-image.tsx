import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ExpandableImageProps {
    src: string;
    alt: string;
    className?: string;
}

export default function ExpandableImage({ src, alt, className = '' }: ExpandableImageProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const openFullscreen = () => {
        setIsExpanded(true);
    };

    const closeFullscreen = () => {
        setIsExpanded(false);
    };

    // Handle keyboard events for accessibility
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            console.log('Escape key pressed, closing fullscreen');
            closeFullscreen();
        }
    };

    useEffect(() => {
        if (isExpanded) {
            // Bloquear scroll
            document.body.style.overflow = 'hidden';
        } else {
            // Restaurar scroll
            document.body.style.overflow = 'unset';
        }

        // Cleanup: garantir que o scroll seja restaurado quando o componente for desmontado
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isExpanded]);

    return (
        <>
            {/* Regular image */}
            <img src={src} alt={alt} className={`w-full cursor-pointer transition-transform hover:scale-101 ${className}`} onClick={openFullscreen} />

            {/* Fullscreen overlay */}
            {isExpanded && (
                <div
                    className="bg-opacity-90 fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-lg"
                    onClick={closeFullscreen}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                    role="dialog"
                    aria-label="Fullscreen image view"
                >
                    {/* Close button */}
                    <button
                        onClick={closeFullscreen}
                        className="bg-opacity-20 hover:bg-opacity-30 absolute top-4 right-4 z-10 rounded-full bg-white p-2 text-black backdrop-blur-sm transition-colors hover:cursor-pointer focus:ring-2 focus:ring-white focus:outline-none"
                        aria-label="Close fullscreen image"
                    >
                        <X size={24} />
                    </button>

                    {/* Fullscreen image */}
                    <img
                        src={src}
                        alt={alt}
                        className="max-h-full w-full max-w-full object-contain"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on image
                    />
                </div>
            )}
        </>
    );
}
