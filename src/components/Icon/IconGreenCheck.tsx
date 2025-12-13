import { type FC } from 'react';

interface IconGreenCheckProps {
    className?: string;
}

const IconGreenCheck: FC<IconGreenCheckProps> = ({ className }) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M22 12C22 17.5225 17.5225 22 12 22C6.4775 22 2 17.5225 2 12C2 6.4775 6.4775 2 12 2C17.5225 2 22 6.4775 22 12Z" fill="#C8E6C9" />
            <path d="M17.293 7.29303L10.508 14.086L7.70697 11.293L6.29297 12.707L10.51 16.914L18.7075 8.70703L17.293 7.29303Z" fill="#4CAF50" />
        </svg>
    );
};

export default IconGreenCheck;
