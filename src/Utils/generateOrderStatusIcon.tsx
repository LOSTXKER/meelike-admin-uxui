import { OrderStatus } from '@/Data/order-status';
import IconOrderInProgress from '@/components/Icon/MeeLike/OrderStatus/10';
import IconOrderCompleted from '@/components/Icon/MeeLike/OrderStatus/20';
import IconOrderHold from '@/components/Icon/MeeLike/OrderStatus/30';
import IconOrderPartiallyCompleted from '@/components/Icon/MeeLike/OrderStatus/40';
import IconOrderCancelled from '@/components/Icon/MeeLike/OrderStatus/50';
import IconOrderOnRefill from '@/components/Icon/MeeLike/OrderStatus/60';
import IconX from '@/components/Icon/IconX';

export const generateOrderStatusIcon = (status: OrderStatus, width?: number, height?: number): JSX.Element | null => {
    switch (status) {
        case OrderStatus.IN_PROGRESS:
            return <IconOrderInProgress width={width} height={height} />;
        case OrderStatus.AWAITING:
            return <IconOrderInProgress width={width} height={height} />;
        case OrderStatus.PENDING:
            return <IconOrderInProgress width={width} height={height} />;
        case OrderStatus.PROCESSING:
            return <IconOrderInProgress width={width} height={height} />;
        case OrderStatus.REFILLED:
            return <IconOrderCompleted width={width} height={height} />;
        case OrderStatus.COMPLETED:
            return <IconOrderCompleted width={width} height={height} />;
        case OrderStatus.PARTIAL:
            return <IconOrderPartiallyCompleted width={width} height={height} />;
        case OrderStatus.CANCELED:
            return <IconOrderCancelled width={width} height={height} />;
        case OrderStatus.ON_REFILL:
            return <IconOrderOnRefill width={width} height={height} />;
        case OrderStatus.FAIL:
            return <IconX width={width} height={height} className="text-meelike-order-status-70" />;
        case OrderStatus.ERROR:
            return <IconX width={width} height={height} className="text-meelike-order-status-70" />;
        default:
            return null;
    }
};
