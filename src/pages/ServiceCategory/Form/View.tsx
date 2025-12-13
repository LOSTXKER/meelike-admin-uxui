import { type FC, Fragment, useRef, useEffect } from 'react';

import { Dialog, Transition, TransitionChild, DialogPanel } from '@headlessui/react';
import IconX from '@/components/Icon/IconX';
import IconEye from '@/components/Icon/IconEye';
import IconXCircle from '@/components/Icon/IconXCircle';
import IconSave from '@/components/Icon/IconSave';

import useViewModel, { Props } from './ViewModel';
import { clsx } from '@mantine/core';

const SeviceCategoryFormView: FC<Props> = (props) => {
    const { isHideToConfirm, isSelf, isOpen, isSubmitting, showPassword, formType, formState, formErrors, setShowPassword, onChangeFormState, onClose, onSubmit } = useViewModel(props);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const objectUrlRef = useRef<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                onChangeFormState('icon', file);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // Get image source for preview
    const getImageSrc = () => {
        try {
            if (formState.icon instanceof File) {
                // Create object URL for file
                if (objectUrlRef.current) {
                    URL.revokeObjectURL(objectUrlRef.current);
                }
                objectUrlRef.current = URL.createObjectURL(formState.icon as File);
                return objectUrlRef.current;
            }

            // Use iconUrl from API response if available
            if (formState.iconUrl) {
                return formState.iconUrl;
            }

            // Fallback to icon field if it's a string with content
            if (typeof formState.icon === 'string' && formState.icon) {
                return formState.icon;
            }

            // Default no image placeholder
            return '/assets/meelike/no-img.png';
        } catch (error) {
            // Show default no image placeholder in case of any errors
            return '/assets/meelike/no-img.png';
        }
    };

    // Clean up object URL when component unmounts
    useEffect(() => {
        return () => {
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
                objectUrlRef.current = null;
            }
        };
    }, []);

    return (
        <Fragment>
            <Transition appear show={isHideToConfirm ? false : isOpen} as={Fragment}>
                <Dialog as="div" open={isHideToConfirm ? false : isOpen} onClose={onClose} static>
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
                                <DialogPanel as="div" className="panel my-8 w-full max-w-5xl rounded-lg border-0 p-0 text-black dark:text-white-dark bg-[#F7FAFC] relative font-kanit">
                                    <div className="absolute right-0 flex items-center justify-end px-5 py-3 dark:bg-[#121c2c]">
                                        <button type="button" className="text-black hover:bg-gray-200 transition-all rounded-md p-2" onClick={onClose}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-5 pt-0">
                                        <h5 className="pt-5 text-xl font-bold">
                                            {formType === 'create' ? 'เพิ่มหมวดหมู่บริการ' : formType === 'edit' ? 'แก้ไขหมวดหมู่บริการ' : 'ดูรายละเอียดหมวดหมู่บริการ'}
                                        </h5>
                                    </div>

                                    <div className="grid grid-cols-12 gap-4 lg:gap-y-8 p-5 items-center">
                                        <div className="col-span-12">
                                            <div className="relative w-20 h-20 mx-auto cursor-pointer" onClick={triggerFileInput}>
                                                <img
                                                    src={getImageSrc()}
                                                    alt="Category Icon"
                                                    className="w-20 h-20 mx-auto object-cover rounded-full"
                                                    onError={(e) => {
                                                        // If image fails to load, show fallback image
                                                        e.currentTarget.src = '/assets/meelike/no-img.png';
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 hover:opacity-100 transition-opacity">
                                                    <span className="text-white text-xs">อัพโหลดไอคอน</span>
                                                </div>
                                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                                            </div>
                                            {formErrors['icon'] && <p className="text-red-500 text-sm text-center mt-2">{formErrors['icon']}</p>}
                                        </div>
                                        <div className="col-span-12 lg:col-span-12">
                                            <label htmlFor="name" className="text-clink-input-label">
                                                ชื่อหมวดหมู่
                                            </label>
                                            <input
                                                id="name"
                                                type="text"
                                                placeholder={'กรอกชื่อหมวดหมู่'}
                                                className={clsx('form-input', {
                                                    'border-red-500': formErrors['name'],
                                                })}
                                                value={formState.name}
                                                autoComplete="off"
                                                onChange={(e) => onChangeFormState('name', e.target.value)}
                                            />
                                            {formErrors['name'] && <p className="text-red-500 text-sm">{formErrors['name']}</p>}
                                        </div>
                                        <div className="col-span-12 lg:col-span-12">
                                            <label htmlFor="orderPosition" className="text-clink-input-label">
                                                ตำแหน่งการจัดเรียง
                                            </label>
                                            <input
                                                id="orderPosition"
                                                type="text"
                                                placeholder={'กรอกชื่อหมวดหมู่'}
                                                className={clsx('form-input', {
                                                    'border-red-500': formErrors['orderPosition'],
                                                })}
                                                value={formState.orderPosition}
                                                autoComplete="off"
                                                onChange={(e) => onChangeFormState('orderPosition', e.target.value)}
                                            />
                                            {formErrors['orderPosition'] && <p className="text-red-500 text-sm">{formErrors['orderPosition']}</p>}
                                        </div>
                                    </div>

                                    <div className="flex flex-col lg:flex-row items-center justify-center gap-4 py-4">
                                        <button
                                            type="button"
                                            className="btn bg-gray-300 text-black text-center shadow hover:opacity-60 w-full lg:w-auto border-none"
                                            onClick={() => {
                                                onClose();
                                            }}
                                            disabled={isSubmitting}
                                        >
                                            <IconXCircle className="w-4 text-black mr-2" />
                                            <span>ยกเลิก</span>
                                        </button>
                                        <button
                                            type="button"
                                            className="btn bg-meelike-dark text-white text-center shadow hover:!bg-gray-300 hover:!text-black w-full lg:w-auto"
                                            onClick={onSubmit}
                                            disabled={isSubmitting}
                                        >
                                            <IconSave className="w-4 mr-2" />
                                            <span>บันทึก</span>
                                        </button>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </Fragment>
    );
};

export default SeviceCategoryFormView;
