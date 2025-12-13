import React, { useRef } from 'react';
import { useOrderViewModel } from './ViewModel';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { DataTable } from 'mantine-datatable';
import Select from 'react-select';
// @ts-ignore
import VirtualizedSelect from 'react-select-virtualized';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import moment from 'moment';

const TIMEZONE = 'Asia/Bangkok';

interface SelectOption {
    value: string;
    label: string;
}

const OrderReportView: React.FC = () => {
    const {
        orderData,
        loading,
        columns,
        userOptions,
        serviceOptions,
        orderStatusOptions,
        dateRange,
        selectedUsers,
        selectedServices,
        selectedOrderStatus,
        activeButton,
        setActiveButton,
        setDateRange,
        setSelectedUsers,
        setSelectedServices,
        setSelectedOrderStatus,
    } = useOrderViewModel();

    const filterDateRef = useRef<any>(null);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="page-content">
            <div className="flex flex-row justify-between items-center mb-4 ">
                <div className="flex flex-row gap-2 w-full w-max-4xl justify-end">
                    <div className="w-full flex items-end justify-between max-w-[575px] h-auto">
                        <div
                            className={`btn ${activeButton === 'amount' ? 'bg-gray-200' : 'bg-white'} shadow-none w-full h-10 rounded-r-none cursor-pointer`}
                            onClick={() => setActiveButton('amount')}
                        >
                            Total Amount
                        </div>
                        <div className={`btn ${activeButton === 'charge' ? 'bg-gray-200' : 'bg-white'} shadow-none w-full h-10 rounded-none cursor-pointer`} onClick={() => setActiveButton('charge')}>
                            Total Charge
                        </div>
                        <div
                            className={`btn ${activeButton === 'quantity' ? 'bg-gray-200' : 'bg-white'} shadow-none w-full h-10 rounded-l-none cursor-pointer`}
                            onClick={() => setActiveButton('quantity')}
                        >
                            Total Quantity
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
                        <label className="form-label">บริการ</label>
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
                            options={serviceOptions}
                            className="react-select"
                            classNamePrefix="select"
                            placeholder="เลือกบริการ..."
                            noOptionsMessage={() => 'ไม่พบข้อมูล'}
                            menuPortalTarget={document.body}
                            styles={{
                                menuPortal: (base: any) => ({ ...base, zIndex: 1000 }),
                            }}
                        />
                    </div>
                    <div className="w-full max-w-[200px] relative z-50">
                        <label className="form-label">สถานะคำสั่งซื้อ</label>
                        <Select<SelectOption, true>
                            isMulti
                            value={selectedOrderStatus}
                            onChange={(options) => setSelectedOrderStatus([...options])}
                            options={orderStatusOptions}
                            className="react-select"
                            classNamePrefix="select"
                            placeholder="เลือกสถานะคำสั่งซื้อ..."
                            noOptionsMessage={() => 'ไม่พบข้อมูล'}
                            menuPortalTarget={document.body}
                            styles={{
                                menuPortal: (base: any) => ({ ...base, zIndex: 1000 }),
                            }}
                        />
                    </div>
                </div>
            </div>
            <Container fluid>
                <Row>
                    <Col lg={12}>
                        <Card>
                            <CardBody>
                                <div className="relative datatables meelike-custom">
                                    <DataTable
                                        rowClassName=""
                                        noRecordsText="ไม่พบข้อมูล"
                                        highlightOnHover
                                        className="whitespace-nowrap table-hover"
                                        records={orderData}
                                        columns={columns}
                                        minHeight={200}
                                    />
                                </div>
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

export default OrderReportView;
