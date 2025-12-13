import { useEffect, useState, useRef } from 'react';
import { useThemeStore } from '@/store/theme';
import { useWalletStore } from '@/store/wallet';
import { useUsersStore } from '@/store/users';
import { useMasterDataStore } from '@/store/master-data';
import { useShallow } from 'zustand/react/shallow';
import moment from 'moment';
import 'moment-timezone';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const INITIAL_FORM_STATE = {
    startDate: moment().tz('Asia/Bangkok').subtract(3, 'months').toDate(),
    endDate: moment().tz('Asia/Bangkok').toDate(),
    userId: [] as number[],
    method: [] as string[],
    status: [] as string[],
    mode: 'all'
};

const ViewModel = () => {
    const { setAppName, setPageTitle } = useThemeStore(
        useShallow(state => ({
            setAppName: state.setAppName,
            setPageTitle: state.setPageTitle
        }))
    );
    const { exportToExcel } = useWalletStore(
        useShallow(state => ({
            exportToExcel: state.exportFundHistoriesToExcel
        }))
    );
    const { users, getAllUsers, clearStateUser } = useUsersStore(
        useShallow(state => ({
            users: state.allData,
            getAllUsers: state.getAllData,
            clearStateUser: state.clearState
        }))
    );

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [formState, setFormState] = useState(INITIAL_FORM_STATE);
    const dateRef = useRef<any>(null);

    const userOptions = users.map(user => ({
        label: `${user?.name} (${user?.email})`,
        value: user.id
    }));

    const statusOptions: any[] = [
        {
            label: 'ทั้งหมด',
            value: 'all'
        },
        {
            label: 'รอดำเนินการ',
            value: 'PENDING'
        },
        {
            label: 'สำเร็จ',
            value: 'SUCCESS'
        }
    ];

    const methodOptions = [
        {
            label: 'True Money',
            value: 'truemoney'
        },
        {
            label: 'PromptPay',
            value: 'promptpay'
        },
        {
            label: 'Credit Card / Debit Card',
            value: 'credit_card'
        },
        {
            label: 'Bonus',
            value: 'bonus'
        }
    ];

    const modeOptions = [
        { label: 'ทั้งหมด', value: 'all' },
        { label: 'Auto', value: 'auto' },
        { label: 'Manual', value: 'manual' }
    ];

    const setupPage = () => {
        setAppName('Export การเติมเงิน');
        setPageTitle('Export การเติมเงิน | MeeLike Admin');
    };

    const fetchMasterData = () => {
        getAllUsers();
    };

    const onChangeFormState = (key: string, value: any) => {
        if (key === 'startDate' || key === 'endDate') {
            if (key === 'startDate') {
                setFormState(prevState => ({
                    ...prevState,
                    startDate: moment(value)
                        .set({
                            hours: 0,
                            minutes: 0,
                            seconds: 0
                        })
                        .toDate()
                }));
            } else if (key === 'endDate') {
                setFormState(prevState => ({
                    ...prevState,
                    endDate: moment(value)
                        .set({
                            hours: 23,
                            minutes: 59,
                            seconds: 59
                        })
                        .toDate()
                }));
            }
        } else {
            setFormState(prevState => ({
                ...prevState,
                [key]: value
            }));
        }
    };

    const onClearFormState = () => {
        setFormState(INITIAL_FORM_STATE);
    };

    const onSubmit = () => {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('startDate', moment(formState.startDate).tz('Asia/Bangkok').toISOString());
        formData.append('endDate', moment(formState.endDate).tz('Asia/Bangkok').toISOString());
        formState.userId.forEach(userId => formData.append('userId[]', userId.toString()));
        formState.status.forEach(status => formData.append('status[]', status));
        if (formState.mode !== 'all') {
            formData.append('mode', formState.mode);
        }

        exportToExcel(formData)
            .then(response => {
                if (!response.success) {
                    withReactContent(Swal).fire({
                        icon: 'error',
                        title: 'เกิดข้อผิดพลาด',
                        text: response.data?.message || 'ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
                        confirmButtonText: 'ปิด'
                    });
                    return;
                }
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    useEffect(() => {
        setupPage();
    }, []);

    useEffect(() => {
        fetchMasterData();
    }, []);

    useEffect(() => {
        return () => {
            clearStateUser();
        };
    }, []);

    return {
        dateRef,
        modeOptions,
        statusOptions,
        methodOptions,
        userOptions,
        isSubmitting,
        formState,
        onChangeFormState,
        onClearFormState,
        onSubmit
    };
};

export default ViewModel;
