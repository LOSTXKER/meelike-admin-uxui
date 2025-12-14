import { type FC, Fragment, useState, useMemo } from 'react';
import { ReactSortable } from 'react-sortablejs';
import IconSettings from '@/components/Icon/IconSettings';
import IconMenuDragAndDrop from '@/components/Icon/Menu/IconMenuDragAndDrop';
import IconSearch from '@/components/Icon/IconSearch';
import IconEdit from '@/components/Icon/IconEdit';
import IconEye from '@/components/Icon/IconEye';
import useViewModel from './ViewModel';
import { clsx } from '@mantine/core';
import ServiceFormView from '@/pages/Services/Form/View';
import { ImportServicesView } from '@/pages/Services/Import/View';

// Inline ChevronDown icon
const ChevronDownIcon: FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9l6 6 6-6" />
    </svg>
);

// Check icon for selected option
const CheckIcon: FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 6L9 17l-5-5" />
    </svg>
);

interface Service {
    id: string;
    externalId: string;
    name: string;
    type: string;
    provider: string;
    providerId: string;
    rate: number;
    rateUsd: number;
    cost: number;
    min: number;
    max: number;
    isEnabled: boolean;
    hasRefill: boolean;
    priceMode?: 'fixed' | 'percent' | 'custom'; // fixed=บวกทุน, percent=บวก%, custom=ตั้งราคาเอง
}

interface Category {
    id: string;
    name: string;
    iconUrl: string;
    platform: string;
    isCollapsed: boolean;
    services: Service[];
}

