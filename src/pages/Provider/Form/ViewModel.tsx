import { useState, useEffect } from 'react';
import { useProfileStore } from '@/store/profile';
// import { useUserStore } from '@/store/user';
import { useExchangeRateStore } from '@/store/exchange-rate';
import { useProviderStore } from '@/store/provider';
import { useShallow } from 'zustand/react/shallow';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import * as Yup from 'yup';

export interface Props {
    formType: 'create' | 'edit';
    selectedId: string;
    isOpen: boolean;
    handleClose: () => void;
    handleAfterSubmit: () => void;
}

const INITIAL_FORM_STATE = {
    aliasName: '',
    apiUrl: '',
    apiKey: '',
    currency: 'USD',
    isLowBalanceAlert: false,
    lowBalanceThreshold: 0
};

const ViewModel = (props: Props) => {
    const { formType, isOpen, selectedId, handleClose, handleAfterSubmit } = props;
    const { profile } = useProfileStore(
        useShallow(state => ({
            profile: state.data
        }))
    );
    const {
        selected: providerData,
        setProviderData,
        create,
        update,
        getOne
    } = useProviderStore(
        useShallow(state => ({
            selected: state.selected,
            setProviderData: state.setSelected,
            create: state.create,
            update: state.update,
            getOne: state.getOne
        }))
    );
    const { currencies, getAvailableCurrencies } = useExchangeRateStore(
        useShallow(state => ({
            currencies: state.currencies,
            getAvailableCurrencies: state.getAvailableCurrencies
        }))
    );

    const [isHideToConfirm, setIsHideToConfirm] = useState<boolean>(false);
    const [isEditApiKey, setIsEditApiKey] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [formState, setFormState] = useState<typeof INITIAL_FORM_STATE>(INITIAL_FORM_STATE);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    const isSelf = profile?.id === providerData?.id && formType === 'edit';

    const validationSchemaCreate = Yup.object().shape({
        // aliasName: Yup.string().required('Alias name is required'),
        apiUrl: Yup.string().url('Invalid URL format').required('API URL is required'),
        apiKey: Yup.string().required('API Key is required'),
        // currency: Yup.string().required('Currency is required'),
        isLowBalanceAlert: Yup.boolean(),
        lowBalanceThreshold: Yup.number().when('isLowBalanceAlert', {
            is: true,
            then: schema => schema.required('Low balance threshold is required when alert is enabled').min(0, 'Threshold must be greater than or equal to 0')
        })
    });

    const validateSchemaEdit = Yup.object().shape({
        // aliasName: Yup.string().required('Alias name is required'),
        apiUrl: Yup.string().url('Invalid URL format').required('API URL is required'),
        apiKey: Yup.string().required('API Key is required'),
        isLowBalanceAlert: Yup.boolean(),
        lowBalanceThreshold: Yup.number().when('isLowBalanceAlert', {
            is: true,
            then: schema => schema.required('Low balance threshold is required when alert is enabled').min(0, 'Threshold must be greater than or equal to 0')
        })
    });

    const currencyOptions = currencies.map(currency => ({
        value: currency,
        label: currency
    }));

    const resetState = () => {
        setProviderData(null);
        setFormState(INITIAL_FORM_STATE);
        setFormErrors({});
        setIsHideToConfirm(false);
    };

    const handleInitState = () => {
        if (isOpen === true && formType === 'edit') {
            setFormState({
                aliasName: providerData?.aliasName ?? '',
                apiUrl: providerData?.apiUrl ?? '',
                apiKey: providerData?.apiKey ?? '',
                currency: providerData?.currency ?? 'USD',
                isLowBalanceAlert: providerData?.isLowBalanceAlert ?? false,
                lowBalanceThreshold: providerData?.isLowBalanceAlert ? providerData?.lowBalanceThreshold ?? 0 : 0
            });
        }
    };

    const handleResetState = () => {
        setFormState(INITIAL_FORM_STATE);
        setFormErrors({});
        setIsSubmitting(false);
    };

    const onChangeFormState = (key: string, value: any) => {
        if (key === 'isLowBalanceAlert') {
            setFormState(prevState => ({
                ...prevState,
                [key]: value,
                lowBalanceThreshold: value ? prevState.lowBalanceThreshold : 0
            }));
        } else {
            setFormState(prevState => ({
                ...prevState,
                [key]: value
            }));
        }
    };

    const onClose = () => {
        handleClose();
        setTimeout(() => {
            resetState();
        }, 500);
    };

    const handleSubmitCreate = () => {
        validationSchemaCreate
            .validate(formState, { abortEarly: false })
            .then(() => {
                setFormErrors({});

                setIsHideToConfirm(true);

                withReactContent(Swal)
                    .fire({
                        html: (
                            <div className='text-white'>
                                <p className='text-base font-bold leading-normal text-white-dark text-center capitalize'>Please confirm to create new provider</p>
                            </div>
                        ),
                        confirmButtonText: 'Confirm',
                        cancelButtonText: 'Cancel',
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

                            Object.keys(formState).forEach(key => {
                                formData.append(key, formState[key as keyof typeof formState].toString());
                            });

                            create(formData)
                                .then(response => {
                                    if (response.success) {
                                        withReactContent(Swal).fire({
                                            icon: 'success',
                                            title: 'Successfully',
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
                                                title: 'Error',
                                                text: response.data?.message ?? 'An error occurred',
                                                showConfirmButton: true,
                                                confirmButtonText: 'Close',
                                                padding: '2em',
                                                customClass: {
                                                    popup: 'sweet-alerts',
                                                    actions: 'flex flex-row-reverse',
                                                    cancelButton: 'btn bg-gray-300 text-black text-center shadow hover:opacity-60 w-auto border-none',
                                                    confirmButton: 'btn bg-clink-primary text-white text-center shadow hover:opacity-60 w-auto'
                                                },
                                                allowOutsideClick: false
                                            })
                                            .then(({ isConfirmed }) => {
                                                if (isConfirmed) {
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
            })
            .catch(error => {
                const errors: {
                    [key: string]: string;
                } = {};
                error.inner.forEach((e: any) => {
                    errors[e.path] = e.message;
                });
                setFormErrors(errors as any);
                setIsSubmitting(false);
            });
    };

    const handleSubmitEdit = () => {
        validateSchemaEdit
            .validate(formState, { abortEarly: false })
            .then(() => {
                setFormErrors({});

                setIsHideToConfirm(true);

                withReactContent(Swal)
                    .fire({
                        html: (
                            <div className='text-white'>
                                <p className='text-base font-bold leading-normal text-white-dark text-center capitalize'>Please confirm the update for provider</p>
                            </div>
                        ),
                        confirmButtonText: 'Confirm',
                        cancelButtonText: 'Cancel',
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

                            // Only send required fields for update
                            formData.append('apiKey', formState.apiKey);
                            formData.append('aliasName', formState.aliasName);
                            formData.append('isLowBalanceAlert', formState.isLowBalanceAlert.toString());
                            formData.append('lowBalanceThreshold', formState.lowBalanceThreshold.toString());

                            update(selectedId, formData)
                                .then(response => {
                                    if (response.success) {
                                        withReactContent(Swal).fire({
                                            icon: 'success',
                                            title: 'Successfully',
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
                                                title: 'Error',
                                                text: response.data?.message ?? 'An error occurred',
                                                showConfirmButton: true,
                                                confirmButtonText: 'Close',
                                                padding: '2em',
                                                customClass: {
                                                    popup: 'sweet-alerts',
                                                    actions: 'flex flex-row-reverse',
                                                    cancelButton: 'btn bg-gray-300 text-black text-center shadow hover:opacity-60 w-auto border-none',
                                                    confirmButton: 'btn bg-clink-primary text-white text-center shadow hover:opacity-60 w-auto'
                                                },
                                                allowOutsideClick: false
                                            })
                                            .then(({ isConfirmed }) => {
                                                if (isConfirmed) {
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
            })
            .catch(error => {
                const errors: {
                    [key: string]: string;
                } = {};
                error.inner.forEach((e: any) => {
                    errors[e.path] = e.message;
                });
                setFormErrors(errors as any);
                setIsSubmitting(false);
            });
    };

    const onSubmit = () => {
        if (formType === 'create') {
            handleSubmitCreate();
        } else if (formType === 'edit') {
            handleSubmitEdit();
        }
    };

    useEffect(() => {
        if (isOpen) {
            getAvailableCurrencies();
        }

        if (isOpen && formType === 'edit' && selectedId) {
            getOne(selectedId);
        }
    }, [isOpen, formType, selectedId]);

    useEffect(() => {
        handleInitState();
    }, [isOpen, providerData]);

    useEffect(() => {
        if (!isOpen) {
            handleResetState();
        }
    }, [isOpen]);

    return {
        currencyOptions,
        isHideToConfirm,
        isSelf,
        isOpen,
        isSubmitting,
        isEditApiKey,
        setIsEditApiKey,
        showPassword,
        formType,
        formState,
        formErrors,
        setShowPassword,
        onChangeFormState,
        onClose,
        onSubmit
    };
};

export default ViewModel;
