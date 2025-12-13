import { type FC } from 'react';
import { OrderStatus } from '@/Data/order-status';

interface StatusProps {
    status: string;
}

const Status: FC<StatusProps> = ({ status }) => {
    let label = '';
    let className = '';

    switch (status) {
        case OrderStatus.AWAITING: {
            label = 'Awaiting';
            className = 'bg-meelike-order-status-in-progress';
            break;
        }
        case OrderStatus.PENDING: {
            label = 'Pending';
            className = 'bg-meelike-order-status-in-progress';
            break;
        }
        case OrderStatus.IN_PROGRESS: {
            label = 'In Progress';
            className = 'bg-meelike-order-status-in-progress';
            break;
        }
        case OrderStatus.COMPLETED: {
            label = 'Completed';
            className = 'bg-meelike-order-status-completed';
            break;
        }
        case OrderStatus.PROCESSING: {
            label = 'Processing';
            className = 'bg-meelike-order-status-hold';
            break;
        }
        case OrderStatus.PARTIAL: {
            label = 'Partial';
            className = 'bg-meelike-order-status-partially-completed';
            break;
        }
        case OrderStatus.CANCELED: {
            label = 'Canceled';
            className = 'bg-meelike-order-status-cancelled';
            break;
        }
        case OrderStatus.ON_REFILL: {
            label = 'On Refill';
            className = 'bg-meelike-order-status-on-refill';
            break;
        }
        case OrderStatus.FAIL: {
            label = 'Fail';
            className = 'bg-meelike-order-status-failed';
            break;
        }
        case OrderStatus.ERROR: {
            label = 'Error';
            className = 'bg-meelike-order-status-failed';
            break;
        }
        default:
            break;
    }

    return <span className={`badge font-bold text-white ${className}`}>{label}</span>;
};

export default Status;
