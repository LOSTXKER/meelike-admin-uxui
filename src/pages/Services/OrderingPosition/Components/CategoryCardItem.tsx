import { type FC, Fragment } from 'react';
import IconMenuDragAndDrop from '@/components/Icon/Menu/IconMenuDragAndDrop';
import { clsx } from '@mantine/core';

interface Props {
    isMoving?: boolean;
    id: number;
    name: string;
    iconUrl?: string;
}

const CategoryCardItem: FC<Props> = ({ isMoving, id, name, iconUrl }) => {
    return (
        <li className='cursor-grab'>
            <div
                id={`category-card-item-${id}`}
                className={clsx('px-2 py-1 bg-gray-200 rounded-none hover:opacity-60 h-[56px]', {
                    'opacity-50 bg-meelike-primary': isMoving
                })}
            >
                <div className='grid grid-cols-12 gap-4 items-center h-full'>
                    <div className='col-span-12'>
                        <div className='flex flex-row items-center gap-4 h-full'>
                            <IconMenuDragAndDrop className='text-meelike-dark drag-handle cursor-move' />

                            {iconUrl && (
                                <img
                                    src={iconUrl}
                                    onError={e => {
                                        // If image fails to load, show fallback image
                                        e.currentTarget.src = '/assets/meelike/no-img.png';
                                    }}
                                    alt={name}
                                    className='w-8 h-8 object-cover'
                                />
                            )}

                            <div className='text-meelike-dark font-bold'>{name}</div>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
};

export default CategoryCardItem;
