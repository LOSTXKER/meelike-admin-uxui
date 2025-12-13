import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '@/store/theme';
import { useAuthStore } from '@/store/auth';
import { useShallow } from 'zustand/react/shallow';
import * as Yup from 'yup';
import { paths } from '@/router/paths';

const INITIAL_STATE = {
    email: '',
    password: '',
};

const INITIAL_ERROR = {
    email: '',
    password: '',
};

const ViewModel = () => {
    const isFetchVerified = useRef<boolean>(false);
    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Email format is incorrect').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });
    const navigate = useNavigate();
    const { setPageTitle } = useThemeStore(
        useShallow((state) => ({
            setPageTitle: state.setPageTitle,
        }))
    );
    const { signin, verify } = useAuthStore(
        useShallow((state) => ({
            signin: state.signin,
            verify: state.verify,
        }))
    );
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [formState, setFormState] = useState<typeof INITIAL_STATE>(INITIAL_STATE);
    const [formError, setFormError] = useState<typeof INITIAL_ERROR>(INITIAL_ERROR);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const setupPage = () => {
        setPageTitle(`ลงชื่อเข้าใช้งานระบบ | MeeLike Admin`);
    };

    const onChangeFormState = (name: string, value: any) => {
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleVerifyAuth = () => {
        verify().then((response) => {
            if (response.success) {
                navigate(paths.root);
            }
        });
        isFetchVerified.current = true;
    };

    const handleSubmitForm = async () => {
        setIsSubmitting(true);

        try {
            const response = await signin(formState);
            if (response.success) {
                navigate(paths.root);
            } else {
                setErrorMessage(response.data?.message || 'Email or password is incorrect');
            }
        } catch (error) {
            setErrorMessage('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        validationSchema
            .validate(formState, {
                abortEarly: false,
            })
            .then(() => {
                setFormError(INITIAL_ERROR);
                handleSubmitForm();
            })
            .catch((error: any) => {
                const errorMessages = error.inner.reduce((acc: any, item: any) => {
                    acc[item.path] = item.message;
                    return acc;
                }, {});

                setFormError(errorMessages);
            });
    };

    useEffect(() => {
        setupPage();
    }, []);

    useEffect(() => {
        if (!isFetchVerified.current) {
            handleVerifyAuth();
        }
    }, []);

    return {
        isSubmitting,
        formState,
        formError,
        errorMessage,
        showPassword,
        setShowPassword,
        onChangeFormState,
        submitForm,
    };
};

export default ViewModel;
