import { ReactNode, type FC } from 'react';
import { clsx } from '@mantine/core';

interface FilterButtonProps {
    active: boolean;
    icon?: JSX.Element | ReactNode;
    count?: number;
    title?: string;
    onClick?: () => void;
    textClassName?: string;
    className?: string;
}

const FilterButton: FC<FilterButtonProps> = ({ active, icon, count, title, onClick, textClassName, className }) => {
    return (
        <button
            type='button'
            className={clsx(
                'inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium',
                'border transition-all duration-200 ease-out',
                'hover:scale-[1.02] active:scale-[0.98]',
                {
                    [className ?? '']: !!className,
                    [textClassName ?? '']: !!textClassName,
                    // Active state
                    'bg-meelike-dark text-white border-meelike-dark shadow-md': active && !className,
                    // Inactive state
                    'bg-white text-meelike-dark/80 border-black/10 hover:bg-meelike-secondary/30 hover:border-meelike-dark/20': !active && !className,
                }
            )}
            onClick={onClick}
        >
            {count !== undefined && count !== 0 && (
                <span className={clsx(
                    'text-xs font-semibold rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center',
                    active ? 'bg-white/20 text-white' : 'bg-meelike-dark/10 text-meelike-dark'
                )}>
                    {count}
                </span>
            )}
            {icon}
            <span>{title}</span>
        </button>
    );
};

export default FilterButton;
