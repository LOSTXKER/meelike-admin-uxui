import { useState } from 'react';
import clsx from 'clsx';

interface ImportedService {
    id: string;
    name: string;
    rate: number;
    description?: string;
    syncEnabled?: boolean;
}

interface ImportedCategory {
    id: string;
    name: string;
    assigned: string;
    isCollapsed: boolean;
    services: ImportedService[];
}

interface ImportServicesViewProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ImportServicesView = ({ isOpen, onClose }: ImportServicesViewProps) => {
    const [selectedProvider, setSelectedProvider] = useState('permjal.com');
    const [searchQuery, setSearchQuery] = useState('');
    const [hideAddedServices, setHideAddedServices] = useState(false);
    const [copyDescriptions, setCopyDescriptions] = useState(false);
    const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
    const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
    const [showReviewPage, setShowReviewPage] = useState(false);

    // Profit margin inputs
    const [fixedProfit, setFixedProfit] = useState<number>(0);
    const [percentProfit, setPercentProfit] = useState<number>(0);

    // Edit service popup
    const [editServicePopup, setEditServicePopup] = useState<{
        isOpen: boolean;
        serviceId: string;
        name: string;
        description: string;
        dripFeed: boolean;
        min: number;
        max: number;
    }>({
        isOpen: false,
        serviceId: '',
        name: '',
        description: '',
        dripFeed: false,
        min: 1,
        max: 1
    });

    // Custom rates for each service (user can override calculated rate)
    const [customRates, setCustomRates] = useState<Record<string, number>>({});

    // Available local categories for assignment
    const localCategories = [
        'ประกาศข่าวสินค้า 🔥',
        'Service Thai | รวมบริการทุกชนิด ทุกแพลตฟอร์ม | ลูกค้า 🔥',
        'ประกาศจากาพีพีมี',
        'Shopee ไลฟ์สตรีมสด (ประเทศไทยเท่านั้น 🇹🇭) | สูงสุด 50K/Live 🔴 (เพิ่ม PCU) 🌐 Server 1',
        'Shopee ไลฟ์สตรีมสด (ประเทศไทยเท่านั้น 🇹🇭) | สูงสุด 50K/Live 🔴 (เพิ่ม PCU) 🌐 Server 3',
        'Zepeto [คนไทย] | เพิ่มผู้ติดตาม/ถูกใจ/วิว/บันทึก',
        'Joylada [คนไทย] | เพิ่มผู้ติดตาม/ถูกใจ',
        '🟠 รายงานบัญชีแปม',
        'Facebook ปริการคนไทยส่วน 🇹🇭 🔥'
    ];

