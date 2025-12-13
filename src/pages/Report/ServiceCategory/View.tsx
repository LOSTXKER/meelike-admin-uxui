import React, { useRef } from 'react';
import { ViewModel } from './ViewModel';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
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

const ServiceCategoryReportView: React.FC = () => {
    const { activeButton, setActiveButton, serviceData, loading, columns, dateRange, setDateRange } = ViewModel();

    const filterDateRef = useRef<any>(null);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='page-content'>
            <div className='flex flex-row justify-between items-center mb-4 '>
                <div className='flex flex-row gap-2 w-full w-max-4xl justify-end'>
                    <div className='w-full flex items-end justify-between max-w-[575px] h-auto'>
                        <div className={`btn ${activeButton === 'pnl' ? 'bg-gray-200' : 'bg-white'} shadow-none w-full h-10 rounded-r-none cursor-pointer`} onClick={() => setActiveButton('pnl')}>
                            PnL
                        </div>
                        <div
                            className={`btn ${activeButton === 'order-amount' ? 'bg-gray-200' : 'bg-white'} shadow-none w-full h-10 rounded-l-none cursor-pointer`}
                            onClick={() => setActiveButton('order-amount')}
                        >
                            Total Orders
                        </div>
                    </div>
                    <div className='w-full max-w-[300px]'>
                        <label className='form-label'>ช่วงวันที่</label>
                        <Flatpickr
                            placeholder='เลือกช่วงเวลา'
                            ref={filterDateRef}
                            value={dateRange}
                            options={{
                                mode: 'range',
                                dateFormat: 'F j, Y',
                                position: 'auto left',
                                maxDate: moment().tz(TIMEZONE).toDate()
                            }}
                            className='form-input placeholder:text-gray-400 text-meelike-dark focus:border-meelike-primary cursor-pointer rounded-lg font-semibold'
                            onChange={date => {
                                if (date.length === 2) {
                                    setDateRange(date);
                                }
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
                                <div className='relative datatables meelike-custom'>
                                    <DataTable
                                        rowClassName=''
                                        noRecordsText='ไม่พบข้อมูล'
                                        highlightOnHover
                                        className='whitespace-nowrap table-hover'
                                        records={serviceData}
                                        columns={columns}
                                        // minHeight={200}
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
export default ServiceCategoryReportView;
