import { TicketStatus } from '@/Data/ticket-status';
import IconTicketOpen from '@/components/Icon/MeeLike/TicketStatus/10';
import IconTicketClosed from '@/components/Icon/MeeLike/TicketStatus/20';

export const generateTicketStatusIcon = (status: TicketStatus, width?: number, height?: number): JSX.Element | null => {
    switch (status) {
        case TicketStatus.OPEN:
            return <IconTicketOpen width={width} height={height} />;
        case TicketStatus.CLOSED:
            return <IconTicketClosed width={width} height={height} />;
        default:
            return null;
    }
};