    const [categories, setCategories] = useState<ImportedCategory[]>([
        {
            id: 'cat-1',
            name: 'ประกาศข่าวสินค้า 🔥',
            assigned: 'ประกาศข่าวสินค้า 🔥',
            isCollapsed: false,
            services: [
                {
                    id: 's-1',
                    name: '26 - 🟠🟠🟠🟠🟠 Facebook ปรับรายวันไทย 🟠🟠🟠🟠🟠',
                    rate: 999999999.00,
                    syncEnabled: true,
                    description: 'เริ่มต้น: ทันที - 24 ชม.\n(หมายเหตุ: หาก Facebook Update ตัวเลขเว็บจะช้าลง)\nการรับประกัน: ลดออกยุดกรอกใช้งาน\nเนรา ๆ แนะนำออกทีมปีเป็น เพื่อ ให้ ในการใช้งานเสถียรมาก\n\nสำหรับเพจโปรไฟล์เพื่อต่อยางเดียว\n(ยอดติดตามเพิ่มขึ้นเท่านั้น ยอดถูกใจไม่เพิ่ม)\n\nลิงค์: ลิงค์เพจในเพจ Facebook\nลิงค์ตัวอย่าง: https://www.facebook.com/xxxxxxxx/'
                }
            ]
        },
        {
            id: 'cat-2',
            name: 'Service Thai | รวมบริการทุกชนิด ทุกแพลตฟอร์ม | ลูกค้า 🔥',
            assigned: 'Service Thai | รวมบริการทุกชนิด ทุกแพลตฟอร์ม | ลูกค้า 🔥',
            isCollapsed: true,
            services: [
                {
                    id: 's-2',
                    name: '195 - 🔵🇹🇭 Facebook ดูไลฟ์พร้อมติดตามเพจ คนไทยต้นทุน | ราคา 1-5 วัน | ยอดคงเหลือ | 🍀ประกัน 1 ปี',
                    rate: 800.00,
                    syncEnabled: false,
                    description: 'เริ่มต้น: ทันที - 24 ชม.\n(หมายเหตุ: หาก Facebook Update ตัวเลขเว็บจะช้าลง)\nการรับประกัน: ลดออกยุดกรอกใช้งาน\nเนรา ๆ แนะนำออกทีมปีเป็น เพื่อ ให้ ในการใช้งานเสถียรมาก\n\nสำหรับเพจโปรไฟล์เพื่อต่อยางเดียว\n(ยอดติดตามเพิ่มขึ้นเท่านั้น ยอดถูกใจไม่เพิ่ม)\n\nลิงค์: ลิงค์เพจในเพจ Facebook\nลิงค์ตัวอย่าง: https://www.facebook.com/xxxxxxxx/'
                },
                {
                    id: 's-3',
                    name: '236 - 🔵🇹🇭 Facebook ผู้ติดตามเพจ | คนไทยต้นทุน | 25K/วัน | 🍀ประกัน 30 วัน',
                    rate: 500.00,
                    syncEnabled: true,
                    description: 'บริการเพิ่มผู้ติดตามเพจ Facebook คนไทยคุณภาพสูง\nรับประกัน 30 วัน\nความเร็ว: 25,000 ต่อวัน'
                },
                {
                    id: 's-4',
                    name: '307 - 🔵🇹🇭 Facebook ดูไลฟ์ไทย คนไทยต้นทุน | ราคา 1-5 วัน | ยอดคงเหลือ | 🍀ประกัน 1 ปี',
                    rate: 500.00,
                    syncEnabled: true,
                    description: 'บริการเพิ่มผู้ดูไลฟ์ Facebook คนไทยแท้\nรับประกัน 1 ปี\nความเร็ว: 1-5 วัน'
                },
                {
                    id: 's-5',
                    name: '3 - 🔵🇹🇭 Facebook ไม่มีคอมเม้นท์ / รีวิวพร 5 ดาว คนไทยต้นทุน',
                    rate: 2000.00,
                    syncEnabled: true,
                    description: 'บริการรีวิว 5 ดาว Facebook คนไทยคุณภาพสูง\nไม่มีคอมเม้นท์\nราคาพิเศษ'
                }
            ]
        }
    ]);

    const toggleCategory = (categoryId: string) => {
        setCategories(categories.map(cat =>
            cat.id === categoryId ? { ...cat, isCollapsed: !cat.isCollapsed } : cat
        ));
    };

