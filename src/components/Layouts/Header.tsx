import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useThemeStore } from '@/store/theme';
import { useAuthStore } from '@/store/auth';
import { useShallow } from 'zustand/react/shallow';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import Dropdown from '../Dropdown';
import IconMenu from '../Icon/IconMenu';
import IconXCircle from '../Icon/IconXCircle';
import IconInfoCircle from '../Icon/IconInfoCircle';
import IconBellBing from '../Icon/IconBellBing';
import IconUser from '../Icon/IconUser';
import IconLogout from '../Icon/IconLogout';
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import IconCaretDown from '../Icon/IconCaretDown';
import IconMenuApps from '../Icon/Menu/IconMenuApps';
import IconMenuComponents from '../Icon/Menu/IconMenuComponents';
import IconMenuElements from '../Icon/Menu/IconMenuElements';
import IconMenuDatatables from '../Icon/Menu/IconMenuDatatables';
import IconMenuForms from '../Icon/Menu/IconMenuForms';
import IconMenuPages from '../Icon/Menu/IconMenuPages';
import IconMenuMore from '../Icon/Menu/IconMenuMore';
import IconShoppingCart from '../Icon/IconShoppingCart';
import IconMenuDocumentation from '../Icon/Menu/IconMenuDocumentation';
import Tippy from '@tippyjs/react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { paths } from '@/router/paths';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isRtl = useThemeStore(useShallow((state) => (state.rtlClass === 'rtl' ? true : false)));

    const { appName, semidark, menu, locale, languageList, toggleSidebar, toggleRTL } = useThemeStore(
        useShallow((state) => ({
            appName: state.appName,
            locale: state.locale,
            semidark: state.semidark,
            menu: state.menu,
            theme: state.theme,
            languageList: state.languageList,
            toggleSidebar: state.toggleSidebar,
            toggleRTL: state.toggleRTL,
            toggleTheme: state.toggleTheme,
        }))
    );
    const { signout } = useAuthStore(
        useShallow((state) => ({
            signout: state.signout,
        }))
    );

    function createMarkup(messages: any) {
        return { __html: messages };
    }
    const [messages, setMessages] = useState([
        {
            id: 1,
            image: '<span className="grid place-content-center w-9 h-9 rounded-full bg-success-light dark:bg-success text-success dark:text-success-light"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></span>',
            title: 'Congratulations!',
            message: 'Your OS has been updated.',
            time: '1hr',
        },
        {
            id: 2,
            image: '<span className="grid place-content-center w-9 h-9 rounded-full bg-info-light dark:bg-info text-info dark:text-info-light"><svg g xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></span>',
            title: 'Did you know?',
            message: 'You can switch between artboards.',
            time: '2hr',
        },
        {
            id: 3,
            image: '<span className="grid place-content-center w-9 h-9 rounded-full bg-danger-light dark:bg-danger text-danger dark:text-danger-light"> <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>',
            title: 'Something went wrong!',
            message: 'Send Reposrt',
            time: '2days',
        },
        {
            id: 4,
            image: '<span className="grid place-content-center w-9 h-9 rounded-full bg-warning-light dark:bg-warning text-warning dark:text-warning-light"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">    <circle cx="12" cy="12" r="10"></circle>    <line x1="12" y1="8" x2="12" y2="12"></line>    <line x1="12" y1="16" x2="12.01" y2="16"></line></svg></span>',
            title: 'Warning',
            message: 'Your password strength is low.',
            time: '5days',
        },
    ]);

    const removeMessage = (value: number) => {
        setMessages(messages.filter((user) => user.id !== value));
    };

    const [notifications, setNotifications] = useState([
        {
            id: 1,
            profile: 'user-profile.jpeg',
            message: '<strong className="text-sm mr-1">John Doe</strong>invite you to <strong>Prototyping</strong>',
            time: '45 min ago',
        },
        {
            id: 2,
            profile: 'profile-34.jpeg',
            message: '<strong className="text-sm mr-1">Adam Nolan</strong>mentioned you to <strong>UX Basics</strong>',
            time: '9h Ago',
        },
        {
            id: 3,
            profile: 'profile-16.jpeg',
            message: '<strong className="text-sm mr-1">Anna Morgan</strong>Upload a file',
            time: '9h Ago',
        },
    ]);

    const removeNotification = (value: number) => {
        setNotifications(notifications.filter((user) => user.id !== value));
    };

    const setLocale = (flag: string) => {
        setFlag(flag);
        if (flag.toLowerCase() === 'ae') {
            toggleRTL('rtl');
        } else {
            toggleRTL('ltr');
        }
    };
    const [flag, setFlag] = useState(locale);

    const { t } = useTranslation();

    const onSignOut = () => {
        signout().then((res) => {
            if (res.success) {
                withReactContent(Swal)
                    .fire({
                        icon: 'success',
                        title: t('navbar.signoutSuccess'),
                        html: (
                            <div className="text-white">
                                <p className="text-base font-bold leading-normal text-white-dark text-center capitalize">{res.data?.message}</p>
                            </div>
                        ),
                        showCancelButton: false,
                        confirmButtonText: t('navbar.signoutCTA'),
                        padding: '2em',
                        customClass: {
                            popup: 'sweet-alerts',
                            actions: 'flex flex-row-reverse',
                        },
                        allowOutsideClick: false,
                    })
                    .then(({ isConfirmed }) => {
                        if (isConfirmed) {
                            navigate(paths.auth.signin);
                        }
                    });
            } else {
                withReactContent(Swal).fire({
                    icon: 'error',
                    title: t('navbar.signoutFailed'),
                    html: (
                        <div className="text-white">
                            <p className="text-base font-bold leading-normal text-white-dark text-center capitalize">{res.data?.message}</p>
                        </div>
                    ),
                    showCancelButton: false,
                    confirmButtonText: t('navbar.signoutCTA'),
                    padding: '2em',
                    customClass: {
                        popup: 'sweet-alerts',
                        actions: 'flex flex-row-reverse',
                    },
                    allowOutsideClick: false,
                });
            }
        });
    };

    useEffect(() => {
        const selector = document.querySelector('ul.horizontal-menu a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const all: any = document.querySelectorAll('ul.horizontal-menu .nav-link.active');
            for (let i = 0; i < all.length; i++) {
                all[0]?.classList.remove('active');
            }
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link');
                if (ele) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele?.classList.add('active');
                    });
                }
            }
        }
    }, [location]);

    return (
        <header className={`z-40 ${semidark && menu === 'horizontal' ? 'dark' : ''}`}>
            <div className="shadow-apple-sm">
                <div className="relative bg-meelike-primary flex w-full items-center px-4 py-2.5 dark:bg-[#1d1d1f]">
                    <div className="horizontal-logo flex lg:hidden justify-between items-center ltr:mr-2 rtl:ml-2">
                        <Link to="/" className="main-logo flex items-center shrink-0">
                            <img className="w-12 ltr:-ml-1 rtl:-mr-1 inline" src="/assets/meelike/logo/meelike-logo.png" alt="logo" />
                        </Link>
                        <div className="hidden lg:block">
                            <button
                                type="button"
                                className="collapse-icon flex-none text-meelike-dark/60 hover:text-meelike-dark dark:text-white/60 dark:hover:text-white flex lg:hidden ltr:ml-2 rtl:mr-2 p-2 rounded-full hover:bg-meelike-secondary/50 dark:hover:bg-white/10 transition-all duration-apple"
                                onClick={() => {
                                    toggleSidebar(false);
                                }}
                            >
                                <IconMenu className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="ltr:mr-2 rtl:ml-2 hidden sm:block">
                        <div className="text-meelike-dark text-xl font-semibold tracking-tight">{appName}</div>
                    </div>

                    <div className="sm:flex-1 ltr:sm:ml-0 ltr:ml-auto sm:rtl:mr-0 rtl:mr-auto flex items-center space-x-1.5 lg:space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]">
                        <div className="sm:ltr:mr-auto sm:rtl:ml-auto"></div>

                        {/* <div>
                            {theme === 'light' ? (
                                <button
                                    className={`${
                                        theme === 'light' && 'flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60'
                                    }`}
                                    onClick={() => {
                                        toggleTheme('dark');
                                    }}
                                >
                                    <IconSun />
                                </button>
                            ) : (
                                ''
                            )}
                            {theme === 'dark' && (
                                <button
                                    className={`${
                                        theme === 'dark' && 'flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60'
                                    }`}
                                    onClick={() => {
                                        toggleTheme('system');
                                    }}
                                >
                                    <IconMoon />
                                </button>
                            )}
                            {theme === 'system' && (
                                <button
                                    className={`${
                                        theme === 'system' && 'flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60'
                                    }`}
                                    onClick={() => {
                                        toggleTheme('light');
                                    }}
                                >
                                    <IconLaptop />
                                </button>
                            )}
                        </div> */}
                        <div className="block lg:hidden">
                            <button
                                type="button"
                                className="collapse-icon flex-none dark:text-[#d0d2d6] hover:text-primary dark:hover:text-primary flex lg:hidden ltr:ml-2 rtl:mr-2 p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:bg-white-light/90 dark:hover:bg-dark/60"
                                onClick={() => {
                                    toggleSidebar(false);
                                }}
                            >
                                <IconMenu className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        {/* Notifications */}
                        <div className="dropdown shrink-0">
                            <Dropdown
                                offset={[0, 8]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="relative block p-2 rounded-full bg-meelike-secondary/50 hover:bg-meelike-secondary transition-all duration-apple"
                                button={
                                    <span className="relative">
                                        <IconBellBing className="w-5 h-5 text-meelike-dark" />
                                        {notifications.length > 0 && (
                                            <span className="flex absolute -right-1 -top-1">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative flex justify-center items-center min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold px-1">
                                                    {notifications.length}
                                                </span>
                                            </span>
                                        )}
                                    </span>
                                }
                            >
                                <ul className="!py-0 text-dark dark:text-white-dark w-[320px] divide-y dark:divide-white/10 rounded-apple overflow-hidden shadow-apple-md">
                                    <li onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center px-4 py-3 justify-between bg-meelike-secondary/30">
                                            <h4 className="text-sm font-semibold text-meelike-dark">การแจ้งเตือน</h4>
                                            {notifications.length > 0 && (
                                                <span className="text-xs bg-meelike-primary text-meelike-dark px-2 py-0.5 rounded-full font-medium">
                                                    {notifications.length} ใหม่
                                                </span>
                                            )}
                                        </div>
                                    </li>
                                    {notifications.length > 0 ? (
                                        <>
                                            {notifications.map((notification) => (
                                                <li key={notification.id} className="dark:text-white-light/90 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" onClick={(e) => e.stopPropagation()}>
                                                    <div className="group flex items-center px-4 py-3">
                                                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                                            <img className="w-full h-full object-cover" alt="profile" src={`/assets/images/${notification.profile}`} />
                                                        </div>
                                                        <div className="ml-3 flex-1 min-w-0">
                                                            <p className="text-sm text-meelike-dark truncate" dangerouslySetInnerHTML={{ __html: notification.message }}></p>
                                                            <span className="text-xs text-gray-500">{notification.time}</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="ml-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            onClick={() => removeNotification(notification.id)}
                                                        >
                                                            <IconXCircle className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                            <li>
                                                <div className="p-3">
                                                    <button className="w-full py-2 text-sm font-medium text-meelike-primary hover:bg-meelike-secondary/50 rounded-apple transition-colors">
                                                        ดูการแจ้งเตือนทั้งหมด
                                                    </button>
                                                </div>
                                            </li>
                                        </>
                                    ) : (
                                        <li onClick={(e) => e.stopPropagation()}>
                                            <div className="py-8 text-center">
                                                <IconBellBing className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                                <p className="text-gray-500 text-sm">ไม่มีการแจ้งเตือน</p>
                                            </div>
                                        </li>
                                    )}
                                </ul>
                            </Dropdown>
                        </div>

                        {/* User Profile */}
                        <div className="dropdown shrink-0 flex">
                            <Dropdown
                                offset={[0, 8]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="relative group flex items-center gap-2 px-2 py-1.5 rounded-full bg-meelike-secondary/50 hover:bg-meelike-secondary transition-all duration-apple"
                                button={
                                    <>
                                        <img className="w-8 h-8 rounded-full object-cover ring-2 ring-white/50" src="/assets/images/user-profile.jpeg" alt="userProfile" />
                                        <span className="hidden md:block text-sm font-medium text-meelike-dark mr-1">Admin</span>
                                        <IconCaretDown className="w-4 h-4 text-meelike-dark/60 hidden md:block" />
                                    </>
                                }
                            >
                                <ul className="text-dark dark:text-white-dark !py-0 w-[260px] font-medium dark:text-white-light/90 rounded-apple overflow-hidden shadow-apple-md">
                                    {/* User Info */}
                                    <li className="bg-gradient-to-br from-meelike-primary/10 to-meelike-secondary">
                                        <div className="flex items-center px-4 py-4">
                                            <img className="w-12 h-12 rounded-full object-cover ring-2 ring-white" src="/assets/images/user-profile.jpeg" alt="userProfile" />
                                            <div className="ml-3 min-w-0">
                                                <h4 className="text-base font-semibold text-meelike-dark truncate">
                                                    Admin User
                                                </h4>
                                                <p className="text-sm text-meelike-dark-2 truncate">admin@meelike.com</p>
                                                <span className="inline-block mt-1 text-xs bg-meelike-primary/20 text-meelike-dark px-2 py-0.5 rounded-full">
                                                    ผู้ดูแลระบบ
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                    {/* Menu Items */}
                                    <li className="border-t border-black/5">
                                        <Link to="/account/profile" className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <IconUser className="w-5 h-5 text-meelike-dark-2 mr-3" />
                                            <span className="text-meelike-dark">โปรไฟล์</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/settings" className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <IconMenuMore className="w-5 h-5 text-meelike-dark-2 mr-3" />
                                            <span className="text-meelike-dark">ตั้งค่า</span>
                                        </Link>
                                    </li>
                                    {/* Logout */}
                                    <li className="border-t border-black/5">
                                        <button
                                            type="button"
                                            className="w-full flex items-center px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            onClick={onSignOut}
                                        >
                                            <IconLogout className="w-5 h-5 mr-3" />
                                            <span>ออกจากระบบ</span>
                                        </button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                </div>

                {/* horizontal menu */}
                <ul className="horizontal-menu hidden py-1.5 font-semibold px-6 lg:space-x-1.5 xl:space-x-8 rtl:space-x-reverse bg-white border-t border-[#ebedf2] dark:border-[#191e3a] dark:bg-black text-black dark:text-white-dark">
                    <li className="menu nav-item relative">
                        <button type="button" className="nav-link">
                            <div className="flex items-center">
                                <IconMenuDashboard className="shrink-0" />
                                <span className="px-1">{t('dashboard')}</span>
                            </div>
                            <div className="right_arrow">
                                <IconCaretDown />
                            </div>
                        </button>
                        <ul className="sub-menu">
                            <li>
                                <NavLink to="/">{t('sales')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/analytics">{t('analytics')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/finance">{t('finance')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/crypto">{t('crypto')}</NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className="menu nav-item relative">
                        <button type="button" className="nav-link">
                            <div className="flex items-center">
                                <IconMenuApps className="shrink-0" />
                                <span className="px-1">{t('apps')}</span>
                            </div>
                            <div className="right_arrow">
                                <IconCaretDown />
                            </div>
                        </button>
                        <ul className="sub-menu">
                            <li>
                                <NavLink to="/apps/chat">{t('chat')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/apps/mailbox">{t('mailbox')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/apps/todolist">{t('todo_list')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/apps/notes">{t('notes')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/apps/scrumboard">{t('scrumboard')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/apps/contacts">{t('contacts')}</NavLink>
                            </li>
                            <li className="relative">
                                <button type="button">
                                    {t('invoice')}
                                    <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-90 -rotate-90">
                                        <IconCaretDown />
                                    </div>
                                </button>
                                <ul className="rounded absolute top-0 ltr:left-[95%] rtl:right-[95%] min-w-[180px] bg-white z-[10] text-dark dark:text-white-dark dark:bg-[#1b2e4b] shadow p-0 py-2 hidden">
                                    <li>
                                        <NavLink to="/apps/invoice/list">{t('list')}</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/apps/invoice/preview">{t('preview')}</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/apps/invoice/add">{t('add')}</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/apps/invoice/edit">{t('edit')}</NavLink>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <NavLink to="/apps/calendar">{t('calendar')}</NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className="menu nav-item relative">
                        <button type="button" className="nav-link">
                            <div className="flex items-center">
                                <IconMenuComponents className="shrink-0" />
                                <span className="px-1">{t('components')}</span>
                            </div>
                            <div className="right_arrow">
                                <IconCaretDown />
                            </div>
                        </button>
                        <ul className="sub-menu">
                            <li>
                                <NavLink to="/components/tabs">{t('tabs')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/accordions">{t('accordions')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/modals">{t('modals')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/cards">{t('cards')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/carousel">{t('carousel')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/countdown">{t('countdown')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/counter">{t('counter')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/sweetalert">{t('sweet_alerts')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/timeline">{t('timeline')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/notifications">{t('notifications')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/media-object">{t('media_object')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/list-group">{t('list_group')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/pricing-table">{t('pricing_tables')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/lightbox">{t('lightbox')}</NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className="menu nav-item relative">
                        <button type="button" className="nav-link">
                            <div className="flex items-center">
                                <IconMenuElements className="shrink-0" />
                                <span className="px-1">{t('elements')}</span>
                            </div>
                            <div className="right_arrow">
                                <IconCaretDown />
                            </div>
                        </button>
                        <ul className="sub-menu">
                            <li>
                                <NavLink to="/elements/alerts">{t('alerts')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/avatar">{t('avatar')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/badges">{t('badges')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/breadcrumbs">{t('breadcrumbs')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/buttons">{t('buttons')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/buttons-group">{t('button_groups')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/color-library">{t('color_library')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/dropdown">{t('dropdown')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/infobox">{t('infobox')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/jumbotron">{t('jumbotron')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/loader">{t('loader')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/pagination">{t('pagination')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/popovers">{t('popovers')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/progress-bar">{t('progress_bar')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/search">{t('search')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/tooltips">{t('tooltips')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/treeview">{t('treeview')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/typography">{t('typography')}</NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className="menu nav-item relative">
                        <button type="button" className="nav-link">
                            <div className="flex items-center">
                                <IconMenuDatatables className="shrink-0" />
                                <span className="px-1">{t('tables')}</span>
                            </div>
                            <div className="right_arrow">
                                <IconCaretDown />
                            </div>
                        </button>
                        <ul className="sub-menu">
                            <li>
                                <NavLink to="/tables">{t('tables')}</NavLink>
                            </li>
                            <li className="relative">
                                <button type="button">
                                    {t('datatables')}
                                    <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-90 -rotate-90">
                                        <IconCaretDown />
                                    </div>
                                </button>
                                <ul className="rounded absolute top-0 ltr:left-[95%] rtl:right-[95%] min-w-[180px] bg-white z-[10] text-dark dark:text-white-dark dark:bg-[#1b2e4b] shadow p-0 py-2 hidden">
                                    <li>
                                        <NavLink to="/datatables/basic">{t('basic')}</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/datatables/advanced">{t('advanced')}</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/datatables/skin">{t('skin')}</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/datatables/order-sorting">{t('order_sorting')}</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/datatables/multi-column">{t('multi_column')}</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/datatables/multiple-tables">{t('multiple_tables')}</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/datatables/alt-pagination">{t('alt_pagination')}</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/datatables/checkbox">{t('checkbox')}</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/datatables/range-search">{t('range_search')}</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/datatables/export">{t('export')}</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/datatables/column-chooser">{t('column_chooser')}</NavLink>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li className="menu nav-item relative">
                        <button type="button" className="nav-link">
                            <div className="flex items-center">
                                <IconMenuForms className="shrink-0" />
                                <span className="px-1">{t('forms')}</span>
                            </div>
                            <div className="right_arrow">
                                <IconCaretDown />
                            </div>
                        </button>
                        <ul className="sub-menu">
                            <li>
                                <NavLink to="/forms/basic">{t('basic')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/input-group">{t('input_group')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/layouts">{t('layouts')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/validation">{t('validation')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/input-mask">{t('input_mask')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/select2">{t('select2')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/touchspin">{t('touchspin')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/checkbox-radio">{t('checkbox_and_radio')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/switches">{t('switches')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/wizards">{t('wizards')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/file-upload">{t('file_upload')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/quill-editor">{t('quill_editor')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/markdown-editor">{t('markdown_editor')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/date-picker">{t('date_and_range_picker')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/clipboard">{t('clipboard')}</NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className="menu nav-item relative">
                        <button type="button" className="nav-link">
                            <div className="flex items-center">
                                <IconMenuPages className="shrink-0" />
                                <span className="px-1">{t('pages')}</span>
                            </div>
                            <div className="right_arrow">
                                <IconCaretDown />
                            </div>
                        </button>
                        <ul className="sub-menu">
                            <li className="relative">
                                <button type="button">
                                    {t('users')}
                                    <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-90 -rotate-90">
                                        <IconCaretDown />
                                    </div>
                                </button>
                                <ul className="rounded absolute top-0 ltr:left-[95%] rtl:right-[95%] min-w-[180px] bg-white z-[10] text-dark dark:text-white-dark dark:bg-[#1b2e4b] shadow p-0 py-2 hidden">
                                    <li>
                                        <NavLink to="/account/profile">{t('profile')}</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/users/user-account-settings">{t('account_settings')}</NavLink>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <NavLink to="/pages/knowledge-base">{t('knowledge_base')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/pages/contact-us-boxed" target="_blank">
                                    {t('contact_us_boxed')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/pages/contact-us-cover" target="_blank">
                                    {t('contact_us_cover')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/pages/faq">{t('faq')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/pages/coming-soon-boxed" target="_blank">
                                    {t('coming_soon_boxed')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/pages/coming-soon-cover" target="_blank">
                                    {t('coming_soon_cover')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/pages/maintenence" target="_blank">
                                    {t('maintenence')}
                                </NavLink>
                            </li>
                            <li className="relative">
                                <button type="button">
                                    {t('error')}
                                    <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-90 -rotate-90">
                                        <IconCaretDown />
                                    </div>
                                </button>
                                <ul className="rounded absolute top-0 ltr:left-[95%] rtl:right-[95%] min-w-[180px] bg-white z-[10] text-dark dark:text-white-dark dark:bg-[#1b2e4b] shadow p-0 py-2 hidden">
                                    <li>
                                        <NavLink to="/pages/error404" target="_blank">
                                            {t('404')}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/pages/error500" target="_blank">
                                            {t('500')}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/pages/error503" target="_blank">
                                            {t('503')}
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                            <li className="relative">
                                <button type="button">
                                    {t('login')}
                                    <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-90 -rotate-90">
                                        <IconCaretDown />
                                    </div>
                                </button>
                                <ul className="rounded absolute top-0 ltr:left-[95%] rtl:right-[95%] min-w-[180px] bg-white z-[10] text-dark dark:text-white-dark dark:bg-[#1b2e4b] shadow p-0 py-2 hidden">
                                    <li>
                                        <NavLink to="/auth/cover-login" target="_blank">
                                            {t('login_cover')}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/auth/boxed-signin" target="_blank">
                                            {t('login_boxed')}
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                            <li className="relative">
                                <button type="button">
                                    {t('register')}
                                    <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-90 -rotate-90">
                                        <IconCaretDown />
                                    </div>
                                </button>
                                <ul className="rounded absolute top-0 ltr:left-[95%] rtl:right-[95%] min-w-[180px] bg-white z-[10] text-dark dark:text-white-dark dark:bg-[#1b2e4b] shadow p-0 py-2 hidden">
                                    <li>
                                        <NavLink to="/auth/cover-register" target="_blank">
                                            {t('register_cover')}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/auth/boxed-signup" target="_blank">
                                            {t('register_boxed')}
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                            <li className="relative">
                                <button type="button">
                                    {t('password_recovery')}
                                    <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-90 -rotate-90">
                                        <IconCaretDown />
                                    </div>
                                </button>
                                <ul className="rounded absolute top-0 ltr:left-[95%] rtl:right-[95%] min-w-[180px] bg-white z-[10] text-dark dark:text-white-dark dark:bg-[#1b2e4b] shadow p-0 py-2 hidden">
                                    <li>
                                        <NavLink to="/auth/cover-password-reset" target="_blank">
                                            {t('recover_id_cover')}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/auth/boxed-password-reset" target="_blank">
                                            {t('recover_id_boxed')}
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                            <li className="relative">
                                <button type="button">
                                    {t('lockscreen')}
                                    <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-90 -rotate-90">
                                        <IconCaretDown />
                                    </div>
                                </button>
                                <ul className="rounded absolute top-0 ltr:left-[95%] rtl:right-[95%] min-w-[180px] bg-white z-[10] text-dark dark:text-white-dark dark:bg-[#1b2e4b] shadow p-0 py-2 hidden">
                                    <li>
                                        <NavLink to="/auth/cover-lockscreen" target="_blank">
                                            {t('unlock_cover')}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/auth/boxed-lockscreen" target="_blank">
                                            {t('unlock_boxed')}
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li className="menu nav-item relative">
                        <button type="button" className="nav-link">
                            <div className="flex items-center">
                                <IconMenuMore className="shrink-0" />
                                <span className="px-1">{t('more')}</span>
                            </div>
                            <div className="right_arrow">
                                <IconCaretDown />
                            </div>
                        </button>
                        <ul className="sub-menu">
                            <li>
                                <NavLink to="/dragndrop">{t('drag_and_drop')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/charts">{t('charts')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/font-icons">{t('font_icons')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/widgets">{t('widgets')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="https://vristo.sbthemes.com" target="_blank">
                                    {t('documentation')}
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </header>
    );
};

export default Header;
