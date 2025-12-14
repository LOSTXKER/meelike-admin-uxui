import React from 'react';
import { useDashboardViewModel, Alert, ProviderChange } from './ViewModel';
import { Card, CardBody } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import moment from 'moment-timezone';
import {
    IconShoppingCart,
    IconUsers,
    IconCurrencyDollar,
    IconTicket,
    IconTrendingUp,
    IconTrendingDown,
    IconAlertTriangle,
    IconAlertCircle,
    IconInfoCircle,
    IconRefresh,
    IconChevronRight,
    IconPlugConnectedX,
    IconPlugConnected,
    IconCurrencyBaht,
    IconClock,
    IconPlus,
    IconTrash
} from '@tabler/icons-react';

const TIMEZONE = 'Asia/Bangkok';

// Helper component for stat cards
const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: number;
    color: string;
}> = ({ title, value, icon, trend, color }) => {
    const isPositive = trend !== undefined && trend >= 0;
    return (
        <Card className="border-none shadow-sm rounded-xl overflow-hidden h-full">
            <CardBody className="p-5">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">{title}</p>
                        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
                        {trend !== undefined && (
                            <div className={`flex items-center mt-2 text-sm ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                                {isPositive ? <IconTrendingUp size={16} /> : <IconTrendingDown size={16} />}
                                <span className="ml-1">{Math.abs(trend)}% จากเมื่อวาน</span>
                            </div>
                        )}
                    </div>
                    <div className={`p-3 rounded-xl ${color}`}>
                        {icon}
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

// Helper component for alert cards
const AlertCard: React.FC<{ alert: Alert }> = ({ alert }) => {
    const bgColor = alert.type === 'error' ? 'bg-red-50 border-red-200' :
        alert.type === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200';
    const iconColor = alert.type === 'error' ? 'text-red-500' :
        alert.type === 'warning' ? 'text-amber-500' : 'text-blue-500';
    const Icon = alert.type === 'error' ? IconAlertCircle :
        alert.type === 'warning' ? IconAlertTriangle : IconInfoCircle;

    return (
        <NavLink to={alert.link || '#'} className="block">
            <div className={`p-4 rounded-xl border ${bgColor} hover:shadow-md transition-all cursor-pointer`}>
                <div className="flex items-start gap-3">
                    <div className={`${iconColor} mt-0.5`}>
                        <Icon size={20} />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-800">{alert.title}</h4>
                            {alert.count && (
                                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${alert.type === 'error' ? 'bg-red-500 text-white' :
                                    alert.type === 'warning' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'
                                    }`}>
                                    {alert.count}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                    </div>
                    <IconChevronRight size={20} className="text-gray-400" />
                </div>
            </div>
        </NavLink>
    );
};

// Helper component for provider change items
const ProviderChangeItem: React.FC<{ change: ProviderChange }> = ({ change }) => {
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

    const config = getChangeConfig(change.changeType);
    const Icon = config.icon;

    return (
        <div className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-b-0">
            <div className={`p-2.5 rounded-xl ${config.bg}`}>
                <Icon size={18} className={config.text} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
                        {config.label}
                    </span>
                    <span className="text-xs text-gray-400">{change.providerName}</span>
                </div>
                <p className="text-sm text-gray-800 mt-1 font-medium">{change.serviceName}</p>
                {change.details && (
                    <p className="text-xs text-gray-500 mt-0.5">{change.details}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">{moment(change.timestamp).tz(TIMEZONE).fromNow()}</p>
            </div>
        </div>
    );
};

const DashboardView: React.FC = () => {
    const { loading, stats, alerts, providerChanges, refreshData } = useDashboardViewModel();

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
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">ภาพรวม Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {moment().tz(TIMEZONE).format('dddd, D MMMM YYYY')} • อัปเดตล่าสุด: {moment().tz(TIMEZONE).format('HH:mm น.')}
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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="ออร์เดอร์วันนี้"
                    value={stats?.ordersToday.toLocaleString() || 0}
                    icon={<IconShoppingCart size={24} className="text-white" />}
                    trend={stats?.ordersTrend}
                    color="bg-blue-500"
                />
                <StatCard
                    title="ผู้ใช้ใหม่วันนี้"
                    value={stats?.newUsersToday.toLocaleString() || 0}
                    icon={<IconUsers size={24} className="text-white" />}
                    trend={stats?.usersTrend}
                    color="bg-green-500"
                />
                <StatCard
                    title="รายได้วันนี้"
                    value={`฿${stats?.revenueToday.toLocaleString() || 0}`}
                    icon={<IconCurrencyDollar size={24} className="text-white" />}
                    trend={stats?.revenueTrend}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Ticket ที่ Active"
                    value={stats?.activeTickets.toLocaleString() || 0}
                    icon={<IconTicket size={24} className="text-white" />}
                    trend={stats?.ticketsTrend}
                    color="bg-amber-500"
                />
            </div>

            {/* Alerts & Provider Changes Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Alerts Section */}
                <Card className="border-none shadow-sm rounded-xl overflow-hidden">
                    <CardBody className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">การแจ้งเตือน</h2>
                            <span className="text-xs text-gray-400">{alerts.length} รายการ</span>
                        </div>
                        <div className="space-y-3">
                            {alerts.length > 0 ? (
                                alerts.map(alert => <AlertCard key={alert.id} alert={alert} />)
                            ) : (
                                <div className="text-center py-8 text-gray-400">
                                    <IconInfoCircle size={40} className="mx-auto mb-2" />
                                    <p>ไม่มีการแจ้งเตือนในขณะนี้</p>
                                </div>
                            )}
                        </div>
                    </CardBody>
                </Card>

                {/* Provider Changes Section */}
                <Card className="border-none shadow-sm rounded-xl overflow-hidden">
                    <CardBody className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">การเปลี่ยนแปลงจาก Provider</h2>
                            <NavLink to="/changes" className="text-sm text-primary hover:underline">ดูทั้งหมด</NavLink>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                            {providerChanges.length > 0 ? (
                                providerChanges.map(change => <ProviderChangeItem key={change.id} change={change} />)
                            ) : (
                                <div className="text-center py-8 text-gray-400">
                                    <IconInfoCircle size={40} className="mx-auto mb-2" />
                                    <p>ไม่มีการเปลี่ยนแปลงจาก Provider</p>
                                </div>
                            )}
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default DashboardView;
