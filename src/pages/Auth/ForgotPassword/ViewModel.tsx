import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '@/store/theme';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '@/store/auth';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import i18next from 'i18next';
import * as Yup from 'yup';
import { paths } from '@/router/paths';

const INITIAL_STATE = {
    email: '',
    password: '',
    confirmPassword: '',
};

const INITIAL_ERROR = {
    password: '',
    confirmPassword: '',
};

const ViewModel = () => {
    const validationSchema = Yup.object().shape({
        password: Yup.string().required(i18next.t('validation.auth.forgot_password.password_required')),
        confirmPassword: Yup.string()
            .required(i18next.t('validation.auth.forgot_password.confirm_password_required'))
            // @ts-ignore
            .oneOf([Yup.ref('password'), null], i18next.t('validation.auth.forgot_password.password_mismatch')),
    });

    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;
    const { languageList, setPageTitle } = useThemeStore(
        useShallow((state) => ({
            languageList: state.languageList,
            setPageTitle: state.setPageTitle,
        }))
    );
    const resetPassword = useAuthStore((state) => state.resetPassword);
    const verifyResetPassword = useAuthStore((state) => state.verifyResetPassword);
    const changePassword = useAuthStore((state) => state.changePassword);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formState, setFormState] = useState<typeof INITIAL_STATE>(INITIAL_STATE);
    const [formError, setFormError] = useState<typeof INITIAL_ERROR>(INITIAL_ERROR);
    const [step, setStep] = useState<'form' | 'otp' | 'change-password' | 'completed'>('form');
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [changePasswordToken, setChangePasswordToken] = useState<string>('');

    const isOTPValid = otp.length === 6 && otp.every((digit) => /^\d+$/.test(digit));

    const setupPage = () => {
        setPageTitle(`${t('auth.forgotPassword.title')} | MeeLike`);
    };

    const changeLanguage = (lng: string) => {
        i18next.changeLanguage(lng);
    };

    const onChangeFormState = (key: string, value: any) => {
        setFormState({
            ...formState,
            [key]: value,
        });
    };

    const onSubmit = () => {
        withReactContent(Swal)
            .fire({
                icon: 'warning',
                title: t('auth.forgotPassword.areYouSure'),
                html: (
                    <div className="text-white">
                        <p className="text-base font-bold leading-normal text-white-dark text-center capitalize">{t('auth.forgotPassword.description')}</p>
                    </div>
                ),
                showCancelButton: true,
                confirmButtonText: t('auth.forgotPassword.confirm'),
                cancelButtonText: t('auth.forgotPassword.cancel'),
                padding: '2em',
                customClass: {
                    popup: 'sweet-alerts',
                    actions: 'flex flex-row-reverse',
                },
            })
            .then((result) => {
                if (result.isConfirmed) {
                    setIsSubmitting(true);
                    const formData = new FormData();
                    formData.append('email', formState.email);

                    resetPassword(formData)
                        .then((response) => {
                            if (response.success) {
                                setStep('otp');
                                withReactContent(Swal).fire({
                                    icon: 'success',
                                    title: t('validation.auth.forgot_password.request_success'),
                                    text: response.data?.message ?? '',
                                    confirmButtonText: t('validation.auth.forgot_password.close'),
                                    showConfirmButton: true,
                                    customClass: {
                                        popup: 'sweet-alerts',
                                    },
                                    allowOutsideClick: false,
                                });
                            } else {
                                withReactContent(Swal).fire({
                                    icon: 'error',
                                    title: t('validation.auth.forgot_password.request_failed'),
                                    text: response.data?.message ?? '',
                                    confirmButtonText: t('validation.auth.forgot_password.close'),
                                    showConfirmButton: true,
                                    customClass: {
                                        popup: 'sweet-alerts',
                                    },
                                    allowOutsideClick: false,
                                });
                            }
                        })
                        .finally(() => {
                            setIsSubmitting(false);
                        });
                }
            });
    };

    const onVerifyOtp = () => {
        if (!isOTPValid) {
            withReactContent(Swal).fire({
                icon: 'error',
                html: (
                    <div className="text-white">
                        <p className="text-base font-bold leading-normal text-white-dark text-center capitalize">{t('validation.auth.forgot_password.otp_required')}</p>
                    </div>
                ),
                showCancelButton: false,
                confirmButtonText: t('validation.auth.forgot_password.close'),
                padding: '2em',
                customClass: {
                    popup: 'sweet-alerts',
                    actions: 'flex flex-row-reverse',
                },
                allowOutsideClick: false,
            });
            return;
        } else {
            const otpString = otp.join('');
            const formData = new FormData();
            formData.append('code', otpString);
            formData.append('email', formState.email);

            setIsSubmitting(true);
            verifyResetPassword(formData)
                .then((response) => {
                    if (response.success) {
                        setStep('change-password');
                        setChangePasswordToken(response.data?.data?.token ?? '');
                    } else {
                        withReactContent(Swal).fire({
                            icon: 'error',
                            title: t('validation.auth.forgot_password.otp_failed'),
                            text: response.data?.message ?? '',
                            confirmButtonText: t('validation.auth.forgot_password.close'),
                            showConfirmButton: true,
                            customClass: {
                                popup: 'sweet-alerts',
                            },
                            allowOutsideClick: false,
                        });
                    }
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        }
    };

    const onSubmitChangePassword = () => {
        if (changePasswordToken === '') {
            withReactContent(Swal)
                .fire({
                    icon: 'error',
                    title: t('validation.auth.forgot_password.token_required'),
                    text: t('validation.auth.forgot_password.token_required_description'),
                    confirmButtonText: t('validation.auth.forgot_password.close'),
                    showConfirmButton: true,
                    customClass: {
                        popup: 'sweet-alerts',
                    },
                    allowOutsideClick: false,
                })
                .then(({ isConfirmed }) => {
                    if (isConfirmed) {
                        navigate(paths.auth.signin);
                    }
                });
            return;
        }

        validationSchema
            .validate(formState, { abortEarly: false })
            .then(() => {
                setFormError(INITIAL_ERROR);

                const formData = new FormData();
                formData.append('token', changePasswordToken);
                formData.append('newPassword', formState.password);

                setIsSubmitting(true);
                changePassword(formData)
                    .then((response) => {
                        if (response.success) {
                            withReactContent(Swal)
                                .fire({
                                    icon: 'success',
                                    title: t('validation.auth.forgot_password.password_changed'),
                                    text: response.data?.message ?? '',
                                    confirmButtonText: t('validation.auth.forgot_password.close'),
                                    showConfirmButton: true,
                                    customClass: {
                                        popup: 'sweet-alerts',
                                    },
                                    allowOutsideClick: false,
                                })
                                .then((result) => {
                                    if (result.isConfirmed) {
                                        navigate(paths.auth.signin);
                                    }
                                });
                        } else {
                            withReactContent(Swal).fire({
                                icon: 'error',
                                title: t('validation.auth.forgot_password.change_failed'),
                                text: response.data?.message ?? '',
                                confirmButtonText: t('validation.auth.forgot_password.close'),
                                showConfirmButton: true,
                                customClass: {
                                    popup: 'sweet-alerts',
                                },
                                allowOutsideClick: false,
                            });
                        }
                    })
                    .finally(() => {
                        setIsSubmitting(false);
                    });
            })
            .catch((err: any) => {
                const errors = err.inner.reduce((acc: { [key: string]: any }, curr: any) => {
                    acc[curr.path] = curr.message;
                    return acc;
                }, {});

                setFormError(errors);
            });
    };

    useEffect(() => {
        setupPage();
    }, [i18n.language]);

    return {
        currentLanguage,
        t,
        languageList,
        changeLanguage,
        isSubmitting,
        otp,
        step,
        setOtp,
        showPassword,
        showConfirmPassword,
        setShowPassword,
        setShowConfirmPassword,
        formState,
        formError,
        onChangeFormState,
        onSubmit,
        onVerifyOtp,
        onSubmitChangePassword,
    };
};

export default ViewModel;
