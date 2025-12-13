import { FC, useState } from 'react';
import { clsx } from '@mantine/core';

interface OtpPopupProps {
    title: string;
    message: string;
    onConfirm: (otp: string) => void;
    onCancel: () => void;
}

const OtpPopup: FC<OtpPopupProps> = ({ title, message, onConfirm, onCancel }) => {
    const [otp, setOtp] = useState('');

    const handleConfirm = () => {
        if (otp.trim()) {
            onConfirm(otp);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <p className="text-sm text-gray-600 mb-4">{message}</p>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} className="form-input w-full mb-4" placeholder="Enter OTP" />
                <div className="flex justify-end gap-2">
                    <button onClick={onCancel} className="btn bg-gray-300 text-gray-700 hover:bg-gray-400 px-4 py-2 rounded">
                        Cancel
                    </button>
                    <button onClick={handleConfirm} className={clsx('btn bg-blue-500 text-white px-4 py-2 rounded', { 'opacity-50 cursor-not-allowed': !otp.trim() })} disabled={!otp.trim()}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OtpPopup;
