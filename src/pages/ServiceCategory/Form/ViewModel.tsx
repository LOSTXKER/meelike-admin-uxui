import { useState, useEffect } from 'react';
import { useProfileStore } from '@/store/profile';
// import { useUserStore } from '@/store/user';
import { useServiceCategoryStore } from '@/store/service-category';
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

interface FormState {
    name: string;
    orderPosition?: string;
    icon: string | File;
    iconUrl?: string;
}

const INITIAL_FORM_STATE: FormState = {
    name: '',
    orderPosition: '0',
    icon: '',
    iconUrl: '',
};

const ViewModel = (props: Props) => {
    const { formType, isOpen, selectedId, handleClose, handleAfterSubmit } = props;
    const { profile } = useProfileStore(
        useShallow((state) => ({
            profile: state.data,
        }))
    );
    const {
        selected: serviceCategoryData,
        create,
        update,
        getOne,
    } = useServiceCategoryStore(
        useShallow((state) => ({
            selected: state.selected,
            create: state.create,
            update: state.update,
            getOne: state.getOne,
        }))
    );

    const [isHideToConfirm, setIsHideToConfirm] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    const isSelf = profile?.id === serviceCategoryData?.id && formType === 'edit';

    const validationSchemaCreate = Yup.object().shape({
        name: Yup.string().required('ชื่อหมวดหมู่จำเป็นต้องกรอก'),
        orderPosition: Yup.string().required('ตำแหน่งการจัดเรียงจำเป็นต้องกรอก'),
        icon: Yup.mixed().required('ไอคอนจำเป็นต้องอัพโหลด'),
    });

    const validateSchemaEdit = Yup.object().shape({
        name: Yup.string().required('ชื่อหมวดหมู่จำเป็นต้องกรอก'),
        orderPosition: Yup.string().required('ตำแหน่งการจัดเรียงจำเป็นต้องกรอก'),
        icon: Yup.mixed(),
    });

    const resetState = () => {
        setFormState(INITIAL_FORM_STATE);
        setIsHideToConfirm(false);
    };

    const handleInitState = () => {
        if (isOpen === true && formType === 'edit') {
            setFormState({
                name: serviceCategoryData?.name ?? '',
                orderPosition: serviceCategoryData?.orderPosition?.toString() ?? '0',
                icon: serviceCategoryData?.icon ?? '',
                iconUrl: serviceCategoryData?.iconUrl ?? '',
            });
        }
    };

    const handleResetState = () => {
        setFormState(INITIAL_FORM_STATE);
        setFormErrors({});
        setIsSubmitting(false);
    };

    const onChangeFormState = (key: string, value: any) => {
        if (key === 'icon' && value instanceof File) {
            // When uploading a new file, clear the iconUrl
            setFormState((prevState) => ({
                ...prevState,
                [key]: value,
                iconUrl: '', // Clear iconUrl when a new file is uploaded
            }));
        } else {
            setFormState((prevState) => ({
                ...prevState,
                [key]: value,
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
                            <div className="text-white">
                                <p className="text-base font-bold leading-normal text-white-dark text-center capitalize">คุณยืนยันที่จะสร้างหมวดหมู่บริการใหม่ใช่หรือไม่</p>
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
                            confirmButton: 'btn bg-clink-primary text-white text-center shadow hover:opacity-60 w-auto',
                        },
                        allowOutsideClick: false,
                    })
                    .then(({ isConfirmed }) => {
                        if (isConfirmed) {
                            setIsSubmitting(true);

                            const formData = new FormData();

                            // Add name to FormData
                            formData.append('name', formState.name);
                            // Add orderPosition to FormData
                            formData.append('orderPosition', formState.orderPosition || '0');

                            // Add file to FormData if it's a File object
                            if (formState.icon instanceof File) {
                                formData.append('icon', formState.icon);
                            }

                            create(formData)
                                .then((response) => {
                                    if (response.success) {
                                        withReactContent(Swal).fire({
                                            icon: 'success',
                                            title: 'สำเร็จ',
                                            showConfirmButton: false,
                                            timer: 1500,
                                            padding: '2em',
                                            customClass: {
                                                popup: 'sweet-alerts',
                                                actions: 'flex flex-row-reverse',
                                                cancelButton: 'btn bg-gray-300 text-black text-center shadow hover:opacity-60 w-auto border-none',
                                                confirmButton: 'btn bg-clink-primary text-white text-center shadow hover:opacity-60 w-auto',
                                            },
                                            allowOutsideClick: false,
                                        });
                                        handleAfterSubmit();
                                        onClose();
                                    } else {
                                        withReactContent(Swal)
                                            .fire({
                                                icon: 'error',
                                                title: 'ข้อผิดพลาด',
                                                text: response.data?.message ?? 'เกิดข้อผิดพลาด',
                                                showConfirmButton: true,
                                                confirmButtonText: 'ปิด',
                                                padding: '2em',
                                                customClass: {
                                                    popup: 'sweet-alerts',
                                                    actions: 'flex flex-row-reverse',
                                                    cancelButton: 'btn bg-gray-300 text-black text-center shadow hover:opacity-60 w-auto border-none',
                                                    confirmButton: 'btn bg-clink-primary text-white text-center shadow hover:opacity-60 w-auto',
                                                },
                                                allowOutsideClick: false,
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
            .catch((error) => {
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
                            <div className="text-white">
                                <p className="text-base font-bold leading-normal text-white-dark text-center capitalize">กรุณายืนยันการอัพเดทหมวดหมู่บริการ</p>
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
                            confirmButton: 'btn bg-clink-primary text-white text-center shadow hover:opacity-60 w-auto',
                        },
                        allowOutsideClick: false,
                    })
                    .then(({ isConfirmed }) => {
                        if (isConfirmed) {
                            setIsSubmitting(true);

                            const formData = new FormData();

                            // Add name to FormData
                            formData.append('name', formState.name);
                            // Add orderPosition to FormData
                            formData.append('orderPosition', formState.orderPosition || '0');

                            // Add file to FormData if it's a File object
                            if (formState.icon instanceof File) {
                                formData.append('icon', formState.icon);
                            }

                            update(selectedId, formData)
                                .then((response) => {
                                    if (response.success) {
                                        withReactContent(Swal).fire({
                                            icon: 'success',
                                            title: 'สำเร็จ',
                                            showConfirmButton: false,
                                            timer: 1500,
                                            padding: '2em',
                                            customClass: {
                                                popup: 'sweet-alerts',
                                                actions: 'flex flex-row-reverse',
                                                cancelButton: 'btn bg-gray-300 text-black text-center shadow hover:opacity-60 w-auto border-none',
                                                confirmButton: 'btn bg-clink-primary text-white text-center shadow hover:opacity-60 w-auto',
                                            },
                                            allowOutsideClick: false,
                                        });
                                        handleAfterSubmit();
                                        onClose();
                                    } else {
                                        withReactContent(Swal)
                                            .fire({
                                                icon: 'error',
                                                title: 'ข้อผิดพลาด',
                                                text: response.data?.message ?? 'เกิดข้อผิดพลาด',
                                                showConfirmButton: true,
                                                confirmButtonText: 'ปิด',
                                                padding: '2em',
                                                customClass: {
                                                    popup: 'sweet-alerts',
                                                    actions: 'flex flex-row-reverse',
                                                    cancelButton: 'btn bg-gray-300 text-black text-center shadow hover:opacity-60 w-auto border-none',
                                                    confirmButton: 'btn bg-clink-primary text-white text-center shadow hover:opacity-60 w-auto',
                                                },
                                                allowOutsideClick: false,
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
            .catch((error) => {
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
        if (isOpen && formType === 'edit' && selectedId) {
            getOne(selectedId);
        }
    }, [isOpen, formType, selectedId]);

    useEffect(() => {
        handleInitState();
    }, [isOpen, serviceCategoryData]);

    useEffect(() => {
        if (!isOpen) {
            handleResetState();
        }
    }, [isOpen]);

    return {
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
        onSubmit,
    };
};

export default ViewModel;