    const toggleDescription = (serviceId: string) => {
        setExpandedDescriptions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(serviceId)) {
                newSet.delete(serviceId);
            } else {
                newSet.add(serviceId);
            }
            return newSet;
        });
    };

    const toggleCategorySelection = (categoryId: string) => {
        const category = categories.find(cat => cat.id === categoryId);
        if (!category) return;

        const serviceIds = category.services.map(s => s.id);
        const allSelected = serviceIds.every(id => selectedServices.has(id));

        setSelectedServices(prev => {
            const newSet = new Set(prev);
            if (allSelected) {
                // Deselect all services in this category
                serviceIds.forEach(id => newSet.delete(id));
            } else {
                // Select all services in this category
                serviceIds.forEach(id => newSet.add(id));
            }
            return newSet;
        });
    };

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

    const updateCategoryAssignment = (categoryId: string, newAssignment: string) => {
        setCategories(categories.map(cat =>
            cat.id === categoryId ? { ...cat, assigned: newAssignment } : cat
        ));
    };

    const handleImport = () => {
        if (selectedServices.size === 0) {
            alert('กรุณาเลือกบริการที่ต้องการนำเข้า');
            return;
        }
        setShowReviewPage(true);
    };

    const isCategorySelected = (categoryId: string) => {
        const category = categories.find(cat => cat.id === categoryId);
        if (!category) return false;
        return category.services.every(s => selectedServices.has(s.id));
    };

    if (!isOpen) return null;

    // Review Page - Show selected services with rate editing
    if (showReviewPage) {
        const selectedCategories = categories
            .map(cat => ({
                ...cat,
                services: cat.services.filter(s => selectedServices.has(s.id))
            }))
            .filter(cat => cat.services.length > 0);

        const calculateFinalRate = (baseRate: number) => {
            const withPercent = baseRate * (1 + percentProfit / 100);
            return withPercent + fixedProfit;
        };

        return (
            <div className='fixed inset-0 z-50 flex items-center justify-center'>
                {/* Backdrop */}
                <div
                    className='absolute inset-0 bg-black/50 backdrop-blur-sm'
                    onClick={() => setShowReviewPage(false)}
                />

                {/* Review Content */}
                <div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-4 overflow-hidden max-h-[90vh] flex flex-col'>
                    {/* Header */}
                    <div className='px-6 py-4 border-b border-black/5 bg-gray-50/50 flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                            <button
                                onClick={() => setShowReviewPage(false)}
                                className='text-gray-600 hover:text-gray-900'
                            >
                                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                                </svg>
                            </button>
                            <h3 className='font-semibold text-gray-900'>Import services</h3>
                        </div>
                        <button
                            onClick={() => setShowReviewPage(false)}
                            className='text-gray-400 hover:text-gray-600 transition-colors'
                        >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                            </svg>
                        </button>
                    </div>

                    {/* Profit Margin Inputs */}
                    <div className='px-6 py-4 border-b border-black/5 bg-white'>
                        <div className='flex items-center gap-4'>
                            <div className='flex-1'>
                                <label className='block text-sm text-gray-600 mb-2'>Fixed (1.00)</label>
                                <input
                                    type='number'
                                    value={fixedProfit}
                                    onChange={(e) => setFixedProfit(Number(e.target.value))}
                                    className='w-full px-4 py-2 bg-white border border-black/15 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder='0'
                                />
                            </div>
                            <div className='text-gray-900 text-2xl mt-6'>+</div>
                            <div className='flex-1'>
                                <label className='block text-sm text-gray-600 mb-2'>Percent (%)</label>
                                <input
                                    type='number'
                                    value={percentProfit}
                                    onChange={(e) => setPercentProfit(Number(e.target.value))}
                                    className='w-full px-4 py-2 bg-white border border-black/15 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder='0'
                                />
                            </div>
                            <div className='flex-1' />
                            <button
                                onClick={() => {
                                    setFixedProfit(0);
                                    setPercentProfit(0);
                                }}
                                className='px-4 py-2 mt-6 text-sm text-gray-700 hover:text-gray-900 border border-black/15 rounded-lg hover:bg-gray-50'
                            >
                                Reset rates
                            </button>
                        </div>
                    </div>

                    {/* Table Header */}
                    <div className='px-6 py-2 bg-gray-50 border-b border-black/5 grid grid-cols-12 gap-4 text-xs font-medium text-gray-600'>
                        <div className='col-span-5'>Services</div>
                        <div className='col-span-2 text-center'>Sync rate status</div>
                        <div className='col-span-2 text-center'>Rate</div>
                        <div className='col-span-3 text-right'>Provider's rate</div>
                    </div>

                    {/* Services List */}
                    <div className='flex-1 overflow-y-auto'>
                        {selectedCategories.map((category) => (
                            <div key={category.id} className='mb-4'>
                                {/* Category Header */}
                                <div className='px-6 py-4 bg-gray-100 border-y border-gray-200'>
                                    <div className='text-base font-semibold text-gray-900'>{category.name}</div>
                                </div>

                                {/* Services */}
                                {category.services.map((service) => {
                                    const finalRate = calculateFinalRate(service.rate);
                                    const currentRate = customRates[service.id] !== undefined ? customRates[service.id] : finalRate;
                                    const isSyncEnabled = Math.abs(currentRate - finalRate) < 0.01; // Check if rate matches calculated rate

                                    return (
                                        <div
                                            key={service.id}
                                            className='pl-16 pr-6 py-4 border-b border-gray-200 border-l-4 border-l-gray-300 hover:bg-gray-50/50 transition-colors bg-white'
                                        >
                                            <div className='grid grid-cols-12 gap-4 items-center'>
                                                <div className='col-span-5'>
                                                    <div className='text-sm text-gray-900'>{service.name}</div>
                                                    <div className='flex gap-2 mt-1'>
                                                        <button
                                                            onClick={() => setEditServicePopup({
                                                                isOpen: true,
                                                                serviceId: service.id,
                                                                name: service.name,
                                                                description: service.description || '',
                                                                dripFeed: false,
                                                                min: 1,
                                                                max: 1
                                                            })}
                                                            className='px-2 py-0.5 text-xs text-gray-600 border border-black/10 rounded hover:bg-gray-50'
                                                        >
                                                            ✏️ Edit
                                                        </button>
                                                        <span className='text-xs text-gray-500'>Min: 1 Max: 1</span>
                                                    </div>
                                                </div>
                                                <div className='col-span-2 text-center relative group'>
                                                    {isSyncEnabled ? (
                                                        <span className='inline-flex items-center gap-1 text-xs text-green-600'>
                                                            ✓ Enabled
                                                        </span>
                                                    ) : (
                                                        <>
                                                            <span className='inline-flex items-center gap-1 text-xs text-red-600'>
                                                                ⓘ Disabled
                                                            </span>
                                                            <div className='absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10'>
                                                                <div className='bg-white border border-gray-300 text-gray-900 text-xs rounded-lg p-3 w-64 shadow-xl'>
                                                                    The 'Sync rate with provider' is disabled due to the custom fixed price setting. Your service rate will remain fixed, regardless of the provider's rate — this may lead to selling at a loss. Enabling 'Sync rate with provider' is recommended to avoid rate issues.
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                <div className='col-span-2 text-center'>
                                                    <input
                                                        type='number'
                                                        value={customRates[service.id] !== undefined ? customRates[service.id] : finalRate}
                                                        onChange={(e) => setCustomRates({
                                                            ...customRates,
                                                            [service.id]: Number(e.target.value)
                                                        })}
                                                        className='w-full px-2 py-1 text-sm border border-black/15 rounded text-center bg-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                    />
                                                </div>
                                                <div className='col-span-3 text-right text-sm font-medium text-gray-900'>
                                                    {service.rate.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className='px-6 py-4 border-t border-black/5 bg-gray-50/30 flex items-center justify-between'>
                        <button
                            onClick={() => setShowReviewPage(false)}
                            className='px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors'
                        >
                            Back
                        </button>
                        <button
                            onClick={() => {
                                alert('Import completed!');
                                setShowReviewPage(false);
                                onClose();
                            }}
                            className='px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors'
                        >
                            Import services
                        </button>
                    </div>
                </div>

                {/* Edit Service Popup */}
                {editServicePopup.isOpen && (
                    <div className='absolute inset-0 z-10 flex items-center justify-center bg-black/30'>
                        <div className='bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 p-6'>
                            <div className='space-y-4'>
                                {/* Drip-feed Toggle */}
                                <label className='flex items-center gap-3 cursor-pointer'>
                                    <input
                                        type='checkbox'
                                        checked={editServicePopup.dripFeed}
                                        onChange={(e) => setEditServicePopup({
                                            ...editServicePopup,
                                            dripFeed: e.target.checked
                                        })}
                                        className='w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                                    />
                                    <span className='text-gray-900 text-sm'>🔄 Drip-feed</span>
                                </label>

                                {/* Name Input */}
                                <div>
                                    <label className='block text-sm text-gray-700 mb-2'>Name</label>
                                    <input
                                        type='text'
                                        value={editServicePopup.name}
                                        onChange={(e) => setEditServicePopup({
                                            ...editServicePopup,
                                            name: e.target.value
                                        })}
                                        className='w-full px-4 py-2 bg-white border border-black/15 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    />
                                </div>

                                {/* Description Textarea */}
                                <div>
                                    <label className='block text-sm text-gray-700 mb-2'>Description</label>
                                    <textarea
                                        value={editServicePopup.description}
                                        onChange={(e) => setEditServicePopup({
                                            ...editServicePopup,
                                            description: e.target.value
                                        })}
                                        rows={6}
                                        className='w-full px-4 py-2 bg-gray-50 border border-black/15 rounded-lg text-red-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
                                        placeholder='⚠️ เริ่มต้น: ทันที-ประมาณครบภายใน ห้ามเติมซ้ำ ⚠️'
                                    />
                                </div>

                                {/* Save Button */}
                                <button
                                    onClick={() => setEditServicePopup({ ...editServicePopup, isOpen: false })}
                                    className='w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors'
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
            {/* Backdrop */}
            <div
                className='absolute inset-0 bg-black/50 backdrop-blur-sm'
                onClick={onClose}
            />

            {/* Popup Content */}
            <div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-4 overflow-hidden max-h-[90vh] flex flex-col'>
                {/* Header */}
                <div className='px-6 py-4 border-b border-black/5 bg-gray-50/50 flex items-center justify-between'>
                    <h3 className='font-semibold text-gray-900'>Import services</h3>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-gray-600 transition-colors'
                    >
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                        </svg>
                    </button>
                </div>

                {/* Provider Selection */}
                <div className='px-6 py-4 border-b border-black/5'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Provider
                    </label>
                    <select
                        value={selectedProvider}
                        onChange={(e) => setSelectedProvider(e.target.value)}
                        className='w-full px-4 py-2.5 border border-black/15 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white'
                    >
                        <option value='permjal.com'>permjal.com</option>
                        <option value='provider2.com'>provider2.com</option>
                        <option value='provider3.com'>provider3.com</option>
                    </select>
                </div>

                {/* Search and Filter */}
                <div className='px-6 py-3 border-b border-black/5 flex items-center gap-4'>
                    <button
                        onClick={() => setHideAddedServices(!hideAddedServices)}
                        className='text-blue-600 text-sm hover:underline flex items-center gap-1'
                    >
                        🔗 Hide added services
                    </button>
                    <div className='flex-1' />
                    <div className='relative'>
                        <input
                            type='text'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder='Search'
                            className='px-4 py-2 pr-10 border border-black/15 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 w-64'
                        />
                        <svg className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                        </svg>
                    </div>
                </div>

                {/* Services Header */}
                <div className='px-6 py-2 bg-gray-50 border-b border-black/5 flex items-center text-xs font-medium text-gray-600'>
                    <div className='w-12'></div>
                    <div className='flex-1'>Services</div>
                    <div className='w-32 text-right'>Rate, THB</div>
                </div>

                {/* Categories and Services List */}
                <div className='flex-1 overflow-y-auto'>
                    {categories.map((category) => (
                        <div key={category.id}>
                            {/* Category Row */}
                            <div className='px-6 py-3 border-b border-black/5 bg-gray-50/30'>
                                <div className='flex items-center gap-3'>
                                    <input
                                        type='checkbox'
                                        checked={isCategorySelected(category.id)}
                                        onChange={() => toggleCategorySelection(category.id)}
                                        className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer'
                                    />
                                    <div className='flex-1'>
                                        <div className='text-sm font-medium text-gray-900'>{category.name}</div>
                                        <div className='text-xs text-gray-500 mt-0.5 flex items-center gap-2'>
                                            <span>Assigned →</span>
                                            <select
                                                value={category.assigned}
                                                onChange={(e) => updateCategoryAssignment(category.id, e.target.value)}
                                                className='px-2 py-0.5 border border-black/10 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500'
                                            >
                                                {localCategories.map((cat) => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleCategory(category.id)}
                                        className='text-blue-600 text-xs hover:underline flex items-center gap-1'
                                    >
                                        {category.isCollapsed ? 'Show' : 'Hide'} services ({category.services.length})
                                        <svg className={clsx('w-3 h-3 transition-transform', !category.isCollapsed && 'rotate-180')} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Services under this category */}
                            {!category.isCollapsed && category.services.map((service) => {
                                const isDescriptionExpanded = expandedDescriptions.has(service.id);
                                return (
                                    <div key={service.id}>
                                        <div className='pl-16 pr-6 py-3 border-b border-gray-200 border-l-4 border-l-gray-300 hover:bg-gray-50/50 transition-colors bg-white'>
                                            <div className='flex items-start gap-3'>
                                                <input
                                                    type='checkbox'
                                                    checked={selectedServices.has(service.id)}
                                                    onChange={() => toggleServiceSelection(service.id)}
                                                    className='w-4 h-4 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer'
                                                />
                                                <div className='flex-1 min-w-0'>
                                                    <div className='text-sm text-gray-900'>{service.name}</div>
                                                    <button
                                                        onClick={() => toggleDescription(service.id)}
                                                        className='mt-1 px-3 py-1 text-xs text-gray-600 border border-black/10 rounded-lg hover:bg-gray-50 transition-colors'
                                                    >
                                                        Description
                                                    </button>
                                                </div>
                                                <div className='w-32 text-right text-sm font-medium text-gray-900'>
                                                    {service.rate.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded Description */}
                                        {isDescriptionExpanded && service.description && (
                                            <div className='pl-16 pr-6 py-4 bg-gray-50 text-gray-700 text-sm border-b border-gray-200 border-l-4 border-l-gray-300'>
                                                <div className='pl-7'>
                                                    {service.description.split('\n').map((line, idx) => (
                                                        <div key={idx} className='leading-relaxed'>
                                                            {line || '\u00A0'}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className='px-6 py-4 border-t border-black/5 bg-gray-50/30 flex items-center justify-between'>
                    <label className='flex items-center gap-2 text-sm text-gray-700'>
                        <input
                            type='checkbox'
                            checked={copyDescriptions}
                            onChange={(e) => setCopyDescriptions(e.target.checked)}
                            className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer'
                        />
                        Copy descriptions
                    </label>
                    <div className='flex items-center gap-3'>
                        {selectedServices.size > 0 && (
                            <span className='text-sm text-gray-600'>
                                Selected ({selectedServices.size})
                            </span>
                        )}
                        <button
                            onClick={onClose}
                            className='px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors'
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleImport}
                            disabled={selectedServices.size === 0}
                            className='px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            Import
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
