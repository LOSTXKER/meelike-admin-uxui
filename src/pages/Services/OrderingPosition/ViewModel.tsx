import { useState, useEffect, useRef } from 'react';
import { useThemeStore } from '@/store/theme';
import { useServiceStore } from '@/store/service';
import { useServiceCategoryStore } from '@/store/service-category';
import { useShallow } from 'zustand/react/shallow';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { result, sortBy } from 'lodash';

const ViewModel = () => {
    const { setAppName, setPageTitle } = useThemeStore(
        useShallow(state => ({
            setAppName: state.setAppName,
            setPageTitle: state.setPageTitle
        }))
    );

    const { serviceCategory, getServiceCategory, clearServiceCategory } = useServiceCategoryStore(
        useShallow(state => ({
            serviceCategory: state.data,
            getServiceCategory: state.getAll,
            clearServiceCategory: state.clearState
        }))
    );
    const { service, getService, saveSorting, clearService } = useServiceStore(
        useShallow(state => ({
            service: state.dataWithoutPagination,
            getService: state.getAllWithoutPagination,
            saveSorting: state.saveSorting,
            clearService: state.clearState
        }))
    );

    const isFetchData = useRef<boolean>(false);
    const [isMovePosition, setIsMovePosition] = useState(false);
    const [currentMovingId, setCurrentMovingId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [data, setData] = useState<any[]>([]);

    const setupPage = () => {
        setAppName('จัดเรียงลำดับบริการ');
        setPageTitle('จัดเรียงลำดับบริการ | MeeLike Admin');
    };

    const handleSetState = (cat: any[], newData: any[]) => {
        const sortedCategories = sortBy(cat, 'orderPosition');
        const results: any[] = [];
        for (const category of sortedCategories) {
            const filteredServices = sortBy(
                newData.filter(service => service.serviceCategoryId === category.id),
                'orderPosition'
            );
            results.push({
                type: 'category',
                id: category.id,
                name: category.name,
                iconUrl: category?.iconUrl
            });

            if (filteredServices.length === 0) {
                results.push({
                    type: 'not-assigned',
                    id: category.id,
                    name: category.name
                });
            } else {
                for (const service of filteredServices) {
                    results.push({
                        type: 'service',
                        id: service.id,
                        externalServiceId: service.providerService.externalServiceId,
                        name: service.name,
                        providerService: service.providerService,
                        rateAmount: service.rateAmount,
                        rateTHB: service.rateTHB,
                        isActive: service.isActive,
                        providerDisabled: service.providerDisabled
                    });
                }
            }
        }

        setData(results);

        return results;
    };

    const fetchData = () => {
        if (isFetchData.current) return;

        isFetchData.current = true;
        Promise.all([getServiceCategory(), getService()]).then(([serviceCatResponse, serviceResponse]) => {
            if (!serviceCatResponse.success || !serviceResponse.success) {
                withReactContent(Swal).fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: 'ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
                    confirmButtonText: 'ปิด'
                });
                return;
            } else {
                handleSetState(serviceCatResponse.data ?? [], serviceResponse.data ?? []);
                setIsLoading(false);
            }
        });
    };

    const onStartMovePosition = (movingId: any) => {
        const id = movingId.replace('service-card-item-', '').replace('category-card-item-', '');
        setCurrentMovingId(id);
        setIsMovePosition(true);
    };

    const onFinishMovePosition = () => {
        setCurrentMovingId(null);
        setIsMovePosition(false);
    };

    const onMovePositionEnd = (newData: any[]) => {
        // Create a map of original service category assignments for boundary checking
        const oldList = data;
        const originalServiceCategories = service.reduce((map, svc) => {
            map[svc.id] = svc.serviceCategoryId;
            return map;
        }, {} as Record<string, any>);

        // Track category positions
        const updatedCategories = serviceCategory.map(cat => ({ ...cat }));
        const updatedServices = service.map(svc => ({ ...svc }));

        // Track current category while iterating
        let currentCategoryId: any = null;
        let categoryPosition = 0;

        // Process each item in the new order
        newData.forEach(item => {
            if (item.type === 'category') {
                // Update category position
                currentCategoryId = item.id;
                const categoryToUpdate = updatedCategories.find(c => c.id === item.id);
                if (categoryToUpdate) {
                    categoryToUpdate.orderPosition = categoryPosition++;
                }
            } else if (item.type === 'service') {
                // Verify this service belongs to the current category
                const originalCategoryId = originalServiceCategories[item.id];

                // Only update if service is in its original category
                if (originalCategoryId === currentCategoryId) {
                    const serviceToUpdate = updatedServices.find(s => s.id === item.id);
                    if (serviceToUpdate) {
                        // Get all services in this category from newData
                        const categoryServicesInNewOrder = newData.filter(d => d.type === 'service' && originalServiceCategories[d.id] === currentCategoryId);

                        // Find position in the new ordering
                        const positionInNewOrder = categoryServicesInNewOrder.findIndex(s => s.id === item.id);

                        // Always update the position - the issue was in the comparison
                        serviceToUpdate.orderPosition = positionInNewOrder;
                    }
                }
                // If service is outside its boundary, we ignore the change
            }
        });

        // Apply the updated data
        const newList = handleSetState(updatedCategories, updatedServices);
        handleSubmit(newList, oldList);
    };

    const handleSubmit = (newList: any[], oldList: any[]) => {
        setIsSubmitting(true);

        const requestBody = {
            categories: newList.reduce((acc, item) => {
                if (item.type === 'category') {
                    acc.push({
                        id: item.id,
                        services: []
                    });
                } else if (item.type === 'service') {
                    const lastCategory = acc[acc.length - 1];
                    if (lastCategory) {
                        lastCategory.services.push({
                            id: item.id
                        });
                    }
                }
                return acc;
            }, [])
        };

        saveSorting(requestBody)
            .then(response => {
                if (response.success) {
                    isFetchData.current = false; // Reset fetch data flag
                    fetchData(); // Re-fetch data to ensure UI is updated
                } else {
                    withReactContent(Swal).fire({
                        icon: 'error',
                        title: 'เกิดข้อผิดพลาด',
                        text: result(response, 'message', 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง'),
                        confirmButtonText: 'ปิด'
                    });
                }
            })
            .catch(() => {
                withReactContent(Swal).fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
                    confirmButtonText: 'ปิด'
                });
                setData(oldList); // Revert to old list on error
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    useEffect(() => {
        setupPage();
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        return () => {
            clearServiceCategory();
            clearService();
        };
    }, []);

    return {
        isLoading,
        isSubmitting,
        isMovePosition,
        currentMovingId,
        data,
        onMovePositionEnd,
        onStartMovePosition,
        onFinishMovePosition
    };
};

export default ViewModel;
