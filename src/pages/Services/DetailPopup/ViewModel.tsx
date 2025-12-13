import { useMemo, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ServiceDetailPopupContext } from '@/Context/ServiceDetailPopup';
import MockServiceDetail from '@/Data/mock-service-detail.json';
import { formatAverageTime } from '@/Utils/formatAverageTime';

const ViewModel = () => {
    const { isOpen, serviceId, close } = useContext(ServiceDetailPopupContext);
    const { t } = useTranslation();

    const data: any = MockServiceDetail;
    const detailKeys = [
        {
            key: 'averageTimeHrs',
            label: t('serviceDetail.averageTime'),
            tooltip: t('serviceDetail.averageTimeTooltip'),
        },
        {
            key: 'speedOrdersPerDay',
            label: t('serviceDetail.speedOrdersPerDay'),
            tooltip: t('serviceDetail.speedOrdersPerDayTooltip'),
        },
        {
            key: 'minQuantity',
            label: t('serviceDetail.minQuantity'),
            tooltip: t('serviceDetail.minQuantityTooltip'),
        },
        {
            key: 'maxQuantity',
            label: t('serviceDetail.maxQuantity'),
            tooltip: t('serviceDetail.maxQuantityTooltip'),
        },
        {
            key: 'dropRate',
            label: t('serviceDetail.dropRate'),
            tooltip: t('serviceDetail.dropRateTooltip'),
        },
        {
            key: 'warrantyEnabled',
            label: t('serviceDetail.warranty'),
            tooltip: t('serviceDetail.warrantyTooltip'),
        },
        {
            key: 'quality',
            label: t('serviceDetail.quality'),
            tooltip: t('serviceDetail.qualityTooltip'),
        },
        {
            key: 'refillable',
            label: t('serviceDetail.refill'),
            tooltip: t('serviceDetail.refillTooltip'),
        },
    ];

    const [analyticType, setAnalyticType] = useState<'orderCompletion' | 'speed'>('orderCompletion');
    const [orderCompletionTimeSerie, setOrderCompletionTimeSerie] = useState<string>('15');

    const orderCompletionCategories = useMemo(() => {
        return ['1-250', '251-500', '501-750', '751-1000', '1001-1250', '1251-1500', '1501-1750', '1751-2000', '2001-2250', '2251-2500'];
    }, [data]);
    const orderCompletionSeries = useMemo(() => {
        return [
            {
                name: 'Order Completion',
                data: [0, 4, 15, 20, 25, 30, 35, 70, 80, 100],
            },
        ];
    }, [data, orderCompletionTimeSerie]);

    const generateDetailValue = (key: string, value: any) => {
        switch (key) {
            case 'averageTimeHrs': {
                return formatAverageTime(value);
            }
            case 'speedOrdersPerDay': {
                return `${(value ?? 0).toLocaleString('th-TH', {
                    minimumFractionDigits: 0,
                })} / day`;
            }
            case 'minQuantity': {
                return (value ?? 0).toLocaleString('th-TH', {
                    minimumFractionDigits: 0,
                });
            }
            case 'maxQuantity': {
                return (value ?? 0).toLocaleString('th-TH', {
                    minimumFractionDigits: 0,
                });
            }
            case 'dropRate': {
                return `${(value ?? 0).toLocaleString('th-TH', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })} %`;
            }
            case 'quality': {
                const lowQualityRange = [0, 4];
                const mediumQualityRange = [5, 7];
                const highQualityRange = [8, 10];

                if (value >= lowQualityRange[0] && value <= lowQualityRange[1]) {
                    return 'Low';
                } else if (value >= mediumQualityRange[0] && value <= mediumQualityRange[1]) {
                    return 'Medium';
                } else if (value >= highQualityRange[0] && value <= highQualityRange[1]) {
                    return 'High';
                } else {
                    return 'N/A';
                }
            }
            case 'refillable': {
                return value ? 'Yes' : 'No';
            }
            default: {
                return value;
            }
        }
    };

    const onClose = () => {
        close();

        setTimeout(() => {
            setAnalyticType('orderCompletion');
            setOrderCompletionTimeSerie('15');
        }, 300);
    };

    return {
        t,
        detailKeys,
        generateDetailValue,
        isOpen,
        data,
        orderCompletionTimeSerie,
        setOrderCompletionTimeSerie,
        orderCompletionSeries,
        orderCompletionCategories,
        analyticType,
        setAnalyticType,
        onClose,
    };
};

export default ViewModel;
