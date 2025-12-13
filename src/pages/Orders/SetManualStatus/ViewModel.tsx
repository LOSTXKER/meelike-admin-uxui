import { useState } from 'react';
import { OrderStatus } from '@/Data/order-status';

export interface Props {
    isSubmitting: boolean;
    isHideToConfirm: boolean;
    isOpen: boolean;
    handleClose: () => void;
    handleSubmit: (status: OrderStatus) => void;
}

const ViewModel = (props: Props) => {
    const { isSubmitting, isHideToConfirm, isOpen, handleClose, handleSubmit } = props;
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);
    const [isError, setIsError] = useState(false);

    const options = [
        { label: 'Pending', value: OrderStatus.PENDING },
        { label: 'Processing', value: OrderStatus.PROCESSING },
        { label: 'In Progress', value: OrderStatus.IN_PROGRESS },
        { label: 'Completed', value: OrderStatus.COMPLETED }
    ];

    const onClose = () => {
        handleClose();
    };

    const onSubmit = () => {
        if (!selectedStatus) {
            setIsError(true);
            return;
        } else {
            setIsError(false);
            handleSubmit(selectedStatus);
        }
    };

    return {
        options,
        isSubmitting,
        isOpen,
        isHideToConfirm,
        isError,
        selectedStatus,
        setSelectedStatus,
        onClose,
        onSubmit
    };
};

export default ViewModel;
