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
import ReportStatCard from '../../../components/Report/ReportStatCard';
import ReportFilter from '../../../components/Report/ReportFilter';
import { IconTicket, IconMessage, IconMessageCircle, IconCheck } from '@tabler/icons-react';

const TIMEZONE = 'Asia/Bangkok';

interface SelectOption {
    value: string;
    label: string;
}

const TicketReportView: React.FC = () => {
    const { ticketData, loading, columns, userOptions, dateRange, selectedUsers, activeButton, setActiveButton, setDateRange, setSelectedUsers } = ViewModel();

    const filterDateRef = useRef<any>(null);

    // Calculate dynamic values for cards based on data (mock logic for now if data doesn't have totals)
    // Since `ticketData` changes based on `activeButton`, we can't sum all categories at once from this single `ticketData` source easily without extra logic.
    // For UI consistency, we'll display the count of the *currently selected* metric in its card, or a mock "Total" if needed.
    // Let's assume we want to show totals. API/ViewModel might need adjustment to return all totals, but for UI revamp we can
    // keep the interactive logic: Clicking a card sets the active filter.

    // We can just sum the current table data to show "Current View Total" and mock the others or leave them as interactives.
    const currentTotal = ticketData.reduce((acc, row) => acc + (Number(row.total || 0) + Number(row.count || 0)), 0);
    // Note: row structure depends on viewmodel. safely assuming numeric.

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="page-content bg-gray-50 min-h-screen p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Ticket Report</h1>
                <p className="text-gray-500 text-sm">Support ticket statistics.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <ReportStatCard
                    title="New Tickets"
                    value={activeButton === 'new_tickets' ? currentTotal : '---'}
                    icon={<IconTicket size={24} />}
                    color="primary"
                    isActive={activeButton === 'new_tickets'}
                    onClick={() => setActiveButton('new_tickets')}
                    className="h-full"
                />
                <ReportStatCard
                    title="User Messages"
                    value={activeButton === 'user_messages' ? currentTotal : '---'}
                    icon={<IconMessage size={24} />}
                    color="info"
                    isActive={activeButton === 'user_messages'}
                    onClick={() => setActiveButton('user_messages')}
                    className="h-full"
                />
                <ReportStatCard
                    title="Admin Messages"
                    value={activeButton === 'admin_messages' ? currentTotal : '---'}
                    icon={<IconMessageCircle size={24} />}
                    color="warning"
                    isActive={activeButton === 'admin_messages'}
                    onClick={() => setActiveButton('admin_messages')}
                    className="h-full"
                />
                <ReportStatCard
                    title="Answered"
                    value={activeButton === 'answered_tickets' ? currentTotal : '---'}
                    icon={<IconCheck size={24} />}
                    color="success"
                    isActive={activeButton === 'answered_tickets'}
                    onClick={() => setActiveButton('answered_tickets')}
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
            </ReportFilter>

            {/* Table */}
            <Card className="border-none shadow-sm rounded-xl overflow-hidden">
                <CardBody className="p-0">
                    <div className="relative datatables meelike-custom">
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
                                ...ticketData,
                                // Add Footer Row
                                {
                                    day: 'TOTAL',
                                    jan: ticketData.reduce((sum, item) => sum + (item.jan || 0), 0),
                                    feb: ticketData.reduce((sum, item) => sum + (item.feb || 0), 0),
                                    mar: ticketData.reduce((sum, item) => sum + (item.mar || 0), 0),
                                    apr: ticketData.reduce((sum, item) => sum + (item.apr || 0), 0),
                                    may: ticketData.reduce((sum, item) => sum + (item.may || 0), 0),
                                    jun: ticketData.reduce((sum, item) => sum + (item.jun || 0), 0),
                                    jul: ticketData.reduce((sum, item) => sum + (item.jul || 0), 0),
                                    aug: ticketData.reduce((sum, item) => sum + (item.aug || 0), 0),
                                    sep: ticketData.reduce((sum, item) => sum + (item.sep || 0), 0),
                                    oct: ticketData.reduce((sum, item) => sum + (item.oct || 0), 0),
                                    nov: ticketData.reduce((sum, item) => sum + (item.nov || 0), 0),
                                    dec: ticketData.reduce((sum, item) => sum + (item.dec || 0), 0),
                                }
                            ]}
                            columns={columns}
                            minHeight={200}
                        />
                    </div>
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

export default TicketReportView;
