import { useState, useEffect } from 'react';
import { useServiceCategoryStore } from '@/store/service-category';
import { useServiceStore } from '@/store/service';
import { useProviderStore } from '@/store/provider';
import { useProviderServiceStore } from '@/store/provider-service';
import { useExchangeRateStore } from '@/store/exchange-rate';
import { useShallow } from 'zustand/react/shallow';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import Decimal from 'decimal.js';
import debounce from 'lodash/debounce';
import { ServiceType } from '@/Configuration/service-type';
import { ServiceTypeOptions } from '@/Configuration/service-type';

export interface Props {
    formType: 'create' | 'edit';
    selectedId: string;
    isOpen: boolean;
    handleClose: () => void;
    handleAfterSubmit: () => void;
}

const INITIAL_FORM_STATE = {
    providerId: 0,
    providerServiceId: 0,
    externalServiceId: '',
    serviceCategoryId: 0,
    name: '',
    description: '',
    fixedPrice: '',
    ratePercent: '',
    syncRateEnabled: false,
    finalizePriceWithCost: true,
    convertedAmount: '',
    minAmount: '',
    maxAmount: '',
    warranty: true,
    warrantyDateDuration: '',
    warrantyQuality: '',
    dripfeed: false,
    refill: false,
    refillType: '' as 'provider' | 'place_order' | 'manual' | '',
    refillProviderId: 0,
    refillProviderServiceId: 0,
    refillMinQuantity: '',
    refillMaxQuantityPercent: '',
    refillDays: '',
    cancel: false,
    category: '',
    denyLinkDuplicates: false,
    isActive: true,
    type: ServiceType.Default
};

