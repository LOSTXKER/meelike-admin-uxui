import { useState, useEffect } from 'react';
import { useTopupBonusConfigStore } from '@/store/topup-bonus-config';
import { useShallow } from 'zustand/react/shallow';
import withReactContent from 'sweetalert2-react-content';
import IconTrueMoney from '@/components/Icon/IconTrueMoney';
import IconPromptpay from '@/components/Icon/IconPromptpay';
import IconVisaMastercard from '@/components/Icon/IconVisaMastercard';
import IconPaySolutions from '@/components/Icon/IconPaySolutions';
import Swal from 'sweetalert2';
import * as Yup from 'yup';

export interface Props {
    isOpen: boolean;
    handleClose: () => void;
    handleAfterSubmit: () => void;
}

const INITIAL_FORM_STATE = {
    bonusPercentage: '',
    from: '',
    enabled: true
};

const ViewModel = (props: Props) => {
    const { isOpen, handleClose, handleAfterSubmit } = props;
    const { selected, update } = useTopupBonusConfigStore(
        useShallow(state => ({
            selected: state.selected,
            update: state.update
        }))
    );

    const [isHideToConfirm, setIsHideToConfirm] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [formState, setFormState] = useState<typeof INITIAL_FORM_STATE>(INITIAL_FORM_STATE);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    const validationSchema = Yup.object().shape({
        bonusPercentage: Yup.number()
            .transform((value, originalValue) => (originalValue === '' ? NaN : value))
            .not([NaN], 'กรุณากรอกเปอร์เซ็นต์โบนัส')
            .required('กรุณากรอกเปอร์เซ็นต์โบนัส'),
        from: Yup.string().required('กรุณากรอกจำนวนเงินขั้นต่ำ'),
        enabled: Yup.boolean()
    });

    const paymentMethod = selected?.paymentMethod ?? '';
    const paymentMethodTitle = selected?.paymentMethodTitle ?? '';

    const handleSetInitState = () => {
        if (isOpen) {
            console.log('selected', selected);
            setFormState({
                bonusPercentage: selected?.bonusPercentage || '',
                from: selected?.from || '',
                enabled: selected?.enabled === undefined ? true : selected.enabled
            });
        }
    };

    const generateIcon = (paymentMethod: string) => {
        switch (paymentMethod.toLowerCase()) {
            case 'truemoney':
                return <IconTrueMoney className='w-24 h-16' />;
            case 'credit_card':
                return <IconVisaMastercard className='w-24 h-16' />;
            case 'promptpay':
                return <IconPromptpay className='w-24 h-16' />;
            case 'paysolutions':
                return <IconPaySolutions className='w-24 h-16' />;
            default:
                return null;
        }
    };

    const handleResetState = () => {
        setFormState(INITIAL_FORM_STATE);
        setFormErrors({});
        setIsSubmitting(false);
    };

    const onChangeFormState = (key: string, value: any) => {
        if (key === 'amount') {
            const isNumber = !isNaN(Number(value)) || value === '';
            if (isNumber) {
                setFormState(prevState => ({
                    ...prevState,
                    [key]: value
                }));
            }
        } else {
            setFormState(prevState => ({
                ...prevState,
                [key]: value
            }));
        }
    };

    const onClose = () => {
        handleClose();
    };

    const handleSubmit = () => {
        setIsHideToConfirm(true);

        withReactContent(Swal)
            .fire({
                html: (
                    <div className='text-white'>
                        <p className='text-base font-bold leading-normal text-white-dark text-center capitalize'>ยืนยันการแก้ไขข้อมูล</p>
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
                    formData.append('bonusPercentage', formState.bonusPercentage.toString());
                    formData.append('from', formState.from);
                    formData.append('enabled', formState.enabled.toString());
                    update(selected?.id, formData)
                        .then(response => {
                            if (response.success) {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'แก้ไขข้อมูลสำเร็จ',
                                    text: 'ข้อมูลโบนัสเติมเงินถูกแก้ไขเรียบร้อยแล้ว',
                                    confirmButtonText: 'ปิด',
                                    allowOutsideClick: false
                                }).then(() => {
                                    setIsHideToConfirm(false);
                                    handleAfterSubmit();
                                    onClose();
                                });
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'เกิดข้อผิดพลาด',
                                    text: response.data?.message || 'ไม่สามารถเติมเงินได้',
                                    confirmButtonText: 'ปิด',
                                    allowOutsideClick: false
                                }).then(() => {
                                    setIsHideToConfirm(false);
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
                handleSubmit();
            })
            .catch(err => {
                const errors: { [key: string]: string } = {};
                err.inner.forEach((error: Yup.ValidationError) => {
                    if (error.path) {
                        errors[error.path] = error.message;
                    }
                });
                setFormErrors(errors);
            });
    };

    useEffect(() => {
        handleSetInitState();
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            handleResetState();
        }
    }, [isOpen]);

    return {
        isHideToConfirm,
        isOpen,
        isSubmitting,
        paymentMethod,
        paymentMethodTitle,
        formState,
        formErrors,
        generateIcon,
        onChangeFormState,
        onClose,
        onSubmit
    };
};

export default ViewModel;
