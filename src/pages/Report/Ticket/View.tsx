import React, { useRef } from 'react';
import { ViewModel } from './ViewModel';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import Select from 'react-select';
// @ts-ignore
import VirtualizedSelect from 'react-select-virtualized';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import moment from 'moment';
import { DataTable } from 'mantine-datatable';

const TIMEZONE = 'Asia/Bangkok';

interface SelectOption {
    value: string;
    label: string;
}

const TicketReportView: React.FC = () => {
    const { ticketData, loading, columns, userOptions, dateRange, selectedUsers, activeButton, setActiveButton, setDateRange, setSelectedUsers } = ViewModel();

    const filterDateRef = useRef<any>(null);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="page-content">
            <div className="flex flex-row justify-between items-center mb-4 ">
                <div className="flex flex-row gap-2 w-full w-max-4xl justify-end">
                    <div className="w-full flex items-end justify-between max-w-[800px] h-auto">
                        <div
                            className={`btn ${activeButton === 'new_tickets' ? 'bg-gray-200' : 'bg-white'} shadow-none w-full h-10 rounded-r-none cursor-pointer`}
                            onClick={() => setActiveButton('new_tickets')}
                        >
                            New Tickets
                        </div>
                        <div
                            className={`btn ${activeButton === 'user_messages' ? 'bg-gray-200' : 'bg-white'} shadow-none w-full h-10 rounded-none cursor-pointer`}
                            onClick={() => setActiveButton('user_messages')}
                        >
                            User Messages
                        </div>
                        <div
                            className={`btn ${activeButton === 'admin_messages' ? 'bg-gray-200' : 'bg-white'} shadow-none w-full h-10 rounded-none cursor-pointer`}
                            onClick={() => setActiveButton('admin_messages')}
                        >
                            Admin Messages
                        </div>
                        <div
                            className={`btn ${activeButton === 'answered_tickets' ? 'bg-gray-200' : 'bg-white'} shadow-none w-full h-10 rounded-l-none cursor-pointer`}
                            onClick={() => setActiveButton('answered_tickets')}
                        >
                            Answered Tickets
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
                                        records={ticketData}
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

export default TicketReportView;
