import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '@/store/theme';
import { useShallow } from 'zustand/react/shallow';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuthStore } from '@/store/auth';
import i18next from 'i18next';

const INITIAL_STATE = {
    newPassword: '',
    confirmPassword: '',
};

const ViewModel = () => {
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;
    const { languageList, setPageTitle } = useThemeStore(
        useShallow((state) => ({
            languageList: state.languageList,
            setPageTitle: state.setPageTitle,
        }))
    );
    const { changePassword } = useAuthStore((state) => state);

    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = location.state?.token || queryParams.get('token');

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [formState, setFormState] = useState<typeof INITIAL_STATE>(INITIAL_STATE);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [step, setStep] = useState<'fill-in-password' | 'email-verification' | 'completed'>('fill-in-password');
    const [verificationCode, setVerificationCode] = useState<Array<string>>(['', '', '', '', '', '']);
    const [hasSentVerificationCode, setHasSentVerificationCode] = useState<boolean>(false);
    const [hasSentVerificationCodeEmailFirstTime, setHasSentVerificationCodeEmailFirstTime] = useState<boolean>(false);
    const [countdownSendVerificationCode, setCountdownSendVerificationCode] = useState<number>(120); // 2 minutes in seconds

    const setupPage = () => {
        setPageTitle(`${t('auth.changePassword.title')} | MeeLike`);
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

    const onSendVerificationCode = () => {
        setHasSentVerificationCode(true);
        setHasSentVerificationCodeEmailFirstTime(true);
        setCountdownSendVerificationCode(120);
    };

    const onSubmit = () => {
        setIsSubmitting(true);

        if (formState.newPassword !== formState.confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: t('auth.changePassword.passwordMismatch'),
            });
            setIsSubmitting(false);
            return;
        }

        changePassword({ token, newPassword: formState.newPassword }).then((response) => {
            setIsSubmitting(false);
            if (response.success) {
                setStep('completed');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: t('auth.changePassword.error'),
                    text: response.data?.message || t('auth.changePassword.genericError'),
                });
            }
        });
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (hasSentVerificationCode && countdownSendVerificationCode > 0) {
            timer = setInterval(() => {
                setCountdownSendVerificationCode((prevCountdown) => prevCountdown - 1);
            }, 1000);
        } else if (countdownSendVerificationCode === 0) {
            setHasSentVerificationCode(false);
        }
        return () => clearInterval(timer);
    }, [hasSentVerificationCode, countdownSendVerificationCode]);

    useEffect(() => {
        setupPage();
    }, [i18n.language]);

    return {
        currentLanguage,
        t,
        languageList,
        changeLanguage,
        isSubmitting,
        step,
        formState,
        verificationCode,
        showPassword,
        showConfirmPassword,
        setShowPassword,
        setShowConfirmPassword,
        setVerificationCode,
        hasSentVerificationCode,
        hasSentVerificationCodeEmailFirstTime,
        countdownSendVerificationCode,
        onChangeFormState,
        onSubmit,
        onSendVerificationCode,
    };
};

export default ViewModel;
