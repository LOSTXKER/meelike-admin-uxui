import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';

// Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css';

// Tippy JS
import 'tippy.js/dist/tippy.css';

// Flatpickr
import 'flatpickr/dist/flatpickr.css';

// React Date Range
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

// Swiper CSS
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Tailwind css
import './tailwind.css';

// i18n (needs to be bundled)
import './i18n';

// Context
import ContextProvider from './Context';

// Router
import { RouterProvider } from 'react-router-dom';
import router from './router/index';

// Redux
import { Provider } from 'react-redux';
import store from './store/index';

// Axios
import axios from 'axios';
import { setupAxios } from './Configuration/axios';
setupAxios(axios);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Suspense>
            <Provider store={store}>
                <ContextProvider>
                    <RouterProvider router={router} />
                </ContextProvider>
            </Provider>
        </Suspense>
    </React.StrictMode>
);
