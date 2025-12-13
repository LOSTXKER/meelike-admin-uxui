import { createContext, useState, useRef, FC, ReactNode } from 'react';

interface IContext {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    open: () => Promise<boolean>;
    acceptTerms: () => void;
    declineTerms: () => void;
}

export const PlaceOrderTermsAndConditionsContext = createContext<IContext>({
    isOpen: false,
    setIsOpen: () => {},
    open: async () => false,
    acceptTerms: () => {},
    declineTerms: () => {},
});

export const PlaceOrderTermsAndConditionsContextProvider: FC<{ children?: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const resolvePromise = useRef<(value: boolean | PromiseLike<boolean>) => void>(() => {});

    const open = () => {
        setIsOpen(true);
        return new Promise<boolean>((resolve) => {
            resolvePromise.current = resolve;
        });
    };

    const acceptTerms = () => {
        setIsOpen(false);
        resolvePromise.current(true);
    };

    const declineTerms = () => {
        setIsOpen(false);
        resolvePromise.current(false);
    };

    return (
        <PlaceOrderTermsAndConditionsContext.Provider
            value={{
                isOpen,
                setIsOpen,
                open,
                acceptTerms,
                declineTerms,
            }}
        >
            {children}
        </PlaceOrderTermsAndConditionsContext.Provider>
    );
};
