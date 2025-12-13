import { createContext, useState, useRef, FC, ReactNode } from 'react';

interface IContext {
    isOpen: boolean;
    serviceId: string;
    open: (serviceId: string) => void;
    close: () => void;
}

export const ServiceDetailPopupContext = createContext<IContext>({
    isOpen: false,
    serviceId: '',
    open: () => {},
    close: () => {},
});

export const ServiceDetailPopupContextProvider: FC<{ children?: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [serviceId, setServiceId] = useState('');

    const open = (serviceId: string) => {
        setServiceId(serviceId);
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
    };

    return (
        <ServiceDetailPopupContext.Provider
            value={{
                isOpen,
                serviceId,
                open,
                close,
            }}
        >
            {children}
        </ServiceDetailPopupContext.Provider>
    );
};
