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
            },
            colors: ['#4361EE', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF'],
            tooltip: {
                marker: {
                    show: true,
                },
                y: {
                    formatter(value: number) {
                        return activeButton === 'amount' ? `฿ ${new Decimal(value).toFixed(2)}` : `${value} รายการ`;
                    },
                },
            },
            stroke: {
                width: 3,
                curve: 'smooth',
            },
            xaxis: {
                categories: categories,
                axisBorder: {
                    color: '#e0e6ed',
                },
                title: {
                    text: 'Date',
                },
            },
            yaxis: {
                labels: {
                    formatter(value: number) {
                        return activeButton === 'amount' ? new Decimal(value).toFixed(0) : value.toString();
                    },
                },
                title: {
                    text: activeButton === 'amount' ? 'Total Amount' : 'Count',
                },
            },
            grid: {
                borderColor: '#e0e6ed',
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                floating: true,
                offsetY: -25,
                offsetX: -5,
            },
        } as ApexOptions,
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="page-content">
            {/* Filter */}
            <div className="flex flex-row justify-between items-center mb-4">
                <div className="text-2xl font-bold w-full max-w-[200px]">Payment Report</div>
                {viewType === 'table' ? (
                    <div className="flex flex-row gap-2 w-full w-max-4xl justify-end">
                        <div className="w-full flex items-end justify-between max-w-[375px] h-auto">
                            <div
                                className={`btn ${activeButton === 'amount' ? 'bg-gray-200' : 'bg-white'} shadow-none w-full h-10 rounded-r-none cursor-pointer`}
                                onClick={() => {
                                    setActiveButton('amount');
                                }}
                            >
                                total amount
                            </div>
                            <div
                                className={`btn ${activeButton === 'count' ? 'bg-gray-200' : 'bg-white'} shadow-none w-full h-10 rounded-l-none cursor-pointer`}
                                onClick={() => {
                                    setActiveButton('count');
                                }}
                            >
                                total count
                            </div>
                        </div>
                        <div className="w-full max-w-[300px]">
                            <label className="form-label">ช่วงวันที่</label>
                            <Flatpickr
                                placeholder="เลือกช่วงเวลา"
                                ref={filterDateRef}
                                value={dateRange}
                                options={{
                                    mode: 'range',
                                    dateFormat: 'F j, Y',
                                    position: 'auto left',
                                    maxDate: moment().tz(TIMEZONE).toDate(),
                                }}
                                className="form-input placeholder:text-gray-400 text-meelike-dark focus:border-meelike-primary cursor-pointer rounded-lg font-semibold"
                                onChange={(date) => {
                                    if (date.length === 2) {
                                        setDateRange(date);
                                    }
                                }}
                            />
                        </div>
                        <div className="w-full max-w-[200px] relative z-50">
                            <label className="form-label">ผู้ใช้งาน</label>
                            <VirtualizedSelect<SelectOption, true>
                                isMulti
                                value={selectedUsers}
                                onChange={(option: any) => {
                                    if (!Array.isArray(option)) {
                                        setSelectedUsers((prevState) => [...prevState, option]);
                                    } else {
                                        setSelectedUsers(option);
                                    }
                                }}
                                options={userOptions}
                                className="react-select"
                                classNamePrefix="select"
                                placeholder="เลือกผู้ใช้งาน..."
                                noOptionsMessage={() => 'ไม่พบข้อมูล'}
                                menuPortalTarget={document.body}
                                styles={{
                                    menuPortal: (base: any) => ({ ...base, zIndex: 1000 }),
                                }}
                            />
                        </div>
                        <div className="w-full max-w-[200px] relative z-50">
                            <label className="form-label">วิธีการชำระเงิน</label>
                            <VirtualizedSelect<SelectOption, true>
                                isMulti
                                value={selectedServices}
                                onChange={(option: any) => {
                                    if (!Array.isArray(option)) {
                                        setSelectedServices((prevState) => [...prevState, option]);
                                    } else {
                                        setSelectedServices(option);
                                    }
                                }}
                                options={paymentOptions}
                                className="react-select"
                                classNamePrefix="select"
                                placeholder="เลือกวิธีการชำระเงิน..."
                                noOptionsMessage={() => 'ไม่พบข้อมูล'}
                                menuPortalTarget={document.body}
                                styles={{
                                    menuPortal: (base: any) => ({ ...base, zIndex: 1000 }),
                                }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-row gap-2 w-full justify-end">
                        {/* <div className="w-full flex items-end justify-between max-w-[375px] h-auto">
                            <div
                                className={`btn ${activeButton === 'amount' ? 'bg-gray-200' : 'bg-white'} shadow-none w-full h-10 rounded-r-none cursor-pointer`}
                                onClick={() => setActiveButton('amount')}
                            >
                                total amount
                            </div>
                            <div
                                className={`btn ${activeButton === 'count' ? 'bg-gray-200' : 'bg-white'} shadow-none w-full h-10 rounded-l-none cursor-pointer`}
                                onClick={() => setActiveButton('count')}
                            >
                                total count
                            </div>
                        </div> */}
                        <div className="w-full max-w-[300px]">
                            <label className="form-label">ช่วงวันที่</label>
                            <Flatpickr
                                placeholder="เลือกช่วงเวลา"
                                ref={filterDateRef}
                                value={dateRange}
                                options={{
                                    mode: 'range',
                                    dateFormat: 'F j, Y',
                                    position: 'auto left',
                                    maxDate: moment().tz(TIMEZONE).toDate(),
                                }}
                                className="form-input placeholder:text-gray-400 text-meelike-dark focus:border-meelike-primary cursor-pointer rounded-lg font-semibold"
                                onChange={(date) => {
                                    if (date.length === 2) {
                                        setDateRange(date);
                                    }
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
            {/* Switch View */}
            <div className="mb-2 flex justify-center">
                <div className="max-w-2xl w-full flex items-end justify-between h-auto ">
                    <div className={`btn ${viewType === 'chart' ? 'bg-gray-200' : 'bg-white'} shadow-none w-full h-10 rounded-r-none cursor-pointer`} onClick={() => setViewType('chart')}>
                        Chart
                    </div>
                    <div className={`btn ${viewType === 'table' ? 'bg-gray-200' : 'bg-white'} shadow-none w-full h-10 rounded-l-none cursor-pointer`} onClick={() => setViewType('table')}>
                        Table
                    </div>
                </div>
            </div>
            <Container fluid>
                <Row>
                    <Col lg={12}>
                        <Card>
                            <CardBody>
                                {viewType === 'chart' ? (
                                    <ReactApexChart series={chartData.series} options={chartData.options} type="line" height={350} className="rounded-lg bg-white overflow-hidden" />
                                ) : (
                                    <div className="relative datatables meelike-custom">
                                        <DataTable
                                            rowClassName=""
                                            noRecordsText="ไม่พบข้อมูล"
                                            highlightOnHover
                                            className="whitespace-nowrap table-hover"
                                            records={PaymentData}
                                            columns={columns}
                                            minHeight={200}
                                        />
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <style>{`
                /* Header */
                .datatables.meelike-custom table thead tr {
                    background-color: #FDE8BD !important;
                    color: #473B30 !important;
                }
                .fast-option {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                }

            `}</style>
        </div>
    );
};

export default PaymentReportView;
