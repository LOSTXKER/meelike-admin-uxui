import { create } from 'zustand';
import i18next from 'i18next';
import themeConfig from '@/theme.config';

export const defaultState = {
    appName: '' as string | JSX.Element,
    isDarkMode: false,
    mainLayout: 'app',
    theme: 'light',
    menu: 'vertical',
    layout: 'full',
    rtlClass: 'ltr',
    animation: '',
    navbar: 'navbar-sticky',
    locale: 'en',
    sidebar: false,
    pageTitle: '',
    languageList: [
        { code: 'zh', name: 'Chinese' },
        { code: 'da', name: 'Danish' },
        { code: 'en', name: 'English' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'el', name: 'Greek' },
        { code: 'hu', name: 'Hungarian' },
        { code: 'it', name: 'Italian' },
        { code: 'ja', name: 'Japanese' },
        { code: 'pl', name: 'Polish' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'ru', name: 'Russian' },
        { code: 'es', name: 'Spanish' },
        { code: 'sv', name: 'Swedish' },
        { code: 'tr', name: 'Turkish' },
    ],
    semidark: false,
};

const initialState = {
    appName: defaultState.appName,
    theme: localStorage.getItem('theme') || themeConfig.theme,
    menu: localStorage.getItem('menu') || themeConfig.menu,
    layout: localStorage.getItem('layout') || themeConfig.layout,
    rtlClass: localStorage.getItem('rtlClass') || themeConfig.rtlClass,
    animation: localStorage.getItem('animation') || themeConfig.animation,
    navbar: localStorage.getItem('navbar') || themeConfig.navbar,
    locale: localStorage.getItem('i18nextLng') || themeConfig.locale,
    isDarkMode: false,
    sidebar: localStorage.getItem('sidebar') || defaultState.sidebar,
    semidark: localStorage.getItem('semidark') || themeConfig.semidark,
    languageList: [
        { code: 'en', name: 'English' },
        {
            code: 'th',
            name: 'Thai',
        },
    ],
};

export interface ThemeStore {
    appName: string | JSX.Element;
    theme: string;
    menu: string;
    layout: string;
    rtlClass: string;
    animation: string;
    navbar: string;
    locale: string;
    isDarkMode: boolean;
    sidebar: string | boolean;
    semidark: string | boolean;
    languageList: { code: string; name: string }[];
    toggleTheme: (theme: string) => void;
    toggleMenu: (menu: string) => void;
    toggleLayout: (layout: string) => void;
    toggleRTL: (rtlClass: string) => void;
    toggleAnimation: (animation: string) => void;
    toggleNavbar: (navbar: string) => void;
    toggleSemidark: (semidark: string | boolean) => void;
    toggleLocale: (locale: string) => void;
    toggleSidebar: (sidebar: string | boolean) => void;
    setPageTitle: (pageTitle: string) => void;
    setAppName: (appName: string | JSX.Element) => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
    ...initialState, // Spread the initialState object to initialize the store's state
    toggleTheme: (payload) => {
        const theme = payload || get().theme; // Use get() to access current state
        localStorage.setItem('theme', theme);
        const isDarkMode = theme === 'light' ? false : theme === 'dark' ? true : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.querySelector('body')?.classList.toggle('dark', isDarkMode);
        set({ theme, isDarkMode }); // Use set() to update the state
    },
    toggleMenu: (payload) => {
        const menu = payload || get().menu;
        localStorage.setItem('menu', menu);
        set({ sidebar: false, menu }); // Reset sidebar state and update menu
    },
    toggleLayout: (payload) => {
        const layout = payload || get().layout;
        localStorage.setItem('layout', layout);
        set({ layout });
    },
    toggleRTL: (payload) => {
        const rtlClass = payload || get().rtlClass;
        localStorage.setItem('rtlClass', rtlClass);
        document.querySelector('html')?.setAttribute('dir', rtlClass || 'ltr');
        set({ rtlClass });
    },
    toggleAnimation: (payload) => {
        const animation = (payload || get().animation)?.trim();
        localStorage.setItem('animation', animation);
        set({ animation });
    },
    toggleNavbar: (payload) => {
        const navbar = payload || get().navbar;
        localStorage.setItem('navbar', navbar);
        set({ navbar });
    },
    toggleSemidark: (payload) => {
        const semidark = payload === true || payload === 'true';
        localStorage.setItem('semidark', semidark.toString());
        set({ semidark });
    },
    toggleLocale: (payload) => {
        const locale = payload || get().locale;
        i18next.changeLanguage(locale);
        set({ locale });
    },
    toggleSidebar: (payload) => {
        const sidebar = !get().sidebar;
        set({ sidebar });
    },
    setPageTitle: (payload) => {
        document.title = payload;
    },
    setAppName: (payload) => {
        set({ appName: payload });
    },
}));
