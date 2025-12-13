import { useOrderStore } from '@/store/order';
import { useShallow } from 'zustand/react/shallow';

export interface Props {
    isOpen: boolean;
    handleClose: () => void;
}

const ViewModel = (props: Props) => {
    const { isOpen, handleClose } = props;
    const { data, externalStatus } = useOrderStore(
        useShallow((state) => ({
            data: state.selected,
            externalStatus: state.externalStatus,
        }))
    );

    const onClose = () => {
        handleClose();
    };

    return { isOpen, data, externalStatus, onClose };
};

export default ViewModel;
