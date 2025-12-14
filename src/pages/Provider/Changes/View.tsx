import React from 'react';
import { useProviderChangesViewModel, ProviderChange } from './ViewModel';
import { Card, CardBody, Input } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import moment from 'moment-timezone';
import Flatpickr from 'react-flatpickr';
import Select from 'react-select';
import {
    IconPlugConnectedX,
    IconPlugConnected,
    IconCurrencyBaht,
    IconClock,
    IconPlus,
    IconTrash,
    IconInfoCircle,
    IconRefresh,
    IconSearch,
    IconFilter
} from '@tabler/icons-react';

const TIMEZONE = 'Asia/Bangkok';

// Helper to get change type configuration
const getChangeConfig = (changeType: ProviderChange['changeType']) => {
    switch (changeType) {
        case 'disabled':
            return { icon: IconPlugConnectedX, bg: 'bg-red-100', text: 'text-red-600', label: 'ปิดบริการ' };
        case 'enabled':
            return { icon: IconPlugConnected, bg: 'bg-green-100', text: 'text-green-600', label: 'เปิดบริการ' };
        case 'price_change':
            return { icon: IconCurrencyBaht, bg: 'bg-amber-100', text: 'text-amber-600', label: 'เปลี่ยนราคา' };
        case 'rate_change':
            return { icon: IconClock, bg: 'bg-blue-100', text: 'text-blue-600', label: 'เปลี่ยนอัตรา' };
        case 'new_service':
            return { icon: IconPlus, bg: 'bg-purple-100', text: 'text-purple-600', label: 'บริการใหม่' };
        case 'removed_service':
            return { icon: IconTrash, bg: 'bg-gray-100', text: 'text-gray-600', label: 'ยกเลิกบริการ' };
        default:
            return { icon: IconInfoCircle, bg: 'bg-gray-100', text: 'text-gray-600', label: 'อื่นๆ' };
    }
};

// Change item component
const ChangeItem: React.FC<{ change: ProviderChange }> = ({ change }) => {
    const config = getChangeConfig(change.changeType);
    const Icon = config.icon;

    return (
        <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all">
            <div className={`p-3 rounded-xl ${config.bg} shrink-0`}>
                <Icon size={22} className={config.text} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
                        {config.label}
                    </span>
                    <span className="text-sm text-gray-500 font-medium">{change.providerName}</span>
                    {change.serviceId && (
                        <span className="text-xs text-gray-400">#{change.serviceId}</span>
                    )}
                </div>
                <h4 className="text-base font-semibold text-gray-800 mb-1">{change.serviceName}</h4>
                {change.details && (
                    <p className="text-sm text-gray-600">{change.details}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                    {moment(change.timestamp).tz(TIMEZONE).format('DD/MM/YYYY HH:mm น.')} • {moment(change.timestamp).tz(TIMEZONE).fromNow()}
                </p>
            </div>
        </div>
    );
};

const ProviderChangesView: React.FC = () => {
    const {
        loading,
        changes,
        totalCount,
        filteredCount,
        changeTypeOptions,
        providerOptions,
        dateRange,
        selectedChangeTypes,
        selectedProviders,
        searchQuery,
        setDateRange,
        setSelectedChangeTypes,
        setSelectedProviders,
        setSearchQuery,
        refreshData
    } = useProviderChangesViewModel();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="page-content bg-gray-50 min-h-screen p-6">
            {/* Header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">การเปลี่ยนแปลงจาก Provider</h1>
                    <p className="text-gray-500 text-sm mt-0.5">
                        แสดง {filteredCount} จาก {totalCount} รายการ
                    </p>
                </div>
                <button
                    onClick={refreshData}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                >
                    <IconRefresh size={18} />
                    <span>รีเฟรช</span>
                </button>
            </div>

            {/* Filters */}
            <Card className="border-none shadow-sm rounded-xl mb-6">
                <CardBody className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <IconFilter size={18} className="text-gray-500" />
                        <span className="font-medium text-gray-700">ตัวกรอง</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Date Range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1.5">ช่วงวันที่</label>
                            <Flatpickr
                                value={dateRange}
                                options={{
                                    mode: 'range',
                                    dateFormat: 'd/m/Y',
                                    maxDate: 'today'
                                }}
                                onChange={(dates) => setDateRange(dates)}
                                className="form-input w-full rounded-lg border-gray-200"
                                placeholder="เลือกช่วงวันที่"
                            />
                        </div>

                        {/* Change Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1.5">ประเภทการเปลี่ยนแปลง</label>
                            <Select
                                isMulti
                                options={changeTypeOptions}
                                value={changeTypeOptions.filter(opt => selectedChangeTypes.includes(opt.value))}
                                onChange={(selected) => setSelectedChangeTypes(selected ? selected.map(s => s.value) : [])}
                                placeholder="เลือกประเภท..."
                                classNamePrefix="react-select"
                                className="text-sm"
                            />
                        </div>

                        {/* Provider */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1.5">Provider</label>
                            <Select
                                isMulti
                                options={providerOptions}
                                value={providerOptions.filter(opt => selectedProviders.includes(opt.value))}
                                onChange={(selected) => setSelectedProviders(selected ? selected.map(s => s.value) : [])}
                                placeholder="เลือก Provider..."
                                classNamePrefix="react-select"
                                className="text-sm"
                            />
                        </div>

                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1.5">ค้นหา</label>
                            <div className="relative">
                                <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="ชื่อบริการ, Provider..."
                                    className="form-input pl-10 rounded-lg border-gray-200"
                                />
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Changes List */}
            <div className="space-y-3">
                {changes.length > 0 ? (
                    changes.map(change => <ChangeItem key={change.id} change={change} />)
                ) : (
                    <Card className="border-none shadow-sm rounded-xl">
                        <CardBody className="p-8 text-center">
                            <IconInfoCircle size={48} className="mx-auto text-gray-300 mb-3" />
                            <h3 className="text-lg font-medium text-gray-600 mb-1">ไม่พบข้อมูล</h3>
                            <p className="text-sm text-gray-400">ไม่พบการเปลี่ยนแปลงที่ตรงกับเงื่อนไขที่เลือก</p>
                        </CardBody>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ProviderChangesView;