const ServicesManagementView: FC = () => {
    const {
        isLoading,
        categories,
        setCategories,
        toggleCategory,
        onReorderServices,
        searchQuery,
        setSearchQuery
    } = useViewModel();

    // Filter dropdown states
    const [serviceFilter, setServiceFilter] = useState(''); // platform filter
    const [typeFilter, setTypeFilter] = useState('');
    const [providerFilter, setProviderFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    // Search filter type
    const [searchType, setSearchType] = useState('all');

    // Add Service Form
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Edit Service - holds the service being edited
    const [editingService, setEditingService] = useState<Service | null>(null);

    // PNL Detail Popup
    const [pnlPopup, setPnlPopup] = useState<{
        isOpen: boolean;
        categoryName: string;
        totalSales: number;
        totalCost: number;
        profit: number;
    } | null>(null);

    // Selected services for bulk actions
    const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());

    // Bulk Edit Rates Popup
    const [editRatesPopup, setEditRatesPopup] = useState<{
        isOpen: boolean;
        globalPercent: number;
        rateEdits: { [serviceId: string]: { fixed: number; percent: number; customRate: number } };
    }>({ isOpen: false, globalPercent: 0, rateEdits: {} });

    // Add Category Popup
    const [addCategoryPopup, setAddCategoryPopup] = useState<{
        isOpen: boolean;
        name: string;
        platform: string;
        iconUrl: string;
    }>({ isOpen: false, name: '', platform: '', iconUrl: '' });

    // Edit Category Popup
    const [editCategoryPopup, setEditCategoryPopup] = useState<{
        isOpen: boolean;
        categoryId: string;
        name: string;
        platform: string;
        iconUrl: string;
    }>({ isOpen: false, categoryId: '', name: '', platform: '', iconUrl: '' });

    // Import Services Popup
    const [importServicesPopup, setImportServicesPopup] = useState<{ isOpen: boolean }>({ isOpen: false });

    const toggleDropdown = (name: string) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    // Toggle selection for a single service
    const toggleServiceSelection = (serviceId: string) => {
        setSelectedServices(prev => {
            const newSet = new Set(prev);
            if (newSet.has(serviceId)) {
                newSet.delete(serviceId);
            } else {
                newSet.add(serviceId);
            }
            return newSet;
        });
    };

    // Select/Deselect all services
    const toggleSelectAll = () => {
        const allServiceIds = categories.flatMap((cat: Category) => cat.services.map((s: Service) => s.id));
        if (selectedServices.size === allServiceIds.length) {
            setSelectedServices(new Set());
        } else {
            setSelectedServices(new Set(allServiceIds));
        }
    };

    // Open Edit Rates popup
    const openEditRatesPopup = () => {
        const initialEdits: { [serviceId: string]: { fixed: number; percent: number; customRate: number } } = {};
        allServices.filter((s: Service) => selectedServices.has(s.id)).forEach((s: Service) => {
            initialEdits[s.id] = { fixed: 1.00, percent: 50, customRate: s.rate };
        });
        setEditRatesPopup({ isOpen: true, globalPercent: 0, rateEdits: initialEdits });
        setOpenDropdown(null);
    };

    // Calculate new rate based on price mode
    const calculateNewRate = (service: Service, fixed: number, percent: number, customRate: number) => {
        if (service.priceMode === 'custom') {
            return customRate;
        } else if (service.priceMode === 'fixed') {
            return service.rate + fixed;
        } else {
            // percent mode (default)
            return service.rate + fixed + (service.rate * percent / 100);
        }
    };

    // Get all services flattened
    const allServices = categories.flatMap((cat: Category) => cat.services);

    // Group services by platform with counts
    const platformCounts = useMemo(() => {
        const counts: { [key: string]: number } = {};
        categories.forEach((cat: Category) => {
            const platform = cat.platform || 'Other';
            const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
            counts[platformName] = (counts[platformName] || 0) + cat.services.length;
        });
        return counts;
    }, [categories]);

    const totalServicesCount = allServices.length;

    // Get unique values for filters
    const uniqueTypes: string[] = [...new Set(allServices.map((s: Service) => s.type))];
    const uniqueProviders: string[] = [...new Set(allServices.map((s: Service) => s.provider))];

    // Search type options
    const searchTypeOptions = [
        { value: 'all', label: 'All' },
        { value: 'name', label: 'Service name' },
        { value: 'id', label: 'Service ID' },
        { value: 'externalId', label: 'External ID' },
        { value: 'category', label: 'Category name' }
    ];

    return (
        <Fragment>
            <div className='space-y-4'>
                {/* Header Section */}
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div>
                        <h1 className='text-2xl font-semibold text-meelike-dark flex items-center gap-3'>
                            <span className='w-10 h-10 bg-meelike-dark/10 rounded-apple-sm flex items-center justify-center'>
                                <IconSettings className='w-5 h-5 text-meelike-dark' />
                            </span>
                            จัดการบริการ
                        </h1>
                        <p className='text-meelike-dark-2 mt-1 text-sm'>
                            {categories.length} หมวดหมู่ • {totalServicesCount} บริการ
                        </p>
                    </div>
                    <div className='flex flex-wrap items-center gap-2'>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className='px-4 py-2.5 bg-meelike-primary text-meelike-dark rounded-apple text-sm font-medium hover:bg-meelike-primary/90 transition-colors'
                        >
                            + เพิ่มบริการ
                        </button>
                        <button
                            onClick={() => setAddCategoryPopup({ isOpen: true, name: '', platform: '', iconUrl: '' })}
                            className='px-4 py-2.5 bg-blue-600 text-white rounded-apple text-sm font-medium hover:bg-blue-700 transition-colors'
                        >
                            + เพิ่มหมวดหมู่
                        </button>
                        <button
                            onClick={() => setImportServicesPopup({ isOpen: true })}
                            className='px-4 py-2.5 bg-white border border-black/10 text-meelike-dark rounded-apple text-sm font-medium hover:bg-gray-50 transition-colors'
                        >
                            นำเข้าบริการ
                        </button>

                        {/* Expand/Collapse Toggle Button */}
                        <button
                            onClick={() => {
                                const allCollapsed = categories.every((cat: Category) => cat.isCollapsed);
                                setCategories(categories.map((cat: Category) => ({ ...cat, isCollapsed: !allCollapsed })));
                            }}
                            className='p-2.5 bg-meelike-dark text-white rounded-apple hover:bg-meelike-dark/80 transition-colors'
                            title={categories.every((cat: Category) => cat.isCollapsed) ? 'เปิดทั้งหมด' : 'หุบทั้งหมด'}
                        >
                            {categories.every((cat: Category) => cat.isCollapsed) ? (
                                <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                                </svg>
                            ) : (
                                <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 15l7-7 7 7' />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Search with dropdown filter */}
                <div className='flex items-center gap-2'>
                    <div className='relative flex-1 flex'>
                        <IconSearch className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10' />
                        <input
                            type='text'
                            placeholder='Search'
                            className='flex-1 pl-10 pr-4 py-2.5 rounded-l-apple border border-r-0 border-black/10 focus:outline-none focus:ring-2 focus:ring-meelike-primary/30 focus:border-meelike-primary bg-white'
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                        {/* Search Type Dropdown */}
                        <div className='relative'>
                            <button
                                onClick={() => toggleDropdown('searchType')}
                                className='h-full px-4 py-2.5 border border-black/10 rounded-r-apple bg-gray-50 hover:bg-gray-100 text-sm text-gray-600 flex items-center gap-1 transition-colors'
                            >
                                <ChevronDownIcon className='w-3 h-3' />
                            </button>
                            {openDropdown === 'searchType' && (
                                <div className='absolute top-full right-0 mt-1 bg-white rounded-apple-lg shadow-lg border border-black/10 py-1 min-w-[160px] z-50'>
                                    {searchTypeOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => { setSearchType(opt.value); setOpenDropdown(null); }}
                                            className={clsx(
                                                'w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-blue-500 hover:text-white transition-colors',
                                                searchType === opt.value && 'bg-blue-500 text-white'
                                            )}
                                        >
                                            {searchType === opt.value && <CheckIcon className='w-4 h-4' />}
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className='flex items-center justify-center py-20'>
                        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-meelike-primary'></div>
                    </div>
                )}

                {/* Main Data Table */}
                {!isLoading && (
                    <div className='bg-white rounded-apple-lg border border-black/5 shadow-apple overflow-hidden'>
                        {/* Column Headers with Select All - Merged into Single Row */}
                        <div className='flex items-center gap-3 px-4 py-3 bg-gray-100/80 border-b border-black/10'>
                            {/* Select All Checkbox */}
                            <div className='flex items-center gap-2'>
                                <input
                                    type='checkbox'
                                    checked={selectedServices.size === allServices.length && allServices.length > 0}
                                    onChange={toggleSelectAll}
                                    className='w-4 h-4 rounded border-gray-300 text-meelike-primary focus:ring-meelike-primary cursor-pointer'
                                />
                                {selectedServices.size > 0 && (
                                    <span className='text-sm font-bold text-gray-800'>
                                        {selectedServices.size}
                                    </span>
                                )}
                            </div>

                            {/* Actions Dropdown - Only show when selected */}
                            {selectedServices.size > 0 && (
                                <div className='relative'>
                                    <button
                                        onClick={() => toggleDropdown('bulkActions')}
                                        className='px-2.5 py-1.5 bg-white border border-black/15 hover:bg-gray-50 text-gray-600 text-xs font-medium rounded-lg flex items-center gap-1 transition-colors shadow-sm'
                                    >
                                        Actions
                                        <ChevronDownIcon className='w-3 h-3' />
                                    </button>
                                    {openDropdown === 'bulkActions' && (
                                        <div className='absolute top-full left-0 mt-1 bg-white rounded-apple-lg shadow-lg border border-black/10 py-1 min-w-[220px] z-50'>
                                            <button className='w-full px-4 py-2 text-left text-sm hover:bg-blue-500 hover:text-white transition-colors'>
                                                Enable all
                                            </button>
                                            <button className='w-full px-4 py-2 text-left text-sm hover:bg-blue-500 hover:text-white transition-colors'>
                                                Disable all
                                            </button>
                                            <div className='border-t border-gray-100 my-1' />
                                            <button
                                                onClick={openEditRatesPopup}
                                                className='w-full px-4 py-2 text-left text-sm hover:bg-blue-500 hover:text-white transition-colors'
                                            >
                                                Edit rates
                                            </button>
                                            <button className='w-full px-4 py-2 text-left text-sm hover:bg-blue-500 hover:text-white transition-colors'>
                                                Edit names and descriptions
                                            </button>
                                            <div className='border-t border-gray-100 my-1' />
                                            <button className='w-full px-4 py-2 text-left text-sm hover:bg-blue-500 hover:text-white transition-colors flex items-center justify-between'>
                                                Sort by
                                                <ChevronDownIcon className='w-3 h-3 -rotate-90' />
                                            </button>
                                            <button className='w-full px-4 py-2 text-left text-sm hover:bg-blue-500 hover:text-white transition-colors'>
                                                Assign category
                                            </button>
                                            <button className='w-full px-4 py-2 text-left text-sm hover:bg-blue-500 hover:text-white transition-colors'>
                                                Update currency conversion rate
                                            </button>
                                            <button className='w-full px-4 py-2 text-left text-sm hover:bg-blue-500 hover:text-white transition-colors flex items-center justify-between'>
                                                Drip-feed
                                                <ChevronDownIcon className='w-3 h-3 -rotate-90' />
                                            </button>
                                            <div className='border-t border-gray-100 my-1' />
                                            <button className='w-full px-4 py-2 text-left text-sm hover:bg-blue-500 hover:text-white transition-colors'>
                                                Make all visible
                                            </button>
                                            <button className='w-full px-4 py-2 text-left text-sm hover:bg-blue-500 hover:text-white transition-colors'>
                                                Hide all
                                            </button>
                                            <div className='border-t border-gray-100 my-1' />
                                            <button className='w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-500 hover:text-white transition-colors'>
                                                Delete all
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ID */}
                            <div className='w-14 text-xs font-semibold text-gray-600'>
                                ID
                            </div>

                            {/* Service - with platform dropdown */}
                            <div className='flex-1 relative'>
                                <button
                                    onClick={() => toggleDropdown('service')}
                                    className='flex items-center gap-1 px-3 py-1.5 border border-black/20 rounded-apple text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors'
                                >
                                    Service
                                    <ChevronDownIcon className='w-3 h-3' />
                                </button>
                                {openDropdown === 'service' && (
                                    <div className='absolute top-full left-0 mt-1 bg-white rounded-apple-lg shadow-lg border border-black/10 py-1 min-w-[180px] z-50 max-h-80 overflow-y-auto'>
                                        <button
                                            onClick={() => { setServiceFilter(''); setOpenDropdown(null); }}
                                            className='w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex justify-between'
                                        >
                                            <span>All</span>
                                            <span className='text-gray-400'>({totalServicesCount})</span>
                                        </button>
                                        {Object.entries(platformCounts)
                                            .sort((a, b) => b[1] - a[1])
                                            .map(([platform, count]) => (
                                                <button
                                                    key={platform}
                                                    onClick={() => { setServiceFilter(platform.toLowerCase()); setOpenDropdown(null); }}
                                                    className='w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex justify-between'
                                                >
                                                    <span>{platform}</span>
                                                    <span className='text-gray-400'>({count})</span>
                                                </button>
                                            ))}
                                    </div>
                                )}
                            </div>

                            {/* Type - with dropdown */}
                            <div className='w-20 relative'>
                                <button
                                    onClick={() => toggleDropdown('type')}
                                    className='flex items-center gap-1 px-3 py-1.5 border border-black/20 rounded-apple text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors'
                                >
                                    Type
                                    <ChevronDownIcon className='w-3 h-3' />
                                </button>
                                {openDropdown === 'type' && (
                                    <div className='absolute top-full left-0 mt-1 bg-white rounded-apple-lg shadow-lg border border-black/10 py-1 min-w-[120px] z-50'>
                                        <button
                                            onClick={() => { setTypeFilter(''); setOpenDropdown(null); }}
                                            className='w-full px-3 py-1.5 text-left text-xs hover:bg-gray-100'
                                        >
                                            All
                                        </button>
                                        {uniqueTypes.map((type: string) => (
                                            <button
                                                key={type}
                                                onClick={() => { setTypeFilter(type); setOpenDropdown(null); }}
                                                className='w-full px-3 py-1.5 text-left text-xs hover:bg-gray-100'
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Provider - with dropdown */}
                            <div className='w-32 relative'>
                                <button
                                    onClick={() => toggleDropdown('provider')}
                                    className='flex items-center gap-1 px-3 py-1.5 border border-black/20 rounded-apple text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors'
                                >
                                    Provider
                                    <ChevronDownIcon className='w-3 h-3' />
                                </button>
                                {openDropdown === 'provider' && (
                                    <div className='absolute top-full left-0 mt-1 bg-white rounded-apple-lg shadow-lg border border-black/10 py-1 min-w-[150px] z-50'>
                                        <button
                                            onClick={() => { setProviderFilter(''); setOpenDropdown(null); }}
                                            className='w-full px-3 py-1.5 text-left text-xs hover:bg-gray-100'
                                        >
                                            All
                                        </button>
                                        {uniqueProviders.map((provider: string) => (
                                            <button
                                                key={provider}
                                                onClick={() => { setProviderFilter(provider); setOpenDropdown(null); }}
                                                className='w-full px-3 py-1.5 text-left text-xs hover:bg-gray-100 truncate'
                                            >
                                                {provider}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Rate */}
                            <div className='w-20 text-xs font-semibold text-gray-600 text-right'>
                                Rate
                            </div>

                            {/* Min */}
                            <div className='w-16 text-xs font-semibold text-gray-600 text-center'>
                                Min
                            </div>

                            {/* Max */}
                            <div className='w-16 text-xs font-semibold text-gray-600 text-center'>
                                Max
                            </div>

                            {/* Status - with dropdown */}
                            <div className='w-24 relative'>
                                <button
                                    onClick={() => toggleDropdown('status')}
                                    className='flex items-center gap-1 px-3 py-1.5 border border-black/20 rounded-apple text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors'
                                >
                                    Status
                                    <ChevronDownIcon className='w-3 h-3' />
                                </button>
                                {openDropdown === 'status' && (
                                    <div className='absolute top-full left-0 mt-1 bg-white rounded-apple-lg shadow-lg border border-black/10 py-1 min-w-[100px] z-50'>
                                        <button
                                            onClick={() => { setStatusFilter(''); setOpenDropdown(null); }}
                                            className='w-full px-3 py-1.5 text-left text-xs hover:bg-gray-100'
                                        >
                                            All
                                        </button>
                                        <button
                                            onClick={() => { setStatusFilter('enabled'); setOpenDropdown(null); }}
                                            className='w-full px-3 py-1.5 text-left text-xs hover:bg-gray-100'
                                        >
                                            Enabled
                                        </button>
                                        <button
                                            onClick={() => { setStatusFilter('disabled'); setOpenDropdown(null); }}
                                            className='w-full px-3 py-1.5 text-left text-xs hover:bg-gray-100'
                                        >
                                            Disabled
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className='w-16'></div>
                        </div>

                        {/* Categories & Services List */}
                        <ReactSortable
                            list={categories}
                            setList={setCategories}
                            animation={300}
                            handle='.category-drag-handle'
                        >
                            {categories
                                .filter((category: Category) => {
                                    // Apply service/platform filter
                                    if (serviceFilter && category.platform.toLowerCase() !== serviceFilter) return false;
                                    return true;
                                })
                                .map((category: Category) => {
                                    // Apply filters to services
                                    const filteredServices = category.services.filter((svc: Service) => {
                                        if (typeFilter && svc.type !== typeFilter) return false;
                                        if (providerFilter && svc.provider !== providerFilter) return false;
                                        if (statusFilter === 'enabled' && !svc.isEnabled) return false;
                                        if (statusFilter === 'disabled' && svc.isEnabled) return false;

                                        // Apply search based on searchType
                                        if (searchQuery) {
                                            const query = searchQuery.toLowerCase();
                                            switch (searchType) {
                                                case 'name':
                                                    if (!svc.name.toLowerCase().includes(query)) return false;
                                                    break;
                                                case 'id':
                                                    if (!svc.id.toLowerCase().includes(query)) return false;
                                                    break;
                                                case 'externalId':
                                                    if (!svc.externalId.toLowerCase().includes(query)) return false;
                                                    break;
                                                case 'category':
                                                    if (!category.name.toLowerCase().includes(query)) return false;
                                                    break;
                                                default: // all
                                                    if (!svc.name.toLowerCase().includes(query) &&
                                                        !svc.externalId.toLowerCase().includes(query) &&
                                                        !category.name.toLowerCase().includes(query)) return false;
                                            }
                                        }
                                        return true;
                                    });

                                    if (filteredServices.length === 0 && searchQuery) return null;

                                    return (
                                        <div key={category.id}>
                                            {/* Category Row */}
                                            <div
                                                className='flex items-center gap-3 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 cursor-pointer border-b border-black/5 transition-colors'
                                                onClick={() => toggleCategory(category.id)}
                                            >
                                                <IconMenuDragAndDrop className='w-5 h-5 text-gray-400 category-drag-handle cursor-grab active:cursor-grabbing' />

                                                {category.iconUrl && (
                                                    <img
                                                        src={category.iconUrl}
                                                        alt={category.name}
                                                        className='w-5 h-5 object-contain'
                                                        onError={e => { e.currentTarget.src = '/assets/meelike/no-img.png'; }}
                                                    />
                                                )}

                                                <div className='flex-1 min-w-0 flex items-center gap-2'>
                                                    <span className='font-semibold text-sm text-meelike-dark'>{category.name}</span>

                                                    {/* Category Actions Dropdown - Subtle style */}
                                                    <div className='relative'>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleDropdown(`cat-action-${category.id}`);
                                                            }}
                                                            className='px-2 py-1 text-gray-500 text-xs font-medium rounded border border-gray-300 bg-white flex items-center gap-1 hover:bg-gray-50 hover:border-gray-400 transition-colors'
                                                        >
                                                            Actions
                                                            <ChevronDownIcon className='w-3 h-3' />
                                                        </button>
                                                        {openDropdown === `cat-action-${category.id}` && (
                                                            <div className='absolute top-full left-0 mt-1 bg-white rounded-apple-lg shadow-lg border border-black/10 py-1 min-w-[200px] z-50'>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setEditCategoryPopup({
                                                                            isOpen: true,
                                                                            categoryId: category.id,
                                                                            name: category.name,
                                                                            platform: category.platform,
                                                                            iconUrl: category.iconUrl
                                                                        });
                                                                        setOpenDropdown(null);
                                                                    }}
                                                                    className='w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors'
                                                                >
                                                                    Edit category
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        console.log('Disable category:', category.id);
                                                                        setOpenDropdown(null);
                                                                    }}
                                                                    className='w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors'
                                                                >
                                                                    Disable category
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        console.log('Sort by:', category.id);
                                                                        setOpenDropdown(null);
                                                                    }}
                                                                    className='w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-between'
                                                                >
                                                                    Sort by
                                                                    <ChevronDownIcon className='w-3 h-3 -rotate-90' />
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        const categoryServiceIds = filteredServices.map((s: Service) => s.id);
                                                                        setSelectedServices(prev => {
                                                                            const newSet = new Set(prev);
                                                                            categoryServiceIds.forEach((id: string) => newSet.add(id));
                                                                            return newSet;
                                                                        });
                                                                        setOpenDropdown(null);
                                                                    }}
                                                                    className='w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors'
                                                                >
                                                                    Select all category services
                                                                </button>
                                                                <div className='border-t border-gray-100 my-1' />
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setCategories(categories.filter((c: Category) => c.id !== category.id));
                                                                        setOpenDropdown(null);
                                                                    }}
                                                                    className='w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors'
                                                                >
                                                                    Delete category
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* P&L Indicator - Clickable */}
                                                {(() => {
                                                    const totalSales = filteredServices.reduce((acc: number, s: Service) => acc + (s.rate || 0), 0);
                                                    const totalCost = filteredServices.reduce((acc: number, s: Service) => acc + (s.cost || 0), 0);
                                                    const totalProfit = totalSales - totalCost;
                                                    const isPositive = totalProfit >= 0;
                                                    return (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setPnlPopup({
                                                                    isOpen: true,
                                                                    categoryName: category.name,
                                                                    totalSales,
                                                                    totalCost,
                                                                    profit: totalProfit
                                                                });
                                                            }}
                                                            className={clsx(
                                                                'text-xs font-medium px-2 py-0.5 rounded-full hover:opacity-80 transition-opacity cursor-pointer',
                                                                isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                            )}
                                                        >
                                                            {isPositive ? '+' : ''}{totalProfit.toFixed(2)} ฿
                                                        </button>
                                                    );
                                                })()}

                                                <span className='text-xs text-meelike-dark font-medium'>
                                                    {filteredServices.length} บริการ
                                                    <ChevronDownIcon
                                                        className={clsx(
                                                            'inline-block w-3 h-3 ml-1 transition-transform',
                                                            !category.isCollapsed && 'rotate-180'
                                                        )}
                                                    />
                                                </span>
                                            </div>

                                            {/* Services under this category */}
                                            {!category.isCollapsed && (
                                                <ReactSortable
                                                    list={filteredServices}
                                                    setList={(newServices) => onReorderServices(category.id, newServices)}
                                                    animation={200}
                                                    handle='.service-drag-handle'
                                                    group='services'
                                                >
                                                    {filteredServices.map((service: Service) => (
                                                        <div
                                                            key={service.id}
                                                            className={clsx(
                                                                'flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50/80 border-b border-black/5 transition-colors',
                                                                selectedServices.has(service.id) && 'bg-blue-50/50'
                                                            )}
                                                        >
                                                            <IconMenuDragAndDrop className='w-5 h-5 text-gray-300 service-drag-handle cursor-grab active:cursor-grabbing' />

                                                            {/* Checkbox */}
                                                            <input
                                                                type='checkbox'
                                                                checked={selectedServices.has(service.id)}
                                                                onChange={() => toggleServiceSelection(service.id)}
                                                                className='w-4 h-4 rounded border-gray-300 text-meelike-primary focus:ring-meelike-primary cursor-pointer'
                                                                onClick={(e) => e.stopPropagation()}
                                                            />

                                                            {/* ID */}
                                                            <div className='w-14 text-sm text-gray-500'>
                                                                {service.externalId}
                                                            </div>

                                                            {/* Service Name */}
                                                            <div className='flex-1 min-w-0'>
                                                                <p className='text-sm text-meelike-dark truncate'>
                                                                    {service.name}
                                                                </p>
                                                            </div>

                                                            {/* Type */}
                                                            <div className='w-20 text-xs text-gray-500'>
                                                                {service.type}
                                                            </div>

                                                            {/* Provider */}
                                                            <div className='w-32 text-xs text-gray-500 truncate'>
                                                                {service.provider}
                                                                <span className='block text-gray-400'>{service.providerId}</span>
                                                            </div>

                                                            {/* Rate */}
                                                            <div className='w-20 text-right'>
                                                                <p className='text-sm font-medium text-meelike-dark'>
                                                                    ★ {service.rate.toFixed(2)}
                                                                </p>
                                                                <p className='text-xs text-gray-400'>
                                                                    = {service.rateUsd.toFixed(4)}
                                                                </p>
                                                            </div>

                                                            {/* Min */}
                                                            <div className='w-16 text-center text-xs text-gray-500'>
                                                                {service.min}
                                                            </div>

                                                            {/* Max */}
                                                            <div className='w-16 text-center text-xs text-gray-500'>
                                                                {service.max.toLocaleString()}
                                                            </div>

                                                            {/* Status */}
                                                            <div className='w-24'>
                                                                <span className={clsx(
                                                                    'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                                                                    service.isEnabled
                                                                        ? 'bg-green-100 text-green-700'
                                                                        : 'bg-red-100 text-red-700'
                                                                )}>
                                                                    <span className={clsx(
                                                                        'w-1.5 h-1.5 rounded-full',
                                                                        service.isEnabled ? 'bg-green-500' : 'bg-red-500'
                                                                    )} />
                                                                    {service.isEnabled ? 'Enabled' : 'Disabled'}
                                                                </span>
                                                            </div>

                                                            {/* Actions */}
                                                            <div className='w-16 relative flex items-center justify-center'>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        toggleDropdown(`action-${service.id}`);
                                                                    }}
                                                                    className='px-2 py-1 text-xs text-gray-500 hover:text-meelike-primary hover:bg-gray-100 rounded transition-colors'
                                                                >
                                                                    Actions ▾
                                                                </button>
                                                                {openDropdown === `action-${service.id}` && (
                                                                    <div className='absolute top-full right-0 mt-1 bg-white rounded-apple-lg shadow-lg border border-black/10 py-1 min-w-[160px] z-50'>
                                                                        <button
                                                                            onClick={() => { setEditingService(service); setOpenDropdown(null); }}
                                                                            className='w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors'
                                                                        >
                                                                            Edit service
                                                                        </button>
                                                                        <button
                                                                            onClick={() => { console.log('Toggle service:', service.id); setOpenDropdown(null); }}
                                                                            className='w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors'
                                                                        >
                                                                            {service.isEnabled ? 'Disable service' : 'Enable service'}
                                                                        </button>
                                                                        <button
                                                                            onClick={() => { console.log('Duplicate service:', service.id); setOpenDropdown(null); }}
                                                                            className='w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors'
                                                                        >
                                                                            Duplicate
                                                                        </button>
                                                                        <button
                                                                            onClick={() => { console.log('Hide service:', service.id); setOpenDropdown(null); }}
                                                                            className='w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors'
                                                                        >
                                                                            Hide service
                                                                        </button>
                                                                        <button
                                                                            onClick={() => { console.log('Delete service:', service.id); setOpenDropdown(null); }}
                                                                            className='w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors'
                                                                        >
                                                                            Delete service
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </ReactSortable>
                                            )}
                                        </div>
                                    );
                                })}
                        </ReactSortable>
                    </div>
                )}
            </div>

            {/* Click outside to close dropdown */}
            {openDropdown && (
                <div
                    className='fixed inset-0 z-40'
                    onClick={() => setOpenDropdown(null)}
                />
            )}

            {/* Add Service Form */}
            <ServiceFormView
                formType='create'
                selectedId=''
                isOpen={isFormOpen}
                handleClose={() => setIsFormOpen(false)}
                handleAfterSubmit={() => { setIsFormOpen(false); }}
            />

            {/* Edit Service Form */}
            {editingService && (
                <ServiceFormView
                    formType='edit'
                    selectedId={editingService.id}
                    isOpen={true}
                    handleClose={() => setEditingService(null)}
                    handleAfterSubmit={() => { setEditingService(null); }}
                />
            )}

            {/* Import Services Popup */}
            <ImportServicesView
                isOpen={importServicesPopup.isOpen}
                onClose={() => setImportServicesPopup({ isOpen: false })}
            />

            {/* Add Category Popup */}
            {addCategoryPopup.isOpen && (
                <div className='fixed inset-0 z-50 flex items-center justify-center'>
                    {/* Backdrop */}
                    <div
                        className='absolute inset-0 bg-black/50 backdrop-blur-sm'
                        onClick={() => setAddCategoryPopup({ isOpen: false, name: '', platform: '', iconUrl: '' })}
                    />

                    {/* Popup Content */}
                    <div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden'>
                        {/* Header */}
                        <div className='px-6 py-4 border-b border-black/5 bg-gray-50/50'>
                            <h3 className='font-semibold text-gray-900'>เพิ่มหมวดหมู่ใหม่</h3>
                            <p className='text-xs text-gray-500 mt-0.5'>สร้างหมวดหมู่สำหรับจัดกลุ่มบริการ</p>
                        </div>

                        {/* Form */}
                        <div className='p-6 space-y-4'>
                            {/* Category Name */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1.5'>
                                    ชื่อหมวดหมู่ <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='text'
                                    value={addCategoryPopup.name}
                                    onChange={(e) => setAddCategoryPopup(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder='เช่น Facebook Likes, Instagram Followers'
                                    className='w-full px-4 py-2.5 border border-black/15 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500'
                                />
                            </div>

                            {/* Platform Select */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1.5'>
                                    แพลตฟอร์ม
                                </label>
                                <select
                                    value={addCategoryPopup.platform}
                                    onChange={(e) => setAddCategoryPopup(prev => ({ ...prev, platform: e.target.value }))}
                                    className='w-full px-4 py-2.5 border border-black/15 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white'
                                >
                                    <option value=''>-- เลือกแพลตฟอร์ม --</option>
                                    <option value='facebook'>Facebook</option>
                                    <option value='instagram'>Instagram</option>
                                    <option value='tiktok'>TikTok</option>
                                    <option value='youtube'>YouTube</option>
                                    <option value='twitter'>Twitter</option>
                                    <option value='shopee'>Shopee</option>
                                    <option value='lazada'>Lazada</option>
                                    <option value='other'>อื่นๆ</option>
                                </select>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className='px-6 py-4 border-t border-black/5 bg-gray-50/30 flex justify-end gap-3'>
                            <button
                                onClick={() => setAddCategoryPopup({ isOpen: false, name: '', platform: '', iconUrl: '' })}
                                className='px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors'
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={() => {
                                    if (addCategoryPopup.name.trim()) {
                                        const newCategory: Category = {
                                            id: `cat-${Date.now()}`,
                                            name: addCategoryPopup.name,
                                            platform: addCategoryPopup.platform || 'other',
                                            iconUrl: `/assets/meelike/social-media/${addCategoryPopup.platform || 'other'}.svg`,
                                            isCollapsed: false,
                                            services: []
                                        };
                                        setCategories([...categories, newCategory]);
                                        setAddCategoryPopup({ isOpen: false, name: '', platform: '', iconUrl: '' });
                                    }
                                }}
                                disabled={!addCategoryPopup.name.trim()}
                                className='px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                สร้างหมวดหมู่
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Category Popup */}
            {editCategoryPopup.isOpen && (
                <div className='fixed inset-0 z-50 flex items-center justify-center'>
                    {/* Backdrop */}
                    <div
                        className='absolute inset-0 bg-black/50 backdrop-blur-sm'
                        onClick={() => setEditCategoryPopup({ isOpen: false, categoryId: '', name: '', platform: '', iconUrl: '' })}
                    />

                    {/* Popup Content */}
                    <div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden'>
                        {/* Header */}
                        <div className='px-6 py-4 border-b border-black/5 bg-gray-50/50'>
                            <h3 className='font-semibold text-gray-900'>แก้ไขหมวดหมู่</h3>
                            <p className='text-xs text-gray-500 mt-0.5'>แก้ไขชื่อและแพลตฟอร์มของหมวดหมู่</p>
                        </div>

                        {/* Form */}
                        <div className='p-6 space-y-4'>
                            {/* Category Name */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1.5'>
                                    ชื่อหมวดหมู่ <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='text'
                                    value={editCategoryPopup.name}
                                    onChange={(e) => setEditCategoryPopup(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder='เช่น Facebook Likes, Instagram Followers'
                                    className='w-full px-4 py-2.5 border border-black/15 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500'
                                />
                            </div>

                            {/* Platform Select */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1.5'>
                                    แพลตฟอร์ม
                                </label>
                                <select
                                    value={editCategoryPopup.platform}
                                    onChange={(e) => setEditCategoryPopup(prev => ({ ...prev, platform: e.target.value }))}
                                    className='w-full px-4 py-2.5 border border-black/15 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white'
                                >
                                    <option value=''>-- เลือกแพลตฟอร์ม --</option>
                                    <option value='facebook'>Facebook</option>
                                    <option value='instagram'>Instagram</option>
                                    <option value='tiktok'>TikTok</option>
                                    <option value='youtube'>YouTube</option>
                                    <option value='twitter'>Twitter</option>
                                    <option value='shopee'>Shopee</option>
                                    <option value='lazada'>Lazada</option>
                                    <option value='other'>อื่นๆ</option>
                                </select>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className='px-6 py-4 border-t border-black/5 bg-gray-50/30 flex justify-end gap-3'>
                            <button
                                onClick={() => setEditCategoryPopup({ isOpen: false, categoryId: '', name: '', platform: '', iconUrl: '' })}
                                className='px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors'
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={() => {
                                    if (editCategoryPopup.name.trim()) {
                                        setCategories(categories.map((cat: Category) =>
                                            cat.id === editCategoryPopup.categoryId
                                                ? {
                                                    ...cat,
                                                    name: editCategoryPopup.name,
                                                    platform: editCategoryPopup.platform || cat.platform,
                                                    iconUrl: `/assets/meelike/social-media/${editCategoryPopup.platform || cat.platform}.svg`
                                                }
                                                : cat
                                        ));
                                        setEditCategoryPopup({ isOpen: false, categoryId: '', name: '', platform: '', iconUrl: '' });
                                    }
                                }}
                                disabled={!editCategoryPopup.name.trim()}
                                className='px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                บันทึกการแก้ไข
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {pnlPopup?.isOpen && (
                <div className='fixed inset-0 z-50 flex items-center justify-center'>
                    {/* Backdrop */}
                    <div
                        className='absolute inset-0 bg-black/50 backdrop-blur-sm'
                        onClick={() => setPnlPopup(null)}
                    />

                    {/* Popup Content */}
                    <div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden'>
                        {/* Header */}
                        <div className='px-5 py-4 border-b border-black/5 bg-gray-50/50'>
                            <h3 className='font-semibold text-gray-900 text-sm'>รายละเอียด P&L</h3>
                            <p className='text-xs text-gray-500 mt-0.5 truncate'>{pnlPopup.categoryName}</p>
                        </div>

                        {/* Content */}
                        <div className='p-5 space-y-4'>
                            {/* Total Sales */}
                            <div className='flex items-center justify-between'>
                                <span className='text-sm text-gray-600'>ยอดขาย (Rate)</span>
                                <span className='font-semibold text-gray-900'>{pnlPopup.totalSales.toFixed(2)} ฿</span>
                            </div>

                            {/* Total Cost */}
                            <div className='flex items-center justify-between'>
                                <span className='text-sm text-gray-600'>ต้นทุน (Cost)</span>
                                <span className='font-semibold text-red-500'>-{pnlPopup.totalCost.toFixed(2)} ฿</span>
                            </div>

                            {/* Divider */}
                            <div className='border-t border-dashed border-gray-200' />

                            {/* Profit */}
                            <div className='flex items-center justify-between'>
                                <span className='text-sm font-medium text-gray-900'>กำไร/ขาดทุน</span>
                                <span className={clsx(
                                    'font-bold text-lg',
                                    pnlPopup.profit >= 0 ? 'text-green-600' : 'text-red-600'
                                )}>
                                    {pnlPopup.profit >= 0 ? '+' : ''}{pnlPopup.profit.toFixed(2)} ฿
                                </span>
                            </div>

                            {/* Margin */}
                            <div className='flex items-center justify-between bg-gray-50 -mx-5 px-5 py-3 -mb-5'>
                                <span className='text-xs text-gray-500'>Margin</span>
                                <span className={clsx(
                                    'text-sm font-medium',
                                    pnlPopup.profit >= 0 ? 'text-green-600' : 'text-red-600'
                                )}>
                                    {pnlPopup.totalSales > 0
                                        ? ((pnlPopup.profit / pnlPopup.totalSales) * 100).toFixed(1)
                                        : 0}%
                                </span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className='px-5 py-4 border-t border-black/5'>
                            <button
                                onClick={() => setPnlPopup(null)}
                                className='w-full py-2.5 bg-meelike-primary text-meelike-dark text-sm font-medium rounded-xl hover:bg-meelike-primary/90 transition-colors'
                            >
                                ปิด
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Edit Rates Popup */}
            {editRatesPopup.isOpen && (
                <div className='fixed inset-0 z-50 flex items-center justify-center'>
                    {/* Backdrop */}
                    <div
                        className='absolute inset-0 bg-black/50 backdrop-blur-sm'
                        onClick={() => setEditRatesPopup({ ...editRatesPopup, isOpen: false })}
                    />

                    {/* Popup Content */}
                    <div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-4 overflow-hidden max-h-[85vh] flex flex-col'>
                        {/* Header */}
                        <div className='px-5 py-4 border-b border-black/5 bg-gray-50/50 flex items-center gap-4'>
                            <h3 className='font-semibold text-gray-900 text-lg'>Bulk edit rates</h3>
                            <div className='flex items-center gap-2 bg-white border border-black/10 rounded-lg px-3 py-1.5'>
                                <span className='text-sm text-gray-500'>Percent, %</span>
                                <input
                                    type='number'
                                    value={editRatesPopup.globalPercent}
                                    onChange={(e) => {
                                        const newPercent = parseFloat(e.target.value) || 0;
                                        setEditRatesPopup(prev => ({
                                            ...prev,
                                            globalPercent: newPercent,
                                            rateEdits: Object.fromEntries(
                                                Object.entries(prev.rateEdits).map(([id, edit]) => [id, { ...edit, percent: newPercent }])
                                            )
                                        }));
                                    }}
                                    className='w-16 bg-transparent text-gray-900 text-sm font-medium text-right focus:outline-none'
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <div className='flex-1 overflow-y-auto'>
                            {/* Table Header */}
                            <div className='flex items-center px-5 py-3 border-b border-black/10 bg-gray-100/80 sticky top-0'>
                                <div className='w-16 text-xs text-gray-500 font-medium'></div>
                                <div className='flex-1 text-xs text-gray-500 font-medium'>Service</div>
                                <div className='w-36 text-xs text-gray-500 font-medium'>Provider</div>
                                <div className='w-24 text-xs text-gray-500 font-medium text-center'>Fixed, 1.00</div>
                                <div className='w-24 text-xs text-gray-500 font-medium text-center'>Percent, %</div>
                                <div className='w-28 text-xs text-gray-500 font-medium text-right'>Current rate</div>
                                <div className='w-28 text-xs text-gray-500 font-medium text-right'>New rate</div>
                            </div>

                            {/* Table Rows */}
                            {categories.map((category: Category) => {
                                const categoryServices = category.services.filter((s: Service) => selectedServices.has(s.id));
                                if (categoryServices.length === 0) return null;

                                return (
                                    <Fragment key={category.id}>
                                        {/* Category Header */}
                                        <div className='flex items-center px-5 py-2 bg-gray-50 border-b border-black/5'>
                                            {category.iconUrl && (
                                                <img
                                                    src={category.iconUrl}
                                                    alt={category.name}
                                                    className='w-5 h-5 mr-2 object-contain'
                                                    onError={e => { e.currentTarget.src = '/assets/meelike/no-img.png'; }}
                                                />
                                            )}
                                            <span className='text-sm font-semibold text-gray-900'>{category.name}</span>
                                        </div>

                                        {/* Services */}
                                        {categoryServices.map((service: Service) => {
                                            const edit = editRatesPopup.rateEdits[service.id] || { fixed: 1, percent: 50, customRate: service.rate };
                                            const newRate = calculateNewRate(service, edit.fixed, edit.percent, edit.customRate);
                                            const mode = service.priceMode || 'percent';

                                            return (
                                                <div key={service.id} className='flex items-center px-5 py-2.5 border-b border-black/5 hover:bg-gray-50'>
                                                    <div className='w-16 text-sm text-gray-400'>{service.externalId}</div>
                                                    <div className='flex-1 text-sm text-gray-900 truncate pr-4'>
                                                        {service.name}
                                                    </div>
                                                    <div className='w-36 text-sm text-gray-500'>{service.provider}</div>

                                                    {/* Fixed input - show for fixed and percent modes */}
                                                    <div className='w-24 flex justify-center'>
                                                        {(mode === 'fixed' || mode === 'percent') ? (
                                                            <input
                                                                type='number'
                                                                step='0.01'
                                                                value={edit.fixed}
                                                                onChange={(e) => {
                                                                    const newFixed = parseFloat(e.target.value) || 0;
                                                                    setEditRatesPopup(prev => ({
                                                                        ...prev,
                                                                        rateEdits: {
                                                                            ...prev.rateEdits,
                                                                            [service.id]: { ...edit, fixed: newFixed }
                                                                        }
                                                                    }));
                                                                }}
                                                                className='w-16 bg-white text-gray-900 text-sm text-center border border-black/20 rounded px-2 py-1 focus:outline-none focus:border-meelike-primary focus:ring-2 focus:ring-meelike-primary/20'
                                                            />
                                                        ) : (
                                                            <span className='text-gray-300'>—</span>
                                                        )}
                                                    </div>

                                                    {/* Percent input - show only for percent mode */}
                                                    <div className='w-24 flex justify-center items-center gap-1'>
                                                        {mode === 'percent' ? (
                                                            <>
                                                                <input
                                                                    type='number'
                                                                    value={edit.percent}
                                                                    onChange={(e) => {
                                                                        const newPercent = parseFloat(e.target.value) || 0;
                                                                        setEditRatesPopup(prev => ({
                                                                            ...prev,
                                                                            rateEdits: {
                                                                                ...prev.rateEdits,
                                                                                [service.id]: { ...edit, percent: newPercent }
                                                                            }
                                                                        }));
                                                                    }}
                                                                    className='w-12 bg-white text-gray-900 text-sm text-center border border-black/20 rounded px-2 py-1 focus:outline-none focus:border-meelike-primary focus:ring-2 focus:ring-meelike-primary/20'
                                                                />
                                                                <span className='text-gray-400 text-sm'>%</span>
                                                            </>
                                                        ) : (
                                                            <span className='text-gray-300'>—</span>
                                                        )}
                                                    </div>

                                                    {/* Current rate */}
                                                    <div className='w-28 text-right'>
                                                        <span className='text-green-600 text-sm font-medium'>฿ {service.rate.toFixed(2)}</span>
                                                    </div>

                                                    {/* New rate - editable for custom mode */}
                                                    <div className='w-28 flex justify-end'>
                                                        {mode === 'custom' ? (
                                                            <div className='relative'>
                                                                <input
                                                                    type='number'
                                                                    step='0.01'
                                                                    value={edit.customRate}
                                                                    onChange={(e) => {
                                                                        const newCustom = parseFloat(e.target.value) || 0;
                                                                        setEditRatesPopup(prev => ({
                                                                            ...prev,
                                                                            rateEdits: {
                                                                                ...prev.rateEdits,
                                                                                [service.id]: { ...edit, customRate: newCustom }
                                                                            }
                                                                        }));
                                                                    }}
                                                                    className='w-24 bg-white text-gray-900 text-sm text-right border-2 border-meelike-primary rounded-lg pl-2 pr-7 py-1 font-semibold focus:outline-none focus:ring-2 focus:ring-meelike-primary/30'
                                                                />
                                                                <span className='absolute right-2 top-1/2 -translate-y-1/2 text-meelike-primary'>
                                                                    <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' />
                                                                    </svg>
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className='bg-meelike-primary text-meelike-dark text-sm px-3 py-1 rounded-lg font-medium'>
                                                                {newRate.toFixed(2)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </Fragment>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div className='px-5 py-4 border-t border-black/5 bg-gray-50/50 flex items-center gap-3'>
                            <button
                                onClick={() => {
                                    // TODO: Save rate changes
                                    setEditRatesPopup({ ...editRatesPopup, isOpen: false });
                                }}
                                className='px-5 py-2.5 bg-meelike-primary text-meelike-dark text-sm font-medium rounded-xl hover:bg-meelike-primary/90 transition-colors shadow-sm'
                            >
                                Save changes
                            </button>
                            <button
                                onClick={() => setEditRatesPopup({ ...editRatesPopup, isOpen: false })}
                                className='px-5 py-2.5 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-100 transition-colors'
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
};

export default ServicesManagementView;
