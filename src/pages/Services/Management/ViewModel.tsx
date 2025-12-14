import { useEffect, useState, useMemo } from 'react';
import { useThemeStore } from '@/store/theme';
import { useShallow } from 'zustand/react/shallow';
import mockServicesManagement from '@/Data/mock-services-management.json';

export interface Service {
    id: string;
    externalId: string;
    name: string;
    type: string;
    provider: string;
    providerId: string;
    rate: number;
    rateUsd: number;
    min: number;
    max: number;
    isEnabled: boolean;
    hasRefill: boolean;
}

export interface Category {
    id: string;
    name: string;
    iconUrl: string;
    platform: string;
    isCollapsed: boolean;
    services: Service[];
}

const ViewModel = () => {
    const { setAppName, setPageTitle } = useThemeStore(
        useShallow(state => ({
            setAppName: state.setAppName,
            setPageTitle: state.setPageTitle
        }))
    );

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const setupPage = () => {
        setAppName('จัดการบริการ');
        setPageTitle('จัดการบริการ | MeeLike Admin');
    };

    const fetchData = async () => {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setCategories(mockServicesManagement as Category[]);
        setIsLoading(false);
    };

    const toggleCategory = (categoryId: string) => {
        setCategories(prev =>
            prev.map(cat =>
                cat.id === categoryId
                    ? { ...cat, isCollapsed: !cat.isCollapsed }
                    : cat
            )
        );
    };

    const onReorderServices = (categoryId: string, newServices: Service[]) => {
        setCategories(prev =>
            prev.map(cat =>
                cat.id === categoryId
                    ? { ...cat, services: newServices }
                    : cat
            )
        );
    };

    const moveServicesToCategory = (serviceIds: Set<string>, targetCategoryId: string) => {
        setCategories(prev => {
            // 1. Collect services to move
            let servicesToMove: Service[] = [];

            // Remove from old categories
            const categoriesWithoutServices = prev.map(cat => {
                const staying = cat.services.filter(s => !serviceIds.has(s.id));
                const moving = cat.services.filter(s => serviceIds.has(s.id));
                servicesToMove = [...servicesToMove, ...moving];
                return { ...cat, services: staying };
            });

            // 2. Add to new category
            return categoriesWithoutServices.map(cat => {
                if (cat.id === targetCategoryId) {
                    return { ...cat, services: [...cat.services, ...servicesToMove] };
                }
                return cat;
            });
        });
    };

    // Filter categories based on search
    const filteredCategories = useMemo(() => {
        if (!searchQuery.trim()) return categories;

        const query = searchQuery.toLowerCase();
        return categories.map(cat => ({
            ...cat,
            services: cat.services.filter(svc =>
                svc.name.toLowerCase().includes(query) ||
                svc.externalId.includes(query) ||
                svc.provider.toLowerCase().includes(query)
            )
        })).filter(cat =>
            cat.name.toLowerCase().includes(query) ||
            cat.services.length > 0
        );
    }, [categories, searchQuery]);

    useEffect(() => {
        setupPage();
        fetchData();
    }, []);

    return {
        isLoading,
        categories: filteredCategories,
        setCategories,
        toggleCategory,
        onReorderServices,
        moveServicesToCategory,
        searchQuery,
        setSearchQuery
    };
};

export default ViewModel;
