import IconMenuDocumentation from '@/components/Icon/Menu/IconMenuDocumentation';
import IconUsersGroup from '@/components/Icon/IconUsersGroup';
import IconMessage from '@/components/Icon/IconMessage';
import IconUser from '@/components/Icon/IconUser';
import IconCoffee from '@/components/Icon/IconCoffee';
import IconShieldStar from '@/components/Icon/IconShieldStar';
import IconListCheck from '@/components/Icon/IconListCheck';
import IconTag from '@/components/Icon/IconTag';
import IconDollarSignCircle from '@/components/Icon/IconDollarSignCircle';
import IconChartSquare from '@/components/Icon/IconChartSquare';
import IconMenuCharts from '@/components/Icon/Menu/IconMenuCharts';
import IconBarChart from '@/components/Icon/IconBarChart';

import IconHome from '@/components/Icon/IconHome';

import { paths } from '@/router/paths';
import IconPlusCircle from '@/components/Icon/IconPlusCircle';

export const SidebarMenu: any[] = [
    'แดชบอร์ด',
    {
        icon: <IconHome className='group-hover:!text-gray-600 shrink-0' />,
        path: paths.dashboard,
        title: 'ภาพรวม'
    },
    'ออร์เดอร์',
    {
        icon: <IconMenuDocumentation className='group-hover:!text-gray-600 shrink-0' />,
        path: paths.orders.list,
        title: 'รายการออร์เดอร์',
        permission: 'ORDER_VIEW'
    },
    'ผู้ใช้งาน',
    {
        icon: <IconUsersGroup className='group-hover:!text-gray-600 shrink-0' />,
        path: paths.users.list,
        title: 'ผู้ใช้งานทั้งหมด',
        permission: 'ORDER_VIEW'
    },
    'การเงิน',
    {
        icon: <IconDollarSignCircle className='group-hover:!text-gray-600 shrink-0' />,
        path: paths.wallet.payment,
        title: 'การเติมเงิน'
    },
    {
        icon: <IconPlusCircle className='group-hover:!text-gray-600 shrink-0' />,
        path: paths.wallet.topupBonusConfig,
        title: 'โบนัสเติมเงิน'
    },
    'แนะนำเพื่อน',
    {
        icon: <IconMessage className='group-hover:!text-gray-600 shrink-0' />,
        path: paths.affiliate.overview,
        title: 'Affiliate'
    },
    {
        icon: <IconMessage className='group-hover:!text-gray-600 shrink-0' />,
        path: paths.affiliate.referrals,
        title: 'Referrals'
    },
    {
        icon: <IconMessage className='group-hover:!text-gray-600 shrink-0' />,
        path: paths.affiliate.payouts,
        title: 'Payouts'
    },
    'บริการ',
    {
        icon: <IconListCheck className='group-hover:!text-gray-600 shrink-0' />,
        path: paths.services.management,
        title: 'จัดการบริการ'
    },
    {
        icon: <IconCoffee className='group-hover:!text-gray-600 shrink-0' />,
        path: paths.provider.list,
        title: 'ผู้ให้บริการ'
    },
    {
        icon: <IconChartSquare className='group-hover:!text-gray-600 shrink-0' />,
        path: paths.provider.changes,
        title: 'การเปลี่ยนแปลง Provider'
    },
    'ตั๋ว',
    {
        icon: <IconTag className='group-hover:!text-gray-600 shrink-0' />,
        path: paths.tickets.list,
        title: 'รายการตั๋ว'
    },
    'ตั้งค่า',
    {
        icon: <IconUser className='group-hover:!text-gray-600 shrink-0' />,
        path: paths.adminManagement.list,
        title: 'จัดการผู้ใช้งาน'
    },
    'รายงาน',
    {
        icon: <IconChartSquare className='group-hover:!text-gray-600 shrink-0' />,
        path: paths.report.order,
        title: 'รายงานออร์เดอร์'
    },
    {
        icon: <IconMenuCharts className='group-hover:!text-gray-600 shrink-0' />,
        path: paths.report.payment,
        title: 'รายงานการจ่ายเงิน'
    },
    {
        icon: <IconBarChart className='group-hover:!text-gray-600 shrink-0' />,
        path: paths.report.profit,
        title: 'รายงานกำไร'
    },
    {
        icon: <IconTag className='group-hover:!text-gray-600 shrink-0' />,
        path: paths.report.ticket,
        title: 'รายงานตั๋ว'
    },
    {
        icon: <IconUser className='group-hover:!text-gray-600 shrink-0' />,
        path: paths.report.user,
        title: 'รายงานผู้ใช้งาน'
    },
    {
        icon: <IconListCheck className='group-hover:!text-gray-600 shrink-0' />,
        path: paths.report.service,
        title: 'รายงานบริการ'
    },
    {
        icon: <IconShieldStar className='group-hover:!text-gray-600 shrink-0' />,
        path: paths.report.serviceCategory,
        title: 'รายงานหมวดหมู่บริการ'
    },
    'ออกจากระบบ'
];
