import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

interface StatusProps {
    status: string;
}

const Status: FC<StatusProps> = ({ status }) => {
    const { t } = useTranslation();
    let label = '';
    let className = '';

    switch (status) {
        case 'PENDING': {
            label = 'รอดำเนินการ';
            className = 'bg-meelike-ticket-status-open';
            break;
        }
        case 'ANSWERED': {
            label = 'ตอบแล้ว';
            className = 'bg-meelike-ticket-status-closed';
            break;
        }
        case 'CLOSED': {
            label = 'ปิด';
            className = 'bg-meelike-danger';
            break;
        }
        default:
            break;
    }

    return <span className={`badge font-bold text-white ${className}`}>{label}</span>;
};

export default Status;
