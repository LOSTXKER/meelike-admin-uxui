import { useState, useEffect } from 'react';
import moment from 'moment';
import { useUserStore } from '../../../store/admin-user';
import { useServiceStore } from '../../../store/service';
import { useMasterDataStore } from '../../../store/master-data';
import { useTicketStore } from '../../../store/report/ticket';

export interface TicketData {
    day: number | string;
    jan?: number;
    feb?: number;
    mar?: number;
    apr?: number;
    may?: number;
    jun?: number;
    jul?: number;
    aug?: number;
    sep?: number;
    oct?: number;
    nov?: number;
    dec?: number;
}

export interface TableDataItem {
    day: number;
    month: number;
    totalQuantity?: number;
    userMessages?: number;
    staffMessages?: number;
    answeredTickets?: number;
}

const TIMEZONE = 'Asia/Bangkok';

export type ActiveButtonType = 'new_tickets' | 'user_messages' | 'admin_messages' | 'answered_tickets';

export const ViewModel = () => {
    const [ticketData, setTicketData] = useState<TicketData[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeButton, setActiveButton] = useState<ActiveButtonType>('new_tickets');
    const [userOptions, setUserOptions] = useState<{ value: string; label: string }[]>([]);
    const [serviceOptions, setServiceOptions] = useState<{ value: string; label: string }[]>([]);
    const [orderStatusOptions, setOrderStatusOptions] = useState<{ value: string; label: string }[]>([]);

    // Filter states
    const [dateRange, setDateRange] = useState<Date[]>([moment().subtract(30, 'days').toDate(), moment().toDate()]);
    const [selectedUsers, setSelectedUsers] = useState<{ value: string; label: string }[]>([]);
    const [selectedServices, setSelectedServices] = useState<{ value: string; label: string }[]>([]);
    const [selectedOrderStatus, setSelectedOrderStatus] = useState<{ value: string; label: string }[]>([]);

    const { getAllUser } = useUserStore();
    const { getAllService } = useServiceStore();
    const { getOrderStatus } = useMasterDataStore();
    const { getTicketData } = useTicketStore();

    // Fetch table data from API
    // Fetch table data from API (Mocked)
    const fetchTableData = async () => {
        setLoading(true);
        // Simulate API
        await new Promise(resolve => setTimeout(resolve, 400));

        if (dateRange.length !== 2) {
            setTicketData([]);
            setLoading(false);
            return;
        }

        // Generate Mock Data
        const mockData: TableDataItem[] = [];
        for (let m = 1; m <= 12; m++) {
            for (let d = 1; d <= 31; d++) {
                // Random stats
                mockData.push({
                    day: d,
                    month: m,
                    totalQuantity: Math.floor(Math.random() * 20),
                    userMessages: Math.floor(Math.random() * 100),
                    staffMessages: Math.floor(Math.random() * 100),
                    answeredTickets: Math.floor(Math.random() * 20)
                });
            }
        }

        const processedData = processTableData(mockData);
        setTicketData(processedData);
        setLoading(false);
    };

    // Process table data from API to match the table format
    const processTableData = (apiData: TableDataItem[]): TicketData[] => {
        // Create array for days 1-31
        const processedData: TicketData[] = [];

        for (let day = 1; day <= 31; day++) {
            const rowData: TicketData = { day };

            // Initialize all months to 0
            const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
            months.forEach((month) => {
                rowData[month as keyof TicketData] = 0;
            });

            // Fill in data from API
            apiData.forEach((item) => {
                if (item.day === day) {
                    const monthIndex = item.month - 1; // API month is 1-based, array is 0-based
                    if (monthIndex >= 0 && monthIndex < 12) {
                        const monthKey = months[monthIndex] as keyof TicketData;

                        // Use the appropriate field based on active button
                        let value = 0;
                        if (activeButton === 'new_tickets') {
                            value = Number(item.totalQuantity) || 0;
                        } else if (activeButton === 'user_messages') {
                            value = Number(item.userMessages) || 0;
                        } else if (activeButton === 'admin_messages') {
                            value = Number(item.staffMessages) || 0;
                        } else if (activeButton === 'answered_tickets') {
                            value = Number(item.answeredTickets) || 0;
                        }

                        rowData[monthKey] = value;
                    }
                }
            });

            processedData.push(rowData);
        }

        return processedData;
    };

    // Fetch users data for filter options
    // Fetch users data for filter options (Mocked)
    const fetchUsersData = async () => {
        const options = Array.from({ length: 10 }).map((_, i) => ({
            value: (i + 1).toString(),
            label: `Mock User ${i + 1}`,
        }));
        setUserOptions(options);
    };

    // Fetch services data for filter options (Mocked)
    const fetchServicesData = async () => {
        const options = Array.from({ length: 10 }).map((_, i) => ({
            value: (i + 1).toString(),
            label: `Mock Service ${i + 1}`,
        }));
        setServiceOptions(options);
    };

    // Fetch order status data for filter options (Mocked)
    const fetchOrderStatusData = async () => {
        const options = [
            { value: 'open', label: 'Open' },
            { value: 'closed', label: 'Closed' }
        ];
        setOrderStatusOptions(options);
        setSelectedOrderStatus([]);
    };

    useEffect(() => {
        // Fetch all filter data on component mount
        const initializeData = async () => {
            setLoading(true);
            await Promise.all([fetchUsersData(), fetchServicesData(), fetchOrderStatusData()]);
            setLoading(false);
        };
        initializeData();
    }, []);

    useEffect(() => {
        // Fetch table data when filters change
        fetchTableData();
    }, [dateRange, selectedUsers, selectedServices, selectedOrderStatus, activeButton]);

    // Define columns for DataTable
    const columns = [
        {
            accessor: 'day',
            title: 'Day',

            width: 80,
            render: ({ day }: any) => <div className="text-center">{day}</div>,
        },
        {
            accessor: 'jan',
            title: 'January',

            width: 100,
            render: ({ jan }: any) => <div className="text-center">{jan !== undefined && jan !== null ? jan : 0}</div>,
        },
        {
            accessor: 'feb',
            title: 'February',

            width: 100,
            render: ({ feb }: any) => <div className="text-center">{feb !== undefined && feb !== null ? feb : 0}</div>,
        },
        {
            accessor: 'mar',
            title: 'March',

            width: 100,
            render: ({ mar }: any) => <div className="text-center">{mar !== undefined && mar !== null ? mar : 0}</div>,
        },
        {
            accessor: 'apr',
            title: 'April',

            width: 100,
            render: ({ apr }: any) => <div className="text-center">{apr !== undefined && apr !== null ? apr : 0}</div>,
        },
        {
            accessor: 'may',
            title: 'May',

            width: 100,
            render: ({ may }: any) => <div className="text-center">{may !== undefined && may !== null ? may : 0}</div>,
        },
        {
            accessor: 'jun',
            title: 'June',

            width: 100,
            render: ({ jun }: any) => <div className="text-center">{jun !== undefined && jun !== null ? jun : 0}</div>,
        },
        {
            accessor: 'jul',
            title: 'July',

            width: 100,
            render: ({ jul }: any) => <div className="text-center">{jul !== undefined && jul !== null ? jul : 0}</div>,
        },
        {
            accessor: 'aug',
            title: 'August',

            width: 100,
            render: ({ aug }: any) => <div className="text-center">{aug !== undefined && aug !== null ? aug : 0}</div>,
        },
        {
            accessor: 'sep',
            title: 'September',

            width: 100,
            render: ({ sep }: any) => <div className="text-center">{sep !== undefined && sep !== null ? sep : 0}</div>,
        },
        {
            accessor: 'oct',
            title: 'October',

            width: 100,
            render: ({ oct }: any) => <div className="text-center">{oct !== undefined && oct !== null ? oct : 0}</div>,
        },
        {
            accessor: 'nov',
            title: 'November',

            width: 100,
            render: ({ nov }: any) => <div className="text-center">{nov !== undefined && nov !== null ? nov : 0}</div>,
        },
        {
            accessor: 'dec',
            title: 'December',

            width: 100,
            render: ({ dec }: any) => <div className="text-center">{dec !== undefined && dec !== null ? dec : 0}</div>,
        },
    ];

    return {
        ticketData,
        loading,
        columns,
        // Filter options
        userOptions,
        serviceOptions,
        orderStatusOptions,
        // Selected values
        dateRange,
        selectedUsers,
        selectedServices,
        selectedOrderStatus,
        // Active button state
        activeButton,
        setActiveButton,
        // Setters
        setDateRange,
        setSelectedUsers,
        setSelectedServices,
        setSelectedOrderStatus,
        // Data fetching
        fetchTableData,
    };
};
