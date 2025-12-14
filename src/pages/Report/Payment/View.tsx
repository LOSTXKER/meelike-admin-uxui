import React, { useRef } from 'react';
import { useOrderViewModel } from './ViewModel';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import Select from 'react-select';
// @ts-ignore
import VirtualizedSelect from 'react-select-virtualized';
import Decimal from 'decimal.js';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import moment from 'moment';
import { DataTable } from 'mantine-datatable';
import ReportStatCard from '../../../components/Report/ReportStatCard';
import ReportFilter from '../../../components/Report/ReportFilter';
import { IconCreditCard, IconReceipt, IconChartPie } from '@tabler/icons-react';

const TIMEZONE = 'Asia/Bangkok';

interface SelectOption {
    value: string;
    label: string;
}

const PaymentReportView: React.FC = () => {
    const {
        PaymentData,
        loading,
        columns,
        userOptions,
        paymentOptions,
        orderStatusOptions,
        selectedUsers,
        selectedServices,
        selectedOrderStatus,
        activeButton,
        viewType,
        dateRange,
        setDateRange,
        setViewType,
        setActiveButton,
        setSelectedUsers,
        setSelectedServices,
        setSelectedOrderStatus,
        processChartData,
        fetchChartData,
        fetchTableData,
    } = useOrderViewModel();

    const filterDateRef = useRef<any>(null);

    // Get processed chart data
    const { series, categories } = processChartData();

    // Prepare chart data
    const chartData = {
        series: series,
        options: {
            chart: {
                height: 350,
                type: 'line' as const,
                toolbar: {
                    show: false,
                },
                fontFamily: 'Nunito, sans-serif',
            },
            colors: ['#4361EE', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF'],
            tooltip: {
                marker: {
                    show: true,
                },
                y: {
                    formatter(value: number) {
                        return activeButton === 'amount' ? `฿ ${new Decimal(value).toFixed(2)}` : `${value} Txns`;
                    },
                },
                theme: 'light',
            },
            stroke: {
                width: 4,
                curve: 'smooth',
            },
            xaxis: {
                categories: categories,
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                labels: {
                    style: {
                        colors: '#6b7280',
                        fontSize: '12px',
                    },
                },
            },
            yaxis: {
                labels: {
                    style: {
                        colors: '#6b7280',
                        fontSize: '12px',
                    },
                    formatter(value: number) {
                        return activeButton === 'amount' ? new Decimal(value).toFixed(0) : value.toString();
                    },
                },
            },
            grid: {
                borderColor: '#f3f4f6',
                strokeDashArray: 4,
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
            },
        } as ApexOptions,
    };

    // Calculate approx totals for cards
    const totalAmount = React.useMemo(() => {
        return PaymentData.reduce((sum, item) => sum + (Number(item.totalAmount || 0)), 0);
    }, [PaymentData]);

    const totalCount = React.useMemo(() => {
        return PaymentData.reduce((sum, item) => sum + (Number(item.totalCount || 0)), 0);
    }, [PaymentData]);


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="page-content bg-gray-50 min-h-screen p-6">
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Payment Report</h1>
                    <p className="text-gray-500 text-sm">Financial transactions analytics.</p>
                </div>
                {/* View Switcher */}
                <div className="bg-white p-1 rounded-lg border border-gray-200 flex shadow-sm">
                    <button
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${viewType === 'chart' ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                        onClick={() => setViewType('chart')}
                    >
                        Chart View
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${viewType === 'table' ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                        onClick={() => setViewType('table')}
                    >
                        Table View
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <ReportStatCard
                    title="Total Amount"
                    value={`฿${totalAmount.toLocaleString()}`}
                    icon={<IconCreditCard size={24} />}
                    color="primary"
                    isActive={activeButton === 'amount'}
                    onClick={() => setActiveButton('amount')}
                    className="h-full"
                />
                <ReportStatCard
                    title="Total Transactions"
                    value={totalCount.toLocaleString()}
                    icon={<IconReceipt size={24} />}
                    color="secondary"
                    isActive={activeButton === 'count'}
                    onClick={() => setActiveButton('count')}
                    className="h-full"
                />
            </div>

            {/* Filters */}
            <ReportFilter>
                <div className="w-full md:w-auto min-w-[250px] flex-grow">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Date Range</label>
                    <Flatpickr
                        placeholder="Select Date Range"
                        ref={filterDateRef}
                        value={dateRange}
                        options={{
                            mode: 'range',
                            dateFormat: 'F j, Y',
                            position: 'auto left',
                            maxDate: moment().tz(TIMEZONE).toDate(),
                        }}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        onChange={(date) => {
                            if (date.length === 2) {
                                setDateRange(date);
                            }
                        }}
                    />
                </div>

                <div className="w-full md:w-auto min-w-[200px] flex-grow">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Users</label>
                    <VirtualizedSelect<SelectOption, true>
                        isMulti
                        value={selectedUsers}
                        onChange={(option: any) => setSelectedUsers(Array.isArray(option) ? option : [...selectedUsers, option])}
                        options={userOptions}
                        classNamePrefix="select"
                        placeholder="Select Users..."
                        styles={{ menuPortal: (base: any) => ({ ...base, zIndex: 9999 }) }}
                        menuPortalTarget={document.body}
                    />
                </div>

                <div className="w-full md:w-auto min-w-[200px] flex-grow">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Payment Method</label>
                    <VirtualizedSelect<SelectOption, true>
                        isMulti
                        value={selectedServices}
                        onChange={(option: any) => setSelectedServices(Array.isArray(option) ? option : [...selectedServices, option])}
                        options={paymentOptions}
                        classNamePrefix="select"
                        placeholder="Select Method..."
                        styles={{ menuPortal: (base: any) => ({ ...base, zIndex: 9999 }) }}
                        menuPortalTarget={document.body}
                    />
                </div>
            </ReportFilter>

            {/* Content Area */}
            <Card className="border-none shadow-sm rounded-xl overflow-hidden">
                <CardBody className="p-0">
                    {viewType === 'chart' ? (
                        <div className="p-6">
                            <ReactApexChart series={chartData.series} options={chartData.options} type="line" height={400} />
                        </div>
                    ) : (
                        <DataTable
                            rowClassName={(record) => {
                                if (record.day === 'TOTAL') {
                                    return 'bg-gray-100 font-bold text-primary hover:bg-gray-100';
                                }
                                return '';
                            }}
                            noRecordsText="No records found"
                            highlightOnHover
                            className="table-modern"
                            records={[
                                ...PaymentData,
                                // Add Footer Row
                                {
                                    day: 'TOTAL',
                                    jan: PaymentData.reduce((sum, item) => sum + (item.jan || 0), 0),
                                    feb: PaymentData.reduce((sum, item) => sum + (item.feb || 0), 0),
                                    mar: PaymentData.reduce((sum, item) => sum + (item.mar || 0), 0),
                                    apr: PaymentData.reduce((sum, item) => sum + (item.apr || 0), 0),
                                    may: PaymentData.reduce((sum, item) => sum + (item.may || 0), 0),
                                    jun: PaymentData.reduce((sum, item) => sum + (item.jun || 0), 0),
                                    jul: PaymentData.reduce((sum, item) => sum + (item.jul || 0), 0),
                                    aug: PaymentData.reduce((sum, item) => sum + (item.aug || 0), 0),
                                    sep: PaymentData.reduce((sum, item) => sum + (item.sep || 0), 0),
                                    oct: PaymentData.reduce((sum, item) => sum + (item.oct || 0), 0),
                                    nov: PaymentData.reduce((sum, item) => sum + (item.nov || 0), 0),
                                    dec: PaymentData.reduce((sum, item) => sum + (item.dec || 0), 0),
                                }
                            ]}
                            columns={columns}
                            minHeight={300}
                        />
                    )}
                </CardBody>
            </Card>

            <style>{`
                 .table-modern thead tr th {
                    background-color: #f9fafb !important;
                    color: #6b7280 !important;
                    font-weight: 600 !important;
                    font-size: 0.875rem !important;
                    padding-top: 1rem !important;
                    padding-bottom: 1rem !important;
                    border-bottom: 1px solid #e5e7eb !important;
                }
                .table-modern tbody tr td {
                    padding-top: 1rem !important;
                    padding-bottom: 1rem !important;
                    color: #374151 !important;
                    font-size: 0.875rem !important;
                    border-bottom: 1px solid #f3f4f6 !important;
                }
                .table-modern tbody tr:last-child td {
                    border-bottom: none !important;
                }
            `}</style>
        </div>
    );
};

export default PaymentReportView;