const ViewModel = (props: Props) => {
    const { formType, selectedId, isOpen, handleClose, handleAfterSubmit } = props;
    const { data, create, update } = useServiceStore(
        useShallow(state => ({
            data: state.selected,
            create: state.create,
            update: state.update
        }))
    );
    const { serviceCategories, getServiceCategories } = useServiceCategoryStore(
        useShallow(state => ({
            serviceCategories: state.data,
            getServiceCategories: state.getAll
        }))
    );
    const { providers, getProviders } = useProviderStore(
        useShallow(state => ({
            providers: state.data,
            getProviders: state.getAll
        }))
    );
    const { getProviderServices } = useProviderServiceStore(
        useShallow(state => ({
            providerServices: state.data,
            getProviderServices: state.getAll
        }))
    );
    const { convert } = useExchangeRateStore(
        useShallow(state => ({
            convert: state.convert
        }))
    );

    const [isHideToConfirm, setIsHideToConfirm] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isLoadingProviderServices, setIsLoadingProviderServices] = useState<boolean>(false);
    const [isLoadingRefillProviderServices, setIsLoadingRefillProviderServices] = useState<boolean>(false);
    const [formState, setFormState] = useState<typeof INITIAL_FORM_STATE>(INITIAL_FORM_STATE);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    const [allProviderServices, setAllProviderServices] = useState<any[]>([]);
    const [selectedProvider, setSelectedProvider] = useState<{ [key: string]: any }>({});
    const [serviceProviderServiceOptions, setServiceProviderServiceOptions] = useState<any[]>([]);
    const [selectedServiceProviderService, setSelectedServiceProviderService] = useState<{ [key: string]: any }>({});

    const [, setAllRefillProviderServices] = useState<any[]>([]);
    const [refillProviderServiceOptions, setRefillProviderServiceOptions] = useState<any[]>([]);
    const [selectedRefillProviderService, setSelectedRefillProviderService] = useState<{ [key: string]: any }>({});

    const serviceCategoryOptions = serviceCategories.map(category => ({
        label: category.name,
        value: category.id,
        icon: category?.iconUrl ?? null
    }));
    const providerOptions = providers.map(provider => ({
        label: `${provider.name} (${provider.currency})`,
        value: provider.id
    }));
    const denyLinkDuplicatesOptions = [
        { label: 'ใช่', value: true },
        { label: 'ไม่ใช่', value: false }
    ];
    const refillTypeOptions = [
        { label: 'Provider', value: 'provider' },
        { label: 'Place Order', value: 'place_order' },
        { label: 'Manual', value: 'manual' }
    ];
    const dripFeedOptions = [
        { label: 'เปิดใช้งาน', value: true },
        { label: 'ปิดการใช้งาน', value: false }
    ];
    const cancelOptions = [
        { label: 'เปิดใช้งาน', value: true },
        { label: 'ปิดการใช้งาน', value: false }
    ];
    const warrantyQualityOptions = [
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Low', value: 'Low' }
    ];

    const validationSchema = Yup.object().shape({
        providerId: Yup.number().not([0, '0'], 'กรุณาเลือกผู้ให้บริการ').required('กรุณาเลือกผู้ให้บริการ'),
        providerServiceId: Yup.number().not([0, '0'], 'กรุณาเลือกบริการ').required('กรุณาเลือกบริการ'),
        serviceCategoryId: Yup.number().not([0, '0'], 'กรุณาเลือกหมวดหมู่บริการ').required('กรุณาเลือกหมวดหมู่บริการ'),
        name: Yup.string().when('providerServiceId', ([], schema) => {
            return formState.providerServiceId !== 0 && formState.providerId !== 0 ? schema.required('กรุณากรอกชื่อบริการ') : schema;
        }),
        // Custom validation: at least one of fixedPrice or ratePercent must be present and valid
        fixedPrice: Yup.string()
            .test('fixedPrice-or-ratePercent', 'กรุณากรอกอย่างน้อยหนึ่งใน "Fixed Price" หรือ "เปอร์เซ็นต์"', function (value) {
                const { ratePercent } = this.parent;
                const hasFixed = value !== '' && !isNaN(parseFloat(value ?? ''));
                const hasRate = ratePercent !== '' && !isNaN(parseFloat(ratePercent));
                return hasFixed || hasRate;
            })
            .nullable(),
        ratePercent: Yup.string()
            .test('ratePercent-or-fixedPrice', 'กรุณากรอกอย่างน้อยหนึ่งใน "Fixed Price" หรือ "เปอร์เซ็นต์"', function (value) {
                const { fixedPrice } = this.parent;
                const hasRate = value !== '' && !isNaN(parseFloat(value ?? ''));
                const hasFixed = fixedPrice !== '' && !isNaN(parseFloat(fixedPrice));
                return hasRate || hasFixed;
            })
            .nullable(),
        minAmount: Yup.string().when('providerServiceId', ([], schema) => {
            if (formState.providerServiceId !== 0 && formState.providerId !== 0) {
                const min = Number(selectedServiceProviderService?.minAmount) || 0;
                return schema
                    .transform((value, originalValue) => (originalValue === '' ? NaN : value))
                    .not([NaN], 'กรุณากรอกจำนวนออร์เดอร์ขั้นต่ำ')
                    .required('กรุณากรอกจำนวนออร์เดอร์ขั้นต่ำ')
                    .test('min-amount', `จำนวนออร์เดอร์ขั้นต่ำต้องไม่ต่ำกว่า ${min.toLocaleString()}`, (value: any) => {
                        if (value === undefined || value === null || value === '') return false;
                        return Number(value) >= min;
                    });
            }
            return schema;
        }),
        maxAmount: Yup.string().when('providerServiceId', ([], schema) => {
            return formState.providerServiceId !== 0 && formState.providerId !== 0
                ? schema
                      .transform((value, originalValue) => (originalValue === '' ? NaN : value))
                      .not([NaN], 'กรุณากรอกจำนวนออร์เดอร์สูงสุด')
                      .required('กรุณากรอกจำนวนออร์เดอร์สูงสุด')
                      .max(selectedServiceProviderService?.maxAmount, `จำนวนออร์เดอร์สูงสุดต้องไม่เกิน ${parseInt(selectedServiceProviderService?.maxAmount).toLocaleString()}`)
                : schema;
        }),
        // warranty: Yup.boolean().required('กรุณาเลือกคุณสมบัติการรับประกัน'),
        // warrantyDateDuration: Yup.string().when('warranty', ([], schema) => {
        //     return formState.warranty ? schema.not([''], 'กรุณากรอกจำนวนวันที่รับประกัน') : schema;
        // }),
        // warrantyQuality: Yup.string().when('warranty', ([], schema) => {
        //     return formState.warranty ? schema.not([''], 'กรุณาเลือกคุณภาพการรับประกัน') : schema;
        // }),
        refillType: Yup.string().when('refill', ([], schema) => {
            return formState.refill ? schema.not([''], 'กรุณาเลือกประเภท') : schema;
        }),
        refillProviderId: Yup.string().when('refill', ([], schema) => {
            return formState.refill && (formState.refillType === 'provider' || formState.refillType === 'place_order')
                ? schema.transform((value, originalValue) => (originalValue === '' ? NaN : value)).not([NaN, 0, '0'], 'กรุณาเลือกผู้ให้บริการ')
                : schema;
        }),
        refillProviderServiceId: Yup.string().when('refill', ([], schema) => {
            return formState.refill && formState.refillType === 'place_order'
                ? schema.transform((value, originalValue) => (originalValue === '' ? NaN : value)).not([NaN, 0, '0'], 'กรุณาเลือกบริการ')
                : schema;
        }),
        // refillMinQuantity: Yup.string().when('refill', ([], schema) => {
        //     return formState.refill && formState.refillType === 'place_order'
        //         ? schema
        //               .transform((value, originalValue) => (originalValue === '' ? NaN : value))
        //               .not([NaN], 'กรุณากรอกจำนวนขั้นต่ำ')
        //               .required('กรุณากรอกจำนวนขั้นต่ำ')
        //         : schema;
        // }),
        // refillMaxQuantityPercent: Yup.string().when('refill', ([], schema) => {
        //     return formState.refill && formState.refillType === 'place_order'
        //         ? schema
        //               .transform((value, originalValue) => (originalValue === '' ? NaN : value))
        //               .not([NaN], 'กรุณากรอกเปอร์เซ็นต์์จำนวนสูงสุด')
        //               .required('กรุณากรอกเปอร์เซ็นต์์จำนวนสูงสุด')
        //         : schema;
        // }),
        refillDays: Yup.string().when('refill', ([], schema) => {
            return formState.refill && (formState.refillType === 'provider' || formState.refillType === 'place_order')
                ? schema
                      .transform((value, originalValue) => (originalValue === '' ? NaN : value))
                      .not([NaN], 'กรุณากรอกจำนวนวัน')
                      .required('กรุณากรอกจำนวนวัน')
                : schema;
        }),
        type: Yup.string().not([''], 'กรุณาเลือกประเภทบริการ').required('กรุณาเลือกประเภทบริการ')
    });

    const handleInitState = () => {
        if (isOpen === true && formType === 'edit') {
            const provider = data?.providerService?.provider ?? {};
            const providerService = data?.providerService ?? {};
            const refillProviderService = data?.refillProviderService ?? {};

            // Assign original provider price to selectedServiceProviderService
            if (providerService?.rate) {
                convert(provider?.currency, 'THB', new Decimal(providerService.rate).toNumber()).then(response => {
                    setSelectedServiceProviderService({
                        ...providerService,
                        convertedAmount: response.success ? response.data.convertedAmount : ''
                    });
                });
            } else {
                setSelectedServiceProviderService({
                    ...providerService,
                    convertedAmount: ''
                });
            }

            // Prepare initial form state
            const initialFormState = {
                ...INITIAL_FORM_STATE,
                ...data,
                providerServiceId: providerService?.id ?? 0,
                providerId: providerService?.providerId ?? 0,
                refillProviderId: refillProviderService?.providerId ?? 0,
                refillType: data?.refillType ?? '',
                refillProviderServiceId: refillProviderService?.id ?? 0,
                refillMinQuantity: data?.refillMinQuantity ?? '',
                refillMaxQuantityPercent: data?.refillMaxQuantityPercent ?? '',
                refillDays: data?.refillDays ?? ''
                // convertedAmount will be set below
            };

            // Calculate convertedAmount for editing mode and set it in one setFormState call
            const syncRateEnabled = data?.syncRateEnabled ?? false;
            const finalizePriceWithCost = data?.finalizePriceWithCost ?? true;
            const originalRate = new Decimal(syncRateEnabled === true ? providerService?.rate ?? 0 : data?.currentRate ?? 0);
            const fixedPrice = data?.fixedPrice !== '' && !isNaN(parseFloat(data?.fixedPrice)) ? new Decimal(data.fixedPrice) : new Decimal(0);
            const ratePercent = data?.ratePercent !== '' && !isNaN(parseFloat(data?.ratePercent)) ? new Decimal(data.ratePercent).dividedBy(100) : null;

            if (ratePercent !== null && finalizePriceWithCost) {
                // If ratePercent is present, use increased rate and add fixedPrice if present
                const finalRate = originalRate.plus(originalRate.times(ratePercent));
                convert(provider?.currency, 'THB', finalRate.toNumber()).then(response => {
                    let convertedAmount = '';
                    if (response.success) {
                        let total = new Decimal(response.data.convertedAmount || 0);
                        if (!fixedPrice.isZero()) {
                            total = total.plus(fixedPrice);
                        }
                        convertedAmount = total.toString();
                    }
                    setFormState({
                        ...initialFormState,
                        convertedAmount
                    });
                });
            } else if (!fixedPrice.isZero()) {
                // Only fixedPrice, use original convertedAmount + fixedPrice
                convert(provider?.currency, 'THB', originalRate.toNumber()).then(response => {
                    let convertedAmount = '';
                    if (response.success) {
                        let total = new Decimal(response.data.convertedAmount || 0).plus(fixedPrice);
                        convertedAmount = total.toString();
                    }
                    setFormState({
                        ...initialFormState,
                        convertedAmount
                    });
                });
            } else {
                // Neither, just use original convertedAmount if available
                setFormState({
                    ...initialFormState,
                    convertedAmount: providerService?.convertedAmount ?? ''
                });
            }

            setSelectedRefillProviderService(refillProviderService);

            fetchProviderServices(providerService?.providerId);
            if (refillProviderService?.providerId) {
                fetchRefillProviderServices(refillProviderService?.providerId);
            }
        }
    };

    const handleResetState = () => {
        setFormState(INITIAL_FORM_STATE);
        setFormErrors({});
        setIsHideToConfirm(false);
        setIsSubmitting(false);
    };

    const fetchMasterData = () => {
        Promise.all([getProviders(), getServiceCategories()]).then(() => {
            handleInitState();
        });
    };

    const fetchProviderServices = (providerId: string) => {
        setIsLoadingProviderServices(true);
        getProviderServices(providerId)
            .then(res => {
                if (res.success) {
                    const options = res.data
                        .map(service => ({
                            label: `${service.externalServiceId} - ${service.name}`,
                            value: service.id,
                            searchableLabel: `${service.externalServiceId} - ${service.name}`.toLowerCase(),
                            ...service
                        }))
                        .filter(s => s.providerDisabled === false);
                    setAllProviderServices(res.data);
                    setServiceProviderServiceOptions(options);
                }
            })
            .finally(() => {
                setIsLoadingProviderServices(false);
            });
    };

    const fetchRefillProviderServices = (providerId: string) => {
        setIsLoadingRefillProviderServices(true);
        getProviderServices(providerId)
            .then(res => {
                if (res.success) {
                    const options = res.data.map(service => ({
                        label: `${service.externalServiceId} - ${service.name}`,
                        value: service.id,
                        searchableLabel: `${service.externalServiceId} - ${service.name}`.toLowerCase(),
                        ...service
                    }));
                    setAllRefillProviderServices(res.data);
                    setRefillProviderServiceOptions(options);
                }
            })
            .finally(() => {
                setIsLoadingRefillProviderServices(false);
            });
    };

    const handleAssignService = (serviceId: any) => {
        if (serviceId !== null && serviceId !== undefined && serviceId !== '') {
            const selectedService = allProviderServices.find(service => service.id === parseInt(serviceId));
            if (selectedService) {
                convert(selectedProvider?.currency, 'THB', selectedService.rate).then(response => {
                    if (response.success) {
                        const { convertedAmount } = response.data;
                        setSelectedServiceProviderService({
                            ...selectedService,
                            convertedAmount: convertedAmount
                        });
                        setFormState(prevState => ({
                            ...prevState,
                            externalServiceId: selectedService.externalServiceId,
                            name: selectedService.name,
                            minAmount: selectedService.minAmount,
                            maxAmount: selectedService.maxAmount,
                            category: selectedService.categoryName,
                            dripfeed: selectedService.dripfeed,
                            cancel: selectedService.cancel
                        }));
                    } else {
                        const toast = Swal.mixin({
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 3000,
                            // @ts-ignore
                            customClass: 'mls-custom'
                        });
                        toast.fire({
                            icon: 'success',
                            title: `ดึงข้อมูลอัตราแลกเปลี่ยนไม่สำเร็จ : ${response.data?.message ?? ''}`,
                            padding: '10px 20px'
                        });
                    }
                });
            }
        }
    };

    const debouncedConvertRate = debounce(
        (finalRate: Decimal, setConvertedAmount: (amount: string) => void) => {
            convert(selectedProvider?.currency, 'THB', finalRate.toNumber()).then(response => {
                if (response.success) {
                    const { convertedAmount } = response.data;
                    setConvertedAmount(convertedAmount);
                } else {
                    const toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        // @ts-ignore
                        customClass: 'mls-custom'
                    });
                    toast.fire({
                        icon: 'error',
                        title: `ดึงข้อมูลอัตราแลกเปลี่ยนไม่สำเร็จ : ${response.data?.message ?? ''}`,
                        padding: '10px 20px'
                    });
                }
            });
        },
        900, // Delay in milliseconds
        { trailing: true } // Ensure the function is executed after the user stops typing
    );

    // Helper to calculate and update convertedAmount according to the 3 criteria
    const calculateAndSetConvertedAmount = (ratePercentStr: string, fixedPriceStr: string) => {
        const originalRate = new Decimal(selectedServiceProviderService?.rate ?? 0);
        const originalConvertedAmount = selectedServiceProviderService?.convertedAmount ?? '';
        const hasRatePercent = ratePercentStr !== '' && !isNaN(parseFloat(ratePercentStr));
        const hasFixedPrice = fixedPriceStr !== '' && !isNaN(parseFloat(fixedPriceStr));
        const finalizePriceWithCost = formState.finalizePriceWithCost;

        // 1. Only fixed price: use selectedServiceProviderService.convertedAmount + fixedPrice
        if ((!hasRatePercent && hasFixedPrice) || !finalizePriceWithCost) {
            let total = new Decimal(!finalizePriceWithCost ? 0 : originalConvertedAmount || 0).plus(new Decimal(fixedPriceStr));
            setFormState(prevState => ({
                ...prevState,
                convertedAmount: total.toString()
            }));
            return;
        }

        // 2. Only rate percent: call API with increased rate, no fixed price
        // 3. Both: call API with increased rate, add fixed price after conversion
        let rateToConvert: Decimal = originalRate;
        if (hasRatePercent && finalizePriceWithCost) {
            const ratePercent = new Decimal(ratePercentStr).dividedBy(100);
            rateToConvert = originalRate.plus(originalRate.times(ratePercent));
        }

        debouncedConvertRate(rateToConvert, convertedAmount => {
            let total: Decimal;
            if (hasFixedPrice) {
                // Both: add fixed price to converted increased rate
                total = new Decimal(convertedAmount || 0).plus(new Decimal(fixedPriceStr));
            } else {
                // Only rate percent: just use converted increased rate
                total = new Decimal(convertedAmount || 0);
            }
            setFormState(prevState => ({
                ...prevState,
                convertedAmount: total.toString()
            }));
        });
    };

    const onChangeFormState = (key: string, value: any) => {
        if (['minAmount', 'maxAmount', 'refillMinQuantity', 'refillMaxQuantityPercent', 'warrantyDateDuration'].includes(key) && value !== '') {
            const isNotProperNumber = isNaN(value);
            if (isNotProperNumber) {
                return;
            }
        }

        setFormState(prevState => ({
            ...prevState,
            [key]: value
        }));

        if (key === 'ratePercent' || key === 'fixedPrice') {
            const ratePercentStr = key === 'ratePercent' ? value : formState.ratePercent;
            const fixedPriceStr = key === 'fixedPrice' ? value : formState.fixedPrice;

            const hasRatePercent = ratePercentStr !== '' && !isNaN(parseFloat(ratePercentStr));
            const hasFixedPrice = fixedPriceStr !== '' && !isNaN(parseFloat(fixedPriceStr));

            // If neither is valid, clear convertedAmount
            if (!hasRatePercent && !hasFixedPrice) {
                setFormState(prevState => ({
                    ...prevState,
                    convertedAmount: ''
                }));
                return;
            }

            // Always call conversion with the best available values
            calculateAndSetConvertedAmount(hasRatePercent ? ratePercentStr : '', hasFixedPrice ? fixedPriceStr : '');
            return;
        }

        if (key === 'providerId') {
            setServiceProviderServiceOptions([]);
            setSelectedServiceProviderService({});
            const provider = providers.find(provider => provider.id === value);
            setSelectedProvider(provider || {});
            fetchProviderServices(value);
        }

        if (key === 'refillProviderId') {
            setRefillProviderServiceOptions([]);
            setSelectedRefillProviderService({});
            fetchRefillProviderServices(value);
        }

        if (key === 'providerServiceId') {
            handleAssignService(value);
        }

        if (key === 'refillType') {
            if (value === 'provider') {
                setFormState(prevState => ({
                    ...prevState,
                    [key]: value,
                    refillProviderId: prevState.providerId,
                    refillProviderServiceId: prevState.providerServiceId
                }));
                setRefillProviderServiceOptions([]);
                setSelectedRefillProviderService({});
                fetchRefillProviderServices(value);
            } else if (value === 'place_order') {
                setFormState(prevState => ({
                    ...prevState,
                    [key]: value,
                    refillProviderId: 0,
                    refillProviderServiceId: 0
                }));
                setRefillProviderServiceOptions([]);
                setSelectedRefillProviderService({});
            }
        }
    };

    const onClose = () => {
        handleClose();
        setTimeout(() => {
            handleResetState();
        }, 500);
    };

    const handleCreate = () => {
        withReactContent(Swal)
            .fire({
                html: (
                    <div className='text-white'>
                        <p className='text-base font-bold leading-normal text-white-dark text-center capitalize'>กรุณายืนยันการเพิ่มบริการ</p>
                    </div>
                ),
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก',
                showCancelButton: true,
                padding: '2em',
                reverseButtons: true,
                customClass: {
                    popup: 'sweet-alerts',
                    cancelButton: 'btn bg-gray-300 text-black text-center shadow hover:opacity-60 w-auto border-none',
                    confirmButton: 'btn bg-clink-primary text-white text-center shadow hover:opacity-60 w-auto'
                },
                allowOutsideClick: false
            })
            .then(({ isConfirmed }) => {
                if (isConfirmed) {
                    setIsSubmitting(true);

                    const formData = new FormData();
                    formData.append('providerServiceId', formState.providerServiceId.toString());
                    formData.append('externalServiceId', formState.externalServiceId);
                    if (formState.serviceCategoryId) {
                        formData.append('serviceCategoryId', formState.serviceCategoryId.toString());
                    }
                    formData.append('name', formState.name);
                    formData.append('description', formState.description);
                    if (formState.fixedPrice && formState.fixedPrice !== '' && !isNaN(parseFloat(formState.fixedPrice))) {
                        formData.append('fixedPrice', formState.fixedPrice);
                    } else {
                        formData.append('fixedPrice', '0');
                    }
                    if (formState.ratePercent && formState.ratePercent !== '' && !isNaN(parseFloat(formState.ratePercent))) {
                        formData.append('ratePercent', formState.ratePercent);
                    } else {
                        formData.append('ratePercent', '0');
                    }
                    formData.append('syncRateEnabled', formState.syncRateEnabled.toString());
                    formData.append('finalizePriceWithCost', formState.finalizePriceWithCost.toString());
                    formData.append('minAmount', formState.minAmount.toString());
                    formData.append('maxAmount', formState.maxAmount.toString());
                    formData.append('dripfeed', formState.dripfeed.toString());
                    formData.append('cancel', formState.cancel.toString());
                    formData.append('warranty', formState.warranty.toString());
                    // if (formState.warranty) {
                    //     formData.append('warrantyDateDuration', formState.warrantyDateDuration.toString());
                    //     formData.append('warrantyQuality', formState.warrantyQuality);
                    // } else {
                    //     formData.append('warrantyDateDuration', '0');
                    //     formData.append('warrantyQuality', '');
                    // }
                    formData.append('refill', formState.refill.toString());
                    if (formState.refill) {
                        formData.append('refillType', formState.refillType);
                        formData.append('refillProviderServiceId', formState.refillProviderServiceId.toString());
                        formData.append('refillMinQuantity', formState.refillMinQuantity.toString());
                        formData.append('refillMaxQuantityPercent', formState.refillMaxQuantityPercent.toString());
                        formData.append('refillDays', formState.refillDays.toString());
                    }
                    formData.append('category', formState.category ?? '');
                    formData.append('denyLinkDuplicates', formState.denyLinkDuplicates.toString());
                    formData.append('isActive', formState.isActive.toString());
                    formData.append('type', formState.type.toString());

                    create(formData)
                        .then(response => {
                            if (response.success) {
                                withReactContent(Swal).fire({
                                    icon: 'success',
                                    title: 'เพิ่มบริการสำเร็จ',
                                    showConfirmButton: false,
                                    timer: 1500,
                                    padding: '2em',
                                    customClass: {
                                        popup: 'sweet-alerts',
                                        actions: 'flex flex-row-reverse',
                                        cancelButton: 'btn bg-gray-300 text-black text-center shadow hover:opacity-60 w-auto border-none',
                                        confirmButton: 'btn bg-clink-primary text-white text-center shadow hover:opacity-60 w-auto'
                                    },
                                    allowOutsideClick: false
                                });
                                handleAfterSubmit();
                                onClose();
                            } else {
                                withReactContent(Swal)
                                    .fire({
                                        icon: 'error',
                                        title: 'เพิ่มบริการไม่สำเร็จ',
                                        text: response.data?.message ?? 'An error occurred',
                                        showConfirmButton: true,
                                        confirmButtonText: 'ปิด',
                                        padding: '2em',
                                        customClass: {
                                            popup: 'sweet-alerts',
                                            actions: 'flex flex-row-reverse',
                                            cancelButton: 'btn bg-gray-300 text-black text-center shadow hover:opacity-60 w-auto border-none',
                                            confirmButton: 'btn bg-clink-primary text-white text-center shadow hover:opacity-60 w-auto'
                                        },
                                        allowOutsideClick: false
                                    })
                                    .then(result => {
                                        if (result.isConfirmed) {
                                            setIsHideToConfirm(false);
                                        }
                                    });
                            }
                        })
                        .finally(() => {
                            setIsSubmitting(false);
                        });
                } else {
                    setIsHideToConfirm(false);
                }
            });
    };

    const handleUpdate = () => {
        withReactContent(Swal)
            .fire({
                html: (
                    <div className='text-white'>
                        <p className='text-base font-bold leading-normal text-white-dark text-center capitalize'>กรุณายืนยันการแก้ไขบริการ</p>
                    </div>
                ),
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก',
                showCancelButton: true,
                padding: '2em',
                reverseButtons: true,
                customClass: {
                    popup: 'sweet-alerts',
                    cancelButton: 'btn bg-gray-300 text-black text-center shadow hover:opacity-60 w-auto border-none',
                    confirmButton: 'btn bg-clink-primary text-white text-center shadow hover:opacity-60 w-auto'
                },
                allowOutsideClick: false
            })
            .then(({ isConfirmed }) => {
                if (isConfirmed) {
                    setIsSubmitting(true);

                    console.log('formState', formState);
                    const formData = new FormData();
                    formData.append('providerServiceId', formState.providerServiceId.toString());
                    formData.append('externalServiceId', formState.externalServiceId);
                    if (formState.serviceCategoryId) {
                        formData.append('serviceCategoryId', formState.serviceCategoryId.toString());
                    }
                    formData.append('name', formState.name);
                    formData.append('description', formState.description);
                    if (formState.fixedPrice && formState.fixedPrice !== '' && !isNaN(parseFloat(formState.fixedPrice))) {
                        formData.append('fixedPrice', formState.fixedPrice);
                    } else {
                        formData.append('fixedPrice', '0');
                    }
                    if (formState.ratePercent && formState.ratePercent !== '' && !isNaN(parseFloat(formState.ratePercent))) {
                        formData.append('ratePercent', formState.ratePercent);
                    } else {
                        formData.append('ratePercent', '0');
                    }
                    formData.append('syncRateEnabled', formState.syncRateEnabled.toString());
                    formData.append('finalizePriceWithCost', formState.finalizePriceWithCost.toString());
                    formData.append('minAmount', formState.minAmount.toString());
                    formData.append('maxAmount', formState.maxAmount.toString());
                    formData.append('dripfeed', formState.dripfeed.toString());
                    formData.append('cancel', formState.cancel.toString());
                    formData.append('warranty', formState.warranty.toString());
                    // if (formState.warranty) {
                    //     if(formState.warrantyDateDuration !== '' && formState.warrantyDateDuration)
                    //     formData.append('warrantyDateDuration', formState.warrantyDateDuration.toString());
                    //     formData.append('warrantyQuality', formState.warrantyQuality);
                    // } else {
                    //     formData.append('warrantyDateDuration', '0');
                    //     formData.append('warrantyQuality', '');
                    // }
                    formData.append('refill', formState.refill.toString());
                    if (formState.refill) {
                        formData.append('refillType', formState.refillType);
                        formData.append('refillProviderServiceId', formState.refillProviderServiceId.toString());
                        formData.append('refillMinQuantity', formState.refillMinQuantity.toString());
                        formData.append('refillMaxQuantityPercent', formState.refillMaxQuantityPercent.toString());
                        formData.append('refillDays', formState.refillDays.toString());
                    }
                    formData.append('category', formState.category ?? '');
                    formData.append('denyLinkDuplicates', formState.denyLinkDuplicates.toString());
                    formData.append('isActive', formState.isActive.toString());
                    formData.append('type', formState.type.toString());

                    update(selectedId, formData)
                        .then(response => {
                            if (response.success) {
                                withReactContent(Swal).fire({
                                    icon: 'success',
                                    title: 'แก้ไขบริการสำเร็จ',
                                    showConfirmButton: false,
                                    timer: 1500,
                                    padding: '2em',
                                    customClass: {
                                        popup: 'sweet-alerts',
                                        actions: 'flex flex-row-reverse',
                                        cancelButton: 'btn bg-gray-300 text-black text-center shadow hover:opacity-60 w-auto border-none',
                                        confirmButton: 'btn bg-clink-primary text-white text-center shadow hover:opacity-60 w-auto'
                                    },
                                    allowOutsideClick: false
                                });
                                handleAfterSubmit();
                                onClose();
                            } else {
                                withReactContent(Swal)
                                    .fire({
                                        icon: 'error',
                                        title: 'แก้ไขบริการไม่สำเร็จ',
                                        text: response.data?.message ?? 'An error occurred',
                                        showConfirmButton: true,
                                        confirmButtonText: 'ปิด',
                                        padding: '2em',
                                        customClass: {
                                            popup: 'sweet-alerts',
                                            actions: 'flex flex-row-reverse',
                                            cancelButton: 'btn bg-gray-300 text-black text-center shadow hover:opacity-60 w-auto border-none',
                                            confirmButton: 'btn bg-clink-primary text-white text-center shadow hover:opacity-60 w-auto'
                                        },
                                        allowOutsideClick: false
                                    })
                                    .then(result => {
                                        if (result.isConfirmed) {
                                            setIsHideToConfirm(false);
                                        }
                                    });
                            }
                        })
                        .finally(() => {
                            setIsSubmitting(false);
                        });
                } else {
                    setIsHideToConfirm(false);
                }
            });
    };

    const onSubmit = () => {
        validationSchema
            .validate(formState, { abortEarly: false })
            .then(() => {
                setFormErrors({});
                setIsHideToConfirm(true);

                if (formType === 'create') {
                    handleCreate();
                } else if (formType === 'edit') {
                    handleUpdate();
                }
            })
            .catch(err => {
                const errors: { [key: string]: string } = {};
                err.inner.forEach((error: any) => {
                    if (error.path) {
                        errors[error.path] = error.message;
                    }
                });
                setFormErrors(errors);
            });
    };

    useEffect(() => {
        if (isOpen) {
            fetchMasterData();
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            handleResetState();
        }
    }, [isOpen]);

    return {
        serviceCategoryOptions,
        serviceTypeOptions: ServiceTypeOptions,
        providerOptions,
        denyLinkDuplicatesOptions,
        refillTypeOptions,
        serviceProviderServiceOptions,
        refillProviderServiceOptions,
        dripFeedOptions,
        cancelOptions,
        warrantyQualityOptions,
        isHideToConfirm,
        isOpen,
        isSubmitting,
        isLoadingProviderServices,
        isLoadingRefillProviderServices,
        formType,
        formState,
        formErrors,
        selectedServiceProviderService,
        selectedRefillProviderService,
        onChangeFormState,
        onClose,
        onSubmit
    };
};

export default ViewModel;
