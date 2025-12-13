import { useState, useEffect } from 'react';
import { useProfileStore } from '@/store/profile';
import { useUserStore } from '@/store/admin-user';
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
    name: '',
    password: '',
    email: '',
    status: 'A',
    role: 'SUPER_ADMIN'
};

const ViewModel = (props: Props) => {
    const { formType, isOpen, selectedId, handleClose, handleAfterSubmit } = props;
    const { profile } = useProfileStore(
        useShallow(state => ({
            profile: state.data
        }))
    );
    const { data, create, update } = useUserStore(
        useShallow(state => ({
            data: state.selected,
            create: state.create,
            update: state.update
        }))
    );

    const [isHideToConfirm, setIsHideToConfirm] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [formState, setFormState] = useState<typeof INITIAL_FORM_STATE>(INITIAL_FORM_STATE);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    const isSelf = profile?.id === data?.id && formType === 'edit';

    const roleOptions = [
        { label: 'Super Admin', value: 'SUPER_ADMIN' },
        { label: 'Admin', value: 'ADMIN' }
    ];

    const validationSchemaCreate = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Email is invalid').required('Email is required'),
        password: Yup.string().required('Password is required'),
        status: Yup.string().required('Status is required'),
        role: Yup.string().required('Role is required')
    });

    const validateSchemaEdit = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Email is invalid').required('Email is required'),
        password: Yup.string().required('Password is required'),
        status: Yup.string().required('Status is required'),
        role: Yup.string().required('Role is required')
    });

    const resetState = () => {
        setFormState(INITIAL_FORM_STATE);
        setIsHideToConfirm(false);
    };

    const handleInitState = () => {
        if (isOpen === true && formType === 'edit') {
            setFormState({
                name: data?.name ?? '',
                email: data?.email ?? '',
                status: data?.status ?? 'ACTIVE',
                password: '',
                role: data?.role ?? ''
            });
        }
    };

    const handleResetState = () => {
        setFormState(INITIAL_FORM_STATE);
        setFormErrors({});
        setIsSubmitting(false);
    };

    const onChangeFormState = (key: string, value: any) => {
        setFormState(prevState => ({
            ...prevState,
            [key]: value
        }));
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
                                <p className='text-base font-bold leading-normal text-white-dark text-center capitalize'>กรุณายืนยันการเพิ่มผู้ใช้งาน</p>
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

                            Object.keys(formState).forEach(key => {
                                // @ts-ignore
                                formData.append(key, formState[key]);
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
                                            .then(({ isConfimred }) => {
                                                if (isConfimred) {
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
                                <p className='text-base font-bold leading-normal text-white-dark text-center capitalize'>กรุณายืนยันการแก้ไขข้อมูลผู้ใช้งาน</p>
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

                            Object.keys(formState).forEach(key => {
                                if (key === 'password') {
                                    if (formState[key] !== '') {
                                        // @ts-ignore
                                        formData.append(key, formState[key]);
                                    }
                                } else {
                                    // @ts-ignore
                                    formData.append(key, formState[key]);
                                }
                            });

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
                                            .then(({ isConfimred }) => {
                                                if (isConfimred) {
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
        handleInitState();
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            handleResetState();
        }
    }, [isOpen]);

    return {
        roleOptions,
        isHideToConfirm,
        isSelf,
        isOpen,
        isSubmitting,
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
