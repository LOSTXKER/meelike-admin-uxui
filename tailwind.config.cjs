/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
const rotateX = plugin(function ({ addUtilities }) {
    addUtilities({
        '.rotate-y-180': {
            transform: 'rotateY(180deg)',
        },
    });
});
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        container: {
            center: true,
        },
        extend: {
            colors: {
                clink: {
                    DEFAULT: '#172b4d',
                    primary: '#2400A5',
                    secondary: '#1575FA',
                    success: '#32C113',
                    info: '#11cdef',
                    warning: '#fb6340',
                    danger: '#FF0000',
                    light: '#adb5bd',
                    dark: '#212529',
                    darker: 'darken(#212529, 15%) !default',
                    yellow: '#ffc000',
                    blue: '#1c75fa',
                    'input-label': '#32325D',
                },
                meelike: {
                    primary: '#FCD77F',
                    secondary: '#FDE8BD',
                    white: '#FFFAF5',
                    dark: '#473B30',
                    'dark-2': '#937058',
                    'dark-3': '#C9B7AB',
                    pink: '#F892A2',
                    'soft-pink': '#FAB8C3',
                    purple: '#805DCA',
                    success: '#00AB55',
                    danger: '#E7515A',
                    warning: '#E2A03F',
                    blue: '#2196F3',
                    'social-media': {
                        facebook: '#1957A7',
                        instagram: '#C837AB',
                        twitter: '#03A9F4',
                        youtube: '#FF3D00',
                        shopee: '#F4511E',
                        telegram: '#29B6F6',
                        google: '#000000',
                        tiktok: '#EC407A',
                    },
                    'service-category': {
                        like: '#FC6666',
                        comment: '#2F8AE5',
                        share: '#000000',
                        live: '#F50104',
                        retweet: '#00AB55',
                        view: '#805DCA',
                        following: '#E2A03F',
                    },
                    'order-status': {
                        'in-progress': '#2F8AE5',
                        completed: '#4CAF50',
                        hold: '#FFB82E',
                        'partially-completed': '#888EA8',
                        cancelled: '#FF3D00',
                        'on-refill': '#F892A2',
                        failed: '#E7515A',
                    },
                    'child-panel-status': {
                        'wait-for-approval': '#FFB82E',
                        'in-progress': '#2F8AE5',
                        stopped: '#888EA8',
                        rejected: '#FF3D00',
                    },
                    'ticket-status': {
                        open: '#2F8AE5',
                        closed: '#4CAF50',
                    },
                },
                primary: {
                    DEFAULT: '#4361ee',
                    light: '#eaf1ff',
                    'dark-light': 'rgba(67,97,238,.15)',
                },
                secondary: {
                    DEFAULT: '#805dca',
                    light: '#ebe4f7',
                    'dark-light': 'rgb(128 93 202 / 15%)',
                },
                success: {
                    DEFAULT: '#00ab55',
                    light: '#ddf5f0',
                    'dark-light': 'rgba(0,171,85,.15)',
                },
                danger: {
                    DEFAULT: '#e7515a',
                    light: '#fff5f5',
                    'dark-light': 'rgba(231,81,90,.15)',
                },
                warning: {
                    DEFAULT: '#e2a03f',
                    light: '#fff9ed',
                    'dark-light': 'rgba(226,160,63,.15)',
                },
                info: {
                    DEFAULT: '#2196f3',
                    light: '#e7f7ff',
                    'dark-light': 'rgba(33,150,243,.15)',
                },
                dark: {
                    DEFAULT: '#3b3f5c',
                    light: '#eaeaec',
                    'dark-light': 'rgba(59,63,92,.15)',
                },
                black: {
                    DEFAULT: '#0e1726',
                    light: '#e3e4eb',
                    'dark-light': 'rgba(14,23,38,.15)',
                },
                white: {
                    DEFAULT: '#ffffff',
                    light: '#e0e6ed',
                    dark: '#888ea8',
                },
            },
            fontFamily: {
                prompt: ['Prompt'],
            },
            spacing: {
                4.5: '18px',
            },
            boxShadow: {
                '3xl': '0 2px 2px rgb(224 230 237 / 46%), 1px 6px 7px rgb(224 230 237 / 46%)',
                'apple-sm': '0 1px 2px rgba(0, 0, 0, 0.04)',
                'apple': '0 2px 8px rgba(0, 0, 0, 0.06)',
                'apple-md': '0 4px 12px rgba(0, 0, 0, 0.08)',
                'apple-lg': '0 8px 24px rgba(0, 0, 0, 0.12)',
                'apple-xl': '0 12px 40px rgba(0, 0, 0, 0.15)',
                'apple-inner': 'inset 0 1px 2px rgba(0, 0, 0, 0.06)',
            },
            borderRadius: {
                'apple-sm': '8px',
                'apple': '12px',
                'apple-lg': '16px',
                'apple-xl': '20px',
            },
            backdropBlur: {
                'apple': '20px',
            },
            transitionTimingFunction: {
                'apple': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
            },
            transitionDuration: {
                'apple': '200ms',
            },
            typography: ({ theme }) => ({
                DEFAULT: {
                    css: {
                        '--tw-prose-invert-headings': theme('colors.white.dark'),
                        '--tw-prose-invert-links': theme('colors.white.dark'),
                        h1: { fontSize: '40px', marginBottom: '0.5rem', marginTop: 0 },
                        h2: { fontSize: '32px', marginBottom: '0.5rem', marginTop: 0 },
                        h3: { fontSize: '28px', marginBottom: '0.5rem', marginTop: 0 },
                        h4: { fontSize: '24px', marginBottom: '0.5rem', marginTop: 0 },
                        h5: { fontSize: '20px', marginBottom: '0.5rem', marginTop: 0 },
                        h6: { fontSize: '16px', marginBottom: '0.5rem', marginTop: 0 },
                        p: { marginBottom: '0.5rem' },
                        li: { margin: 0 },
                        img: { margin: 0 },
                    },
                },
            }),
        },
    },
    plugins: [
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
        require('@tailwindcss/typography'),
        rotateX,
    ],
};
