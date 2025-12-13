import { type FC, Fragment } from 'react';
import { Link } from 'react-router-dom';

import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import IconX from '@/components/Icon/IconX';
import IconTag from '@/components/Icon/IconTag';
import IconShoppingCart from '@/components/Icon/IconShoppingCart';
import IconInfoCircle from '@/components/Icon/IconInfoCircle';
import Tippy from '@tippyjs/react';
import OrderCompletionChart from './Components/OrderCompletionChart';

import useViewModel from './ViewModel';
import { generateServiceIcon } from '@/Utils/generateServiceIcon';
import { generateServiceCategoryIcon } from '@/Utils/generateServiceCategoryIcon';
import { clsx } from '@mantine/core';

const ServiceDetailPopupView: FC = () => {
    const {
        t,
        detailKeys,
        generateDetailValue,
        isOpen,
        data,
        orderCompletionTimeSerie,
        setOrderCompletionTimeSerie,
        orderCompletionSeries,
        orderCompletionCategories,
        analyticType,
        // setAnalyticType,
        onClose,
    } = useViewModel();

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" open={isOpen} onClose={onClose}>
                <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0" />
                </TransitionChild>
                <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                    <div className="flex min-h-screen items-center justify-center px-4">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel as="div" className="panel my-8 w-full max-w-2xl overflow-visible rounded-lg border-0 p-0 text-black bg-meelike-white relative">
                                {/* Close */}
                                <div className="absolute right-0 flex items-center justify-end px-5 py-3">
                                    <button type="button" className="text-mls-light-gray hover:bg-white-light transition-all rounded-md p-2" onClick={onClose}>
                                        <IconX />
                                    </button>
                                </div>
                                {/* Body */}
                                <div className="grid grid-cols-12 gap-y-4 mb-5 px-6 items-start pt-16">
                                    <div className="col-span-12">
                                        <div className="panel h-full flex flex-row items-center gap-2 lg:gap-5">
                                            <div>{data?.platform && generateServiceIcon(data?.platform, 60, 60)}</div>
                                            <div>
                                                <div className="mb-1 font-bold text-meelike-dark-2 text-lg lg:text-xl">{data?.name}</div>
                                                <div className="mb-1 text-meelike-dark-3 text-sm lg:text-base flex flex-row items-center">
                                                    <div className="mr-2">{generateServiceCategoryIcon(data?.category, 20, 20)}</div>
                                                    <span>{data?.categoryName}</span>
                                                </div>
                                                <div className="flex flex-row items-center">
                                                    <IconTag className="text-meelike-primary mr-2 inline w-7 h-7" fill />
                                                    <span className="font-bold text-xl lg:text-2xl text-black">
                                                        {(data?.ratePer1000 ?? 0).toLocaleString('th-TH', {
                                                            style: 'currency',
                                                            currency: 'THB',
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}{' '}
                                                        / 1,000 {t('serviceDetail.orders')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-12">
                                        <Link to={`/place-order?serviceId=${data?.serviceId ?? 0}`} onClick={onClose}>
                                            <button
                                                type="button"
                                                className="btn bg-meelike-dark-2 shadow rounded-lg text-meelike-white font-bold text-sm lg:text-base px-4 py-2 hover:opacity-80 border-none w-full"
                                            >
                                                <IconShoppingCart className="text-white h-7 w-7 mr-2" />
                                                {t('serviceDetail.orderNow')}
                                            </button>
                                        </Link>
                                    </div>

                                    <div
                                        className="col-span-12"
                                        dangerouslySetInnerHTML={{
                                            __html: data?.description ?? '',
                                        }}
                                    ></div>

                                    <div className="col-span-12">
                                        <div className="grid grid-cols-12">
                                            {detailKeys.map((key, idx) => (
                                                <Fragment key={`detail-${key}`}>
                                                    {!['warrantyEnabled'].includes(key.key) && (
                                                        <Fragment>
                                                            <div
                                                                className={clsx('col-span-7 text-sm lg:text-base py-3 px-6 text-[#0E1726] font-bold flex flex-row items-center', {
                                                                    'bg-meelike-secondary': idx % 2 === 0,
                                                                })}
                                                            >
                                                                <span>{key.label}</span>
                                                                <Tippy content={key.tooltip}>
                                                                    <div className="inline ml-2">
                                                                        <IconInfoCircle className="h-5 w-5 cursor-pointer" />
                                                                    </div>
                                                                </Tippy>
                                                            </div>
                                                            <div
                                                                className={clsx('col-span-5 text-sm lg:text-base py-3 px-6 text-[#0E1726]', {
                                                                    'bg-meelike-secondary': idx % 2 === 0,
                                                                })}
                                                            >
                                                                {generateDetailValue(key.key, data?.[key.key])}
                                                            </div>
                                                        </Fragment>
                                                    )}

                                                    {key.key === 'warrantyEnabled' && (
                                                        <Fragment>
                                                            <div
                                                                className={clsx('col-span-7 text-sm lg:text-base py-3 px-6 text-[#0E1726] font-bold flex flex-row items-center', {
                                                                    'bg-meelike-secondary': idx % 2 === 0,
                                                                })}
                                                            >
                                                                <span>{key.label}</span>
                                                                <Tippy content={key.tooltip}>
                                                                    <div className="inline ml-2">
                                                                        <IconInfoCircle className="h-5 w-5 cursor-pointer" />
                                                                    </div>
                                                                </Tippy>
                                                            </div>
                                                            <div
                                                                className={clsx('col-span-5 text-sm lg:text-base py-3 px-6 text-[#0E1726]', {
                                                                    'bg-meelike-secondary': idx % 2 === 0,
                                                                })}
                                                            >
                                                                {data?.warrantyEnabled ? <Fragment>{data?.warrantyDurationDays ?? 0} days</Fragment> : '-'}
                                                            </div>
                                                        </Fragment>
                                                    )}
                                                </Fragment>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="col-span-12">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                            <div className="text-lg lg:text-xl text-meelike-dark font-semibold">{t('serviceDetail.orderCompletion')}</div>
                                            {/* <div className="relative inline-flex align-middle shadow-lg">
                                                <button
                                                    type="button"
                                                    className={clsx('btn border-0 shadow-none ltr:rounded-r-none rtl:rounded-l-none', {
                                                        'bg-[#e0bb66] text-meelike-dark-2 hover:opacity-80 font-bold': analyticType === 'orderCompletion',
                                                        'bg-meelike-primary text-meelike-dark-2 hover:opacity-70': analyticType !== 'orderCompletion',
                                                    })}
                                                    onClick={() => setAnalyticType('orderCompletion')}
                                                >
                                                    {analyticType === 'orderCompletion' && <div className="rounded-full bg-meelike-success h-2 w-2 mr-2"></div>}
                                                    <span>Order Completion</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className={clsx('btn border-0 shadow-none ltr:rounded-l-none rtl:rounded-r-none', {
                                                        'bg-[#e0bb66] text-meelike-dark-2 hover:opacity-80 font-bold': analyticType === 'speed',
                                                        'bg-meelike-primary text-meelike-dark-2 hover:opacity-70': analyticType !== 'speed',
                                                    })}
                                                    onClick={() => setAnalyticType('speed')}
                                                >
                                                    {analyticType === 'speed' && <div className="rounded-full bg-meelike-success h-2 w-2 mr-2"></div>}
                                                    <span>Speed</span>
                                                </button>
                                            </div> */}
                                        </div>
                                    </div>

                                    <div className="col-span-12">
                                        {analyticType === 'orderCompletion' && (
                                            <OrderCompletionChart
                                                categories={orderCompletionCategories}
                                                series={orderCompletionSeries}
                                                timeSerieValue={orderCompletionTimeSerie}
                                                setTimeSerieValue={setOrderCompletionTimeSerie}
                                            />
                                        )}
                                    </div>
                                </div>
                                {/* Footer */}
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ServiceDetailPopupView;
