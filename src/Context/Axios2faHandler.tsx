import { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import { Transition, TransitionChild, Dialog, DialogPanel } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import IconX from '@/components/Icon/IconX';
import Swal from 'sweetalert2';
import OTPField from '@/pages/Components/OTPInput';
import withReactContent from 'sweetalert2-react-content';

const Axios2faHandler = ({ children }: any) => {
    const { t } = useTranslation();
    const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
    const [twoFAType, setTwoFAType] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [originalRequest, setOriginalRequest] = useState<any>(null);

    const setupAxios2FAInterceptor = (setIsOpen: (state: boolean) => void, setOriginalRequest: (request: any) => void) => {
        return axios.interceptors.response.use(
            (response: any) => response,
            async (error: any) => {
                const message = error?.response?.data?.message;

                const authenticatorAppMessage = ['กรุณายืนยันตนด้วย 2FA', 'Please verify with 2FA'];
                const emailMessage = ['กรุณายืนยันตนด้วย 2FA โดยอีเมล', 'Please verify with 2FA from your email'];

                if (error?.response?.status === 400 && (authenticatorAppMessage.includes(message) || emailMessage.includes(message))) {
                    if (!error.config._retry) {
                        error.config._retry = true;

                        if (authenticatorAppMessage.includes(message)) {
                            setTwoFAType('authenticator');
                        }
                        if (emailMessage.includes(message)) {
                            setTwoFAType('email');
                        }

                        setOriginalRequest(error.config);
                        setIsOpen(true);
                        setError(null);

                        return new Promise((resolve, reject) => {
                            error.config._promise = { resolve, reject };
                        });
                    }
                }
                return Promise.reject(error);
            }
        );
    };

    const onSubmit = async (code: string[]) => {
        if (code.length !== 6 || code.some((digit) => digit === '')) {
            withReactContent(Swal).fire({
                icon: 'error',
                title: <div className="">{t('2faRequiredPopup.errorCode')}</div>,
                confirmButtonText: t('2faRequiredPopup.close'),
                padding: '2em',
                customClass: {
                    popup: 'sweet-alerts mls-custom bg-mls-secondary-black',
                    actions: 'flex flex-row-reverse w-full',
                    htmlContainer: 'mt-0',
                    confirmButton: 'w-full',
                },
            });
            return;
        }

        setError(null);

        if (!originalRequest) return;

        try {
            originalRequest.headers['twoFactorCode'] = code.join('');
            const response = await axios(originalRequest);

            setIsOpen(false);
            const toast = withReactContent(Swal).mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                // @ts-ignore
                customClass: 'mls-custom',
            });

            toast.fire({
                icon: 'success',
                title: t('2faRequiredPopup.yourActionFullfilled'),
                padding: '10px 20px',
            });

            // Resolve the original promise with the response
            if (originalRequest._promise) {
                originalRequest._promise.resolve(response);
            }

            return response;
        } catch (err: any) {
            setError(err.response?.data?.message ?? 'An error occurred');
            if (originalRequest._promise) {
                originalRequest._promise.reject(err);
            }
            return Promise.reject(err);
        }
    };

    const resetState = () => {
        setCode(['', '', '', '', '', '']);
    };

    useEffect(() => {
        const interceptor = setupAxios2FAInterceptor(setIsOpen, setOriginalRequest);
        return () => {
            axios.interceptors.response.eject(interceptor);
            setError(null);
        };
    }, []);

    return (
        <>
            {children}
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" open={isOpen} onClose={() => setIsOpen(false)} static>
                    <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </TransitionChild>
                    <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                        <div className="flex min-h-screen items-center justify-center px-4">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="panel my-8 w-full max-w-xl overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark bg-mls-secondary-black relative">
                                    <div className="absolute right-0 flex items-center justify-end px-5 py-3 dark:bg-[#121c2c]">
                                        <button type="button" className="text-mls-light-gray hover:bg-white-light transition-all rounded-md p-2" onClick={() => setIsOpen(false)}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <h5 className="pt-5 text-xl font-bold text-center">{t('2faRequiredPopup.title')}</h5>
                                    <div className="p-6 text-justify">
                                        <div className="text-mls-light-gray mb-3 text-center">
                                            {twoFAType === 'authenticator' && t('2faRequiredPopup.authenticatorAppDescription')}
                                            {twoFAType === 'email' && t('2faRequiredPopup.emailDescription')}
                                        </div>
                                        <div className="relative">
                                            <OTPField inputs={code} setInputs={setCode} length={6} />
                                            {/* <input
                                                id="verificationCode"
                                                type="text"
                                                placeholder=""
                                                maxLength={6}
                                                autoComplete="off"
                                                className="form-input placeholder:text-mls-light-grayt bg-mls-secondary-black focus:border-mls-primary border-mls-secondary-gray"
                                                value={code}
                                                onChange={(e) => setCode(e.target.value)}
                                            /> */}
                                        </div>
                                        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                                    </div>
                                    <div className="flex items-center justify-between p-6 space-x-4">
                                        <button
                                            type="button"
                                            className="px-4 py-2 border border-mls-primary rounded-md shadow-sm text-sm font-medium bg-mls-secondary-black hover:opacity-80 transition-all w-full"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {t('2faRequiredPopup.close')}
                                        </button>
                                        <button
                                            type="button"
                                            className="px-4 py-2 btn bg-meelike-primary shadow rounded-lg text-meelike-dark font-medium transition-all w-full text-center"
                                            onClick={() => {
                                                if (code.length === 6) {
                                                    onSubmit(code);
                                                    resetState();
                                                }
                                            }}
                                        >
                                            {t('2faRequiredPopup.continue')}
                                        </button>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

export default Axios2faHandler;
