import React from 'react';

interface StatusProps {
    isActive: boolean;
    activeText?: string;
    inactiveText?: string;
}

const Status: React.FC<StatusProps> = ({ isActive, activeText = 'เปิดใช้งาน', inactiveText = 'ปิดใช้งาน' }) => {
    return (
        <div className={`inline-block px-3 py-1 text-xs font-medium rounded-xl border ${isActive ? 'text-green-500 border-green-500 bg-green-50' : 'text-red-500 border-red-500 bg-red-50'}`}>
            {isActive ? activeText : inactiveText}
        </div>
    );
};

export default Status;
