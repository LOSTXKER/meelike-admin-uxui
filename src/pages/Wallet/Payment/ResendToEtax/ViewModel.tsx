import { useEffect, useState } from 'react';
import { useWalletStore } from '@/store/wallet';
import { useShallow } from 'zustand/react/shallow';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

export interface Props {
    isOpen: boolean;
    data: any;
    handleClose: () => void;
    handleAfterSubmit: () => void;
}

const ViewModel = (props: Props) => {
    const { isOpen, data, handleAfterSubmit, handleClose } = props;
    const { getUserBillingInfo, resendToEtax } = useWalletStore(
        useShallow(state => ({
            getUserBillingInfo: state.getUserBillingInfo,
            resendToEtax: state.resendToEtax
        }))
    );
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [userBillingInfo, setUserBillingInfo] = useState<any>({});

    const initFetch = () => {
        if (data?.id) {
            getUserBillingInfo(data.id).then(res => {
                if (res.success) {
                    setUserBillingInfo(res.data);
                }
            });
        }
    };

    const onClose = () => {
        if (isSubmitting) return;

        handleClose();
    };

    const onSubmit = () => {
        setIsSubmitting(true);
        resendToEtax(data.id)
            .then(res => {
                if (res.success) {
                    withReactContent(Swal).fire({
                        icon: 'success',
                        title: 'ส่งข้อมูลไปยัง e-Tax สำเร็จ',
                        confirmButtonText: 'ปิด'
                    });
                    handleAfterSubmit();
                } else {
                    withReactContent(Swal).fire({
                        icon: 'error',
                        title: 'เกิดข้อผิดพลาดในการส่งข้อมูลไปยัง e-Tax',
                        text: res.data?.message || 'กรุณาลองใหม่อีกครั้ง',
                        confirmButtonText: 'ปิด'
                    });
                }
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    useEffect(() => {
        if (isOpen) {
            initFetch();
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            setIsSubmitting(false);
            setUserBillingInfo({});
        }
    }, [isOpen]);

    return {
        isOpen,
        isSubmitting,
        data,
        userBillingInfo,
        onClose,
        onSubmit
    };
};

export default ViewModel;
