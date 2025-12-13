import { useState, useEffect } from 'react';
import { useUsersStore } from '@/store/users';
import { useWalletStore } from '@/store/wallet';
import { useShallow } from 'zustand/react/shallow';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import * as Yup from 'yup';

export interface Props {
    isOpen: boolean;
    handleClose: () => void;
    handleAfterSubmit: () => void;
}

const INITIAL_FORM_STATE = {
    userId: '',
    amount: '',
    method: '',
    note: '',
    isSendToEtax: true
};

const ViewModel = (props: Props) => {
    const { isOpen, handleClose, handleAfterSubmit } = props;
    const { users, getUsers } = useUsersStore(
        useShallow(state => ({
            users: state.allData,
            getUsers: state.getAllData
        }))
    );
    const { topup } = useWalletStore(
        useShallow(state => ({
            topup: state.topup
        }))
    );

    const [isHideToConfirm, setIsHideToConfirm] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [formState, setFormState] = useState<typeof INITIAL_FORM_STATE>(INITIAL_FORM_STATE);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    const userOptions = users.map(user => ({
        label: `${user?.name} (${user?.email})`,
        value: user.id
    }));

    const validationSchema = Yup.object().shape({
        userId: Yup.string().required('กรุณาเลือกผู้ใช้'),
        amount: Yup.number()
            .transform((value, originalValue) => (originalValue === '' ? NaN : value))
            .not([NaN], 'กรุณากรอกจำนวนเงินที่ต้องการเติม')
            .required('กรุณากรอกจำนวนเงินที่ต้องการเติม'),
        method: Yup.string().required('กรุณาเลือกวิธีการเติมเงิน'),
        note: Yup.string().max(255, 'หมายเหตุต้องไม่เกิน 255 ตัวอักษร')
    });

    const topupMethodOptions = [
        {
            label: 'True Money',
            value: 'truemoney'
        },
        {
            label: 'PromptPay',
            value: 'promptpay'
        },
        {
            label: 'Pay Solutions',
            value: 'paysolutions'
        },
        {
            label: 'Bonus',
            value: 'bonus'
        }
    ];

    const handleResetState = () => {
        setFormState(INITIAL_FORM_STATE);
        setFormErrors({});
        setIsSubmitting(false);
    };

    const fetchData = () => {
        if (isOpen) {
            getUsers();
        }
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
                        <p className='text-base font-bold leading-normal text-white-dark text-center capitalize'>ยืนยันการเติมเงิน</p>
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

                    withReactContent(Swal).fire({
                        html: (
                            <div className='text-white'>
                                <p className='text-base font-bold leading-normal text-white-dark text-center capitalize'>กำลังเติมเงิน...</p>
                            </div>
                        ),
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });

                    const formData = new FormData();
                    formData.append('userId', formState.userId);
                    formData.append('amount', formState.amount);
                    formData.append('method', formState.method);
                    formData.append('note', formState.note);
                    formData.append('isSendToEtax', formState.isSendToEtax.toString());
                    topup(formData)
                        .then(response => {
                            Swal.close();

                            if (response.success) {
                                handleAfterSubmit();
                                Swal.fire({
                                    icon: 'success',
                                    title: 'เติมเงินสำเร็จ',
                                    text: 'การเติมเงินของคุณสำเร็จแล้ว',
                                    confirmButtonText: 'ปิด',
                                    allowOutsideClick: false
                                }).then(() => {
                                    setIsHideToConfirm(false);
                                    onClose();
                                });
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'เกิดข้อผิดพลาด',
                                    text: response.data?.message || 'ไม่สามารถเติมเงินได้',
                                    confirmButtonText: 'ตกลง',
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
        fetchData();
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            handleResetState();
        }
    }, [isOpen]);

    return {
        topupMethodOptions,
        userOptions,
        isHideToConfirm,
        isOpen,
        isSubmitting,
        formState,
        formErrors,
        onChangeFormState,
        onClose,
        onSubmit
    };
};

export default ViewModel;
