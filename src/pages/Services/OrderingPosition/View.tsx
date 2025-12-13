import { type FC, Fragment, useRef, useEffect } from 'react';
import { ReactSortable } from 'react-sortablejs';
import CategoryCardItem from './Components/CategoryCardItem';
import ServiceCardItem from './Components/ServiceCardItem';
import NotAssignedItem from './Components/NotAssignedItem';
import IconSave from '@/components/Icon/IconSave';

import useViewModel from './ViewModel';
import { clsx } from '@mantine/core';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import { Link } from 'react-router-dom';
import { paths } from '@/router/paths';

const ServiceOrderingPositionView: FC = () => {
    const { isLoading, isSubmitting, currentMovingId, data, onMovePositionEnd } = useViewModel();
    const initialRenderRef = useRef(true);
    const previousDataRef = useRef<any[]>([]);

    // Store the initial data for comparison
    useEffect(() => {
        if (data.length > 0) {
            previousDataRef.current = [...data];
        }
    }, [data]);

    return (
        <Fragment>
            {isLoading && (
                <div className='flex items-center justify-center h-screen'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
                </div>
            )}

            {!isLoading && (
                <div className='relative'>
                    <div className='flex items-center justify-between mb-4'>
                        <h1 className='text-2xl font-bold'>จัดเรียงลำดับบริการ</h1>
                        <Link to={paths.services.list}>
                            <button type='button' className='btn btn-primary' disabled={isSubmitting}>
                                <IconArrowBackward className='w-5 h-5 mr-2' />
                                ย้อนกลับ
                            </button>
                        </Link>
                    </div>

                    {isSubmitting && (
                        <div className='absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50'>
                            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900'></div>
                        </div>
                    )}
                    <ul className='panel'>
                        <ReactSortable
                            id='service-sortable-table'
                            className={clsx({
                                'is-submitting': isSubmitting
                            })}
                            list={data}
                            setList={newList => {
                                // Skip processing if this is the initial render
                                if (initialRenderRef.current) {
                                    initialRenderRef.current = false;
                                    return;
                                }

                                // Check if the order actually changed
                                const hasOrderChanged = newList.some((item, index) => item.id !== previousDataRef.current[index]?.id || item.type !== previousDataRef.current[index]?.type);

                                if (hasOrderChanged) {
                                    // Update our reference for next comparison
                                    previousDataRef.current = [...newList];
                                    // Process the actual changes
                                    onMovePositionEnd(newList);
                                }
                            }}
                            animation={300}
                            group='shared'
                            handle='.drag-handle'
                            invertSwap
                            disabled={isSubmitting}
                        >
                            {data.map((item, index) => {
                                return (
                                    <Fragment key={`service-ordering-${index + 1}`}>
                                        {item.type === 'category' && (
                                            <CategoryCardItem isMoving={currentMovingId === `category-card-item-${item.id}`} id={item.id} name={item.name} iconUrl={item.iconUrl} />
                                        )}
                                        {item.type === 'service' && (
                                            <ServiceCardItem
                                                isMoving={currentMovingId === `service-card-item-${item.id}`}
                                                id={item.id}
                                                externalServiceId={item.externalServiceId}
                                                name={item.name}
                                                providerService={item.providerService}
                                                rateAmount={item.rateAmount}
                                                rateTHB={item.rateTHB}
                                                isActive={item.isActive}
                                                providerDisabled={item.providerDisabled}
                                            />
                                        )}
                                        {item.type === 'not-assigned' && <NotAssignedItem />}
                                    </Fragment>
                                );
                            })}
                        </ReactSortable>
                    </ul>
                </div>
            )}

            <style>{`
                #service-sortable-table > *:first-child {
                    border-top-left-radius: 0.375rem;
                    border-top-right-radius: 0.375rem;

                    border-top: 1px solid #e5e7eb; /* Tailwind gray-200 */
                    border-left: 1px solid #e5e7eb;
                    border-right: 1px solid #e5e7eb;
                }

                #service-sortable-table > *:not(:last-child) {
                    border-bottom: 1px solid #e5e7eb; /* Tailwind gray-200 */
                    border-left: 1px solid #e5e7eb;
                    border-right: 1px solid #e5e7eb;
                }

                #service-sortable-table > *:last-child {
                    border-bottom-left-radius: 0.375rem;
                    border-bottom-right-radius: 0.375rem;

                    border-bottom: 1px solid #e5e7eb; /* Tailwind gray-200 */
                    border-left: 1px solid #e5e7eb;
                    border-right: 1px solid #e5e7eb;
                }

                #service-sortable-table.is-submitting {
                    opacity: 0.5;
                    pointer-events: none; /* Prevent interaction while submitting */
                }

                #service-sortable-table .sortable-ghost {
                    opacity: 0;
                }
            `}</style>
        </Fragment>
    );
};

export default ServiceOrderingPositionView;
