// import { Navigate } from 'react-router-dom';
import { paths } from './paths';

// *C-Link Software Center Routes
import IndexView from '@/pages/Index/View';
import { ProtectedRoute } from './protected';
import SignIn from '@/pages/Auth/SignIn/View';
import ForgotPassword from '@/pages/Auth/ForgotPassword/View';
import ChangePassword from '@/pages/Auth/ChangePassword/View';
import AdminManagementListView from '@/pages/AdminManagement/List/View';
import ProviderManagementView from '@/pages/Provider/List/View';
import ServiceCategoryView from '@/pages/ServiceCategory/List/View';
import ServicesListView from '@/pages/Services/List/View';
import ServiceOrderingPositionView from '@/pages/Services/OrderingPosition/View';
import OrdersListView from '@/pages/Orders/List/View';
import OrderExportView from '@/pages/Orders/Export/View';
import UsersListView from '@/pages/Users/List/View';
import AffiliateOverviewView from '@/pages/Affiliate/Overview/View';
import AffiliateRelationshipView from '@/pages/Affiliate/Relationship/View';
import AffiliatePayoutsView from '@/pages/Affiliate/Payouts/View';
import Error404 from '../pages/Pages/Error404';
import TicketListView from '@/pages/Tickets/List/View';
import TicketDetailView from '@/pages/Tickets/Detail/View';
import WalletPaymentListView from '@/pages/Wallet/Payment/List/View';
import WalletPaymentExportView from '@/pages/Wallet/PaymentExport/View';
import WalletTopupBonusConfigListView from '@/pages/Wallet/TopupBonusConfig/List/View';
import OrderReportView from '@/pages/Report/Order/View';
import PaymentReportView from '@/pages/Report/Payment/View';
import ProfitReportView from '@/pages/Report/Profit/View';
import TicketReportView from '@/pages/Report/Ticket/View';
import UserReportView from '@/pages/Report/User/View';
import ServiceReportView from '@/pages/Report/Service/View';
import ServiceCategoryReportView from '@/pages/Report/ServiceCategory/View';

const routes = [
    {
        path: paths.root,
        element: (
            <ProtectedRoute>
                <IndexView />
            </ProtectedRoute>
        )
    },
    {
        path: paths.auth.signin,
        element: <SignIn />,
        layout: 'blank'
    },
    {
        path: paths.auth.forgotPassword,
        element: <ForgotPassword />,
        layout: 'blank'
    },
    {
        path: '/change-password',
        element: <ChangePassword />,
        layout: 'blank'
    },
    {
        path: paths.adminManagement.list,
        element: (
            <ProtectedRoute>
                <AdminManagementListView />
            </ProtectedRoute>
        )
    },
    {
        path: paths.provider.list,
        element: (
            <ProtectedRoute>
                <ProviderManagementView />
            </ProtectedRoute>
        )
    },
    {
        path: paths.service.category.list,
        element: (
            <ProtectedRoute>
                <ServiceCategoryView />
            </ProtectedRoute>
        )
    },
    {
        path: paths.services.list,
        element: (
            <ProtectedRoute>
                <ServicesListView />
            </ProtectedRoute>
        )
    },
    {
        path: paths.services.orderingPosition,
        element: (
            <ProtectedRoute>
                <ServiceOrderingPositionView />
            </ProtectedRoute>
        )
    },
    {
        path: paths.orders.list,
        element: (
            <ProtectedRoute>
                <OrdersListView />
            </ProtectedRoute>
        )
    },
    {
        path: paths.orders.export,
        element: (
            <ProtectedRoute>
                <OrderExportView />
            </ProtectedRoute>
        )
    },
    {
        path: paths.users.list,
        element: (
            <ProtectedRoute>
                <UsersListView />
            </ProtectedRoute>
        )
    },
    {
        path: paths.affiliate.overview,
        element: (
            <ProtectedRoute>
                <AffiliateOverviewView />
            </ProtectedRoute>
        )
    },
    {
        path: paths.affiliate.referrals,
        element: (
            <ProtectedRoute>
                <AffiliateRelationshipView />
            </ProtectedRoute>
        )
    },
    {
        path: paths.affiliate.payouts,
        element: (
            <ProtectedRoute>
                <AffiliatePayoutsView />
            </ProtectedRoute>
        )
    },
    {
        path: paths.tickets.list,
        element: (
            <ProtectedRoute>
                <TicketListView />
            </ProtectedRoute>
        )
    },
    {
        path: paths.tickets.detail(':ticketId'),
        element: (
            <ProtectedRoute>
                <TicketDetailView />
            </ProtectedRoute>
        )
    },
    {
        path: paths.wallet.payment,
        element: (
            <ProtectedRoute>
                <WalletPaymentListView />
            </ProtectedRoute>
        )
    },
    {
        path: paths.wallet.paymentExport,
        element: (
            <ProtectedRoute>
                <WalletPaymentExportView />
            </ProtectedRoute>
        )
    },
    {
        path: paths.wallet.topupBonusConfig,
        element: (
            <ProtectedRoute>
                <WalletTopupBonusConfigListView />
            </ProtectedRoute>
        )
    },
    {
        path: paths.report.order,
        element: (
            <ProtectedRoute>
                <OrderReportView />
            </ProtectedRoute>
        )
    },
    {
        path: paths.report.payment,
        element: (
            <ProtectedRoute>
                <PaymentReportView />
            </ProtectedRoute>
        )
    },
    {
        path: paths.report.profit,
        element: (
            <ProtectedRoute>
                <ProfitReportView />
            </ProtectedRoute>
        )
    },
    {
        path: paths.report.ticket,
        element: (
            <ProtectedRoute>
                <TicketReportView />
            </ProtectedRoute>
        )
    },
    {
        path: paths.report.user,
        element: (
            <ProtectedRoute>
                <UserReportView />
            </ProtectedRoute>
        )
    },
    {
        path: paths.report.service,
        element: (
            <ProtectedRoute>
                <ServiceReportView />
            </ProtectedRoute>
        )
    },
    {
        path: paths.report.serviceCategory,
        element: (
            <ProtectedRoute>
                <ServiceCategoryReportView />
            </ProtectedRoute>
        )
    },
    {
        path: '*',
        element: <Error404 />,
        layout: 'blank'
    }
];

export { routes };
