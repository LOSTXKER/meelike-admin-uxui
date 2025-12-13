import { useEffect, useState, useRef } from 'react';
import { useThemeStore } from '@/store/theme';
import { useOrderStore } from '@/store/order';
import { useServiceCategoryStore } from '@/store/service-category';
import { useServiceStore } from '@/store/service';
import { useUsersStore } from '@/store/users';
import { useProviderStore } from '@/store/provider';
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
    categoryId: [] as number[],
    serviceId: [] as number[],
    status: [] as string[],
    providerId: [] as number[],
    mode: 'all'
};

const ViewModel = () => {
    const { setAppName, setPageTitle } = useThemeStore(
        useShallow(state => ({
            setAppName: state.setAppName,
            setPageTitle: state.setPageTitle
        }))
    );
    const { exportToExcel } = useOrderStore(
        useShallow(state => ({
            exportToExcel: state.exportToExcel
        }))
    );
    const { orderStatus, getOrderStatus, clearStateMasterData } = useMasterDataStore(
        useShallow(state => ({
            orderStatus: state.orderStatus,
            getOrderStatus: state.getOrderStatus,
            clearStateMasterData: state.clearState
        }))
    );
    const { serviceCategories, getAllServiceCategories, clearStateServiceCategory } = useServiceCategoryStore(
        useShallow(state => ({
            serviceCategories: state.data,
            getAllServiceCategories: state.getAll,
            clearStateServiceCategory: state.clearState
        }))
    );
    const { services, getAllServices, clearStateService } = useServiceStore(
        useShallow(state => ({
            services: state.dataWithoutPagination,
            getAllServices: state.getAllWithoutPagination,
            clearStateService: state.clearState
        }))
    );
    const { users, getAllUsers, clearStateUser } = useUsersStore(
        useShallow(state => ({
            users: state.allData,
            getAllUsers: state.getAllData,
            clearStateUser: state.clearState
        }))
    );
    const { providers, getAllProviders, clearStateProvider } = useProviderStore(
        useShallow(state => ({
            providers: state.dataWithoutPagination,
            getAllProviders: state.getAllWithoutPagination,
            clearStateProvider: state.clearState
        }))
    );

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [formState, setFormState] = useState(INITIAL_FORM_STATE);
    const dateRef = useRef<any>(null);

    const userOptions = users.map(user => ({
        label: `${user?.name} (${user?.email})`,
        value: user.id
    }));

    const serviceCategoryOptions = serviceCategories.map(item => ({
        label: `${item.name}`,
        value: item.id
    }));

    const orderStatusOptions = orderStatus.map(item => ({
        ...item
    }));

    const providerOptions: any[] = providers.map(item => ({
        label: item.name,
        value: item.id
    }));

    const serviceOptions: any[] = services.map(item => ({
        value: item.id.toString(),
        label: `${item.id} - ${item.name}`
    }));

    const modeOptions = [
        { label: 'ทั้งหมด', value: 'all' },
        { label: 'Auto', value: 'auto' },
        { label: 'Manual', value: 'manual' }
    ];

    const setupPage = () => {
        setAppName('Export ออร์เดอร์');
        setPageTitle('Export ออร์เดอร์ | MeeLike Admin');
    };

    const fetchMasterData = () => {
        getOrderStatus();
        getAllServiceCategories();
        getAllServices();
        getAllUsers();
        getAllProviders();
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
        formState.categoryId.forEach(categoryId => formData.append('categoryId[]', categoryId.toString()));
        formState.serviceId.forEach(serviceId => formData.append('serviceId[]', serviceId.toString()));
        formState.status.forEach(status => formData.append('status[]', status));
        formState.providerId.forEach(providerId => formData.append('providerId[]', providerId.toString()));
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
            clearStateMasterData();
            clearStateServiceCategory();
            clearStateService();
            clearStateUser();
            clearStateProvider();
        };
    }, []);

    return {
        dateRef,
        modeOptions,
        orderStatusOptions,
        serviceCategoryOptions,
        serviceOptions,
        userOptions,
        providerOptions,
        isSubmitting,
        formState,
        onChangeFormState,
        onClearFormState,
        onSubmit
    };
};

export default ViewModel;
