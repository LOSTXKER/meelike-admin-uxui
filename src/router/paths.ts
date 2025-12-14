export const paths = {
    root: '/',
    dashboard: '/dashboard',
    auth: {
        signin: '/auth/signin',
        register: '/auth/register',
        referral: '/referral',
        forgotPassword: '/auth/forgot-password',
    },
    users: {
        list: '/users',
    },
    affiliate: {
        overview: '/affiliate/overview',
        referrals: '/affiliate/referrals',
        payouts: '/affiliate/payouts',
    },
    adminManagement: {
        list: '/admin-management',
    },
    provider: {
        list: '/provider',
        changes: '/changes',
    },
    services: {
        list: '/services',
        orderingPosition: '/services/ordering-position',
        management: '/services/management',
    },
    orders: {
        list: '/orders',
        export: '/orders/export',
    },
    tickets: {
        list: '/tickets',
        detail: (ticketId: string) => `/tickets/${ticketId}`,
    },
    wallet: {
        payment: '/wallet/payment',
        paymentExport: '/wallet/payment/export',
        topupBonusConfig: '/wallet/topup-bonus-config',
    },
    report: {
        order: '/report/order',
        payment: '/report/payment',
        profit: '/report/profit',
        ticket: '/report/ticket',
        user: '/report/user',
        service: '/report/service',
        serviceCategory: '/report/service-category',
    },
};
