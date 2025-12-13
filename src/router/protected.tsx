import { Fragment } from 'react';

// Authentication bypassed - always allow access
export const ProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    return <Fragment>{children}</Fragment>;
};
