import { type FC, Fragment } from 'react';
import IconMenuDragAndDrop from '@/components/Icon/Menu/IconMenuDragAndDrop';
import { clsx } from '@mantine/core';
import Decimal from 'decimal.js';
import Status from '@/components/Status';

interface Props {
    isMoving?: boolean;
    id: number;
    externalServiceId: string;
    name: string;
    providerService: any;
    rateTHB: string | number;
    rateAmount: string | number;
    isActive: boolean;
    providerDisabled: boolean;
}

const ServiceCardItem: FC<Props> = ({ isMoving, id, name, providerService, rateAmount, rateTHB, isActive, providerDisabled }) => {
    return (
        <li className='cursor-grab'>
            <div
                id={`service-card-item-${id}`}
                className={clsx('bg-gray-50 px-2 py-1 rounded-none hover:opacity-60 h-[56px]', {
                    'opacity-50 bg-meelike-primary': isMoving
                })}
            >
                <div className='grid grid-cols-12 gap-4 items-center h-full'>
                    <div className='col-span-12'>
                        <div className='flex flex-row items-center gap-4 h-full'>
                            <IconMenuDragAndDrop className='text-meelike-dark drag-handle cursor-move' />

                            <div className='w-8 text-center'>{id}</div>

                            <div className='flex flex-row justify-between items-center w-full gap-2'>
                                <div className='flex flex-row items-center gap-2'>
                                    <div>
                                        <div className='text-meelike-dark font-bold'>
                                            {name.substring(0, 60)}
                                            {name.length > 60 && '...'}
                                        </div>
                                        <div className='text-meelike-dark'>{providerService?.provider?.name}</div>
                                    </div>

                                    {providerDisabled ? (
                                        <div>
                                            <div className='inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium'>Provider Disabled</div>
                                        </div>
                                    ) : (
                                        <Status isActive={isActive} />
                                    )}
                                </div>

                                <div>
                                    <div className='text-meelike-dark text-end'>
                                        $
                                        {new Decimal(rateAmount ?? 0).toNumber().toLocaleString('th-TH', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}{' '}
                                        / ฿
                                        {new Decimal(rateTHB ?? 0).toNumber().toLocaleString('th-TH', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
};

export default ServiceCardItem;
