import { useState } from 'react';
import { OrderStatus } from '@/Data/order-status';
import { useTicketStore } from '@/store/ticket';
import { useShallow } from 'zustand/react/shallow';
import { useMasterDataStore } from '@/store/master-data';

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

    const { ticketStatuses } = useMasterDataStore(
        useShallow(state => ({
            ticketStatuses: state.ticketStatuses
        }))
    );

    const options = ticketStatuses.map((status: any) => ({
        icon: <img src={status.iconUrl} alt={status.label} className='w-[22px] h-[22px] ' />,
        label: status.label,
        value: status.value
    }));

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
