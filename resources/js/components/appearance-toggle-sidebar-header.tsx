import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { LucideIcon, Monitor, Moon, Sun } from 'lucide-react';
import { ButtonHTMLAttributes, useEffect, useState } from 'react';

export default function AppearanceToggleSidebarHeader({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    // This component is used in the sidebar header to toggle appearance settings.
    // It allows users to switch between light, dark, and system modes.
    // It uses just one button to cycle through the modes.

    const { appearance, updateAppearance } = useAppearance();

    const tabs: { value: Appearance; icon: LucideIcon; label: string }[] = [
        { value: 'light', icon: Sun, label: 'Light' },
        { value: 'dark', icon: Moon, label: 'Dark' },
        { value: 'system', icon: Monitor, label: 'System' },
    ];

    const [Icon, setIcon] = useState<LucideIcon>(tabs.find(tab => tab.value === appearance)?.icon || Sun);

    useEffect(() => {
        setIcon(tabs.find(tab => tab.value === appearance)?.icon || Sun);
    }, [appearance]);

    function handleClick() {
        const nextIndex = (tabs.findIndex(tab => tab.value === appearance) + 1) % tabs.length;
        const nextAppearance = tabs[nextIndex].value;
        updateAppearance(nextAppearance);
    }

    // const { icon: Icon, label } = tabs.find(tab => tab.value === appearance) || { icon: Sun, label: 'Light' };

    // Render a single button that cycles through the appearance modes
    // The button displays the icon and label of the current appearance mode
    // When clicked, it updates the appearance to the next mode in the cycle
    // The button's styles change based on the current appearance mode

    return (
        <button
            onClick={handleClick}
            className={cn(
                'flex items-center rounded-md px-3.5 py-1.5 transition-colors',
                'hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60',
                className,
            )}
            {...props}
        >
            <Icon className="h-4 w-4" />
        </button>
    );
}
