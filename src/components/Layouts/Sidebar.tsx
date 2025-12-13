import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { useProfileStore } from '@/store/profile';
import { useThemeStore } from '@/store/theme';
import { useShallow } from 'zustand/react/shallow';
import { useState, useEffect, Fragment } from 'react';
import IconCaretsDown from '../Icon/IconCaretsDown';
import IconMinus from '../Icon/IconMinus';
import IconLogout from '../Icon/IconLogout';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

import { paths } from '@/router/paths';
import { SidebarMenu } from '@/Configuration/sidebar-menu';

const Sidebar = () => {
    const navigate = useNavigate();
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const [errorSubMenu, setErrorSubMenu] = useState(false);
    const { semidark, sidebar, toggleSidebar } = useThemeStore(
        useShallow(state => ({
            semidark: state.semidark,
            sidebar: state.sidebar,
            toggleSidebar: state.toggleSidebar
        }))
    );
    const { profile } = useProfileStore(
        useShallow(state => ({
            profile: state.data
        }))
    );
    const role = profile?.role;
    const location = useLocation();
    const { t } = useTranslation();
    const toggleMenu = (value: string) => {
        setCurrentMenu(oldValue => {
            return oldValue === value ? '' : value;
        });
    };

    const { signOut } = useAuthStore(
        useShallow(state => ({
            signOut: state.signout
        }))
    );

    const onlySuperAdmin = ['รายงาน', paths.report.order, paths.report.payment, paths.report.user, paths.report.profit, paths.report.ticket, paths.report.service];
    const sidebarMenu = SidebarMenu.filter(item => {
        if (typeof item === 'string') {
            if (onlySuperAdmin.includes(item)) {
                return role === 'SUPER_ADMIN';
            } else {
                return true;
            }
        } else if (onlySuperAdmin.includes(item.path)) {
            return role === 'SUPER_ADMIN';
        }

        return true;
    });

    const onSignOut = () => {
        signOut().then(response => {
            if (response.success) {
                withReactContent(Swal)
                    .fire({
                        icon: 'success',
                        title: 'ลงชื่อออก',
                        html: (
                            <div className='text-white'>
                                <p className='text-base font-bold leading-normal text-white-dark text-center capitalize'>{response?.data?.message || 'ลงชื่อออกสำเร็จ'}</p>
                            </div>
                        ),
                        showCancelButton: false,
                        confirmButtonText: 'ปิด',
                        padding: '2em',
                        customClass: {
                            popup: 'sweet-alerts',
                            actions: 'flex flex-row-reverse'
                        },
                        allowOutsideClick: false
                    })
                    .then(({ isConfirmed }) => {
                        if (isConfirmed) {
                            navigate(paths.auth.signin);
                        }
                    });
            } else {
                withReactContent(Swal).fire({
                    icon: 'error',
                    title: 'Sign Out',
                    html: (
                        <div className='text-white'>
                            <p className='text-base font-bold leading-normal text-white-dark text-center capitalize'>{response?.data?.message || 'Something went wrong, please try again later.'}</p>
                        </div>
                    ),
                    showCancelButton: false,
                    confirmButtonText: 'Close',
                    padding: '2em',
                    customClass: {
                        popup: 'sweet-alerts',
                        actions: 'flex flex-row-reverse'
                    },
                    allowOutsideClick: false
                });
            }
        });
    };

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        if (window.innerWidth < 1024 && sidebar) {
            toggleSidebar(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    return (
        <Fragment>
            <div className={semidark ? 'dark' : ''}>
                <nav
                    className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-apple-md z-50 transition-all duration-300 ${semidark ? 'text-white-dark' : ''
                        }`}
                >
                    <div className='bg-white dark:bg-[#1d1d1f] h-full border-r border-black/5 dark:border-white/10'>
                        <div className='flex justify-between items-center px-5 py-4'>
                            <NavLink to='/' className='main-logo flex items-center shrink-0 max-w-full'>
                                <img className='h-10 flex-none' src='/assets/meelike/logo/meelike-logo.png' alt='logo' />
                                <span className='text-xl ltr:ml-2 rtl:mr-2 font-semibold align-middle lg:inline text-meelike-dark dark:text-white'>Admin</span>
                            </NavLink>

                            <button
                                type='button'
                                className='collapse-icon w-8 h-8 rounded-full flex items-center justify-center hover:bg-meelike-secondary/50 dark:hover:bg-white/10 text-meelike-dark/60 dark:text-white/60 transition-all duration-apple'
                                onClick={() => toggleSidebar(false)}
                            >
                                <IconCaretsDown className='m-auto rotate-90 w-4 h-4' />
                            </button>
                        </div>

                        <PerfectScrollbar className='h-[calc(100vh-72px)] relative px-2'>
                            {/* <div className="px-4 mb-6">
                                <button className="btn bg-clink-success text-white text-center shadow w-full hover:opacity-60">
                                    <IconShoppingCart />
                                    <span className="pl-2">{t('sidebar.newOrder')}</span>
                                </button>
                            </div> */}

                            <ul className='relative font-medium space-y-0.5 py-2'>
                                {sidebarMenu.map((item, idx) => {
                                    return (
                                        <Fragment key={typeof item === 'string' ? item + (idx + 1) + 'sidebar-header' : item.title.toLowerCase()}>
                                            {typeof item === 'string' ? (
                                                <Fragment>
                                                    <h2 key={item + (idx + 1) + 'sidebar-header'} className='py-3 px-3 flex items-center text-xs uppercase font-semibold text-meelike-dark/50 dark:text-white/40 tracking-wider mt-4 first:mt-0'>
                                                        <span>{t(item)}</span>
                                                    </h2>
                                                </Fragment>
                                            ) : (
                                                <li className={'menu nav-item sidebar-item'}>
                                                    <NavLink to={item.path} className='nav-link group'>
                                                        <div className='flex items-center'>
                                                            {item.icon}
                                                            <span className='ltr:pl-3 rtl:pr-3'>{item?.title}</span>
                                                        </div>
                                                    </NavLink>
                                                </li>
                                            )}
                                        </Fragment>
                                    );
                                })}

                                {/* Sign out removed - authentication bypassed */}
                            </ul>
                        </PerfectScrollbar>
                    </div>
                </nav>
            </div >

            <style>{`
                .sidebar .nav-item a div:first-child svg,
                .sidebar .nav-item button div:first-child svg {
                    color: #473B30 !important;
                    opacity: 0.6;
                    transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
                }

                .sidebar .nav-item > button, .sidebar .nav-item > a {
                    color: #473B30 !important;
                    transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
                }

                .sidebar .nav-item:hover > a,
                .sidebar .nav-item:hover > button {
                    background-color: rgba(253, 232, 189, 0.5) !important;
                }

                .sidebar .nav-item:hover a div:first-child svg,
                .sidebar .nav-item:hover button div:first-child svg {
                    opacity: 1;
                }

                .sidebar .nav-item a.active div:first-child svg,
                .sidebar .nav-item button.active div:first-child svg {
                    color: #473B30 !important;
                    opacity: 1;
                }

                .sidebar .nav-item > a.active,
                .sidebar .nav-item > button.active {
                    background-color: #FDE8BD !important;
                    color: #473B30 !important;
                    font-weight: 500;
                }
            `}</style>
        </Fragment >
    );
};

export default Sidebar;
