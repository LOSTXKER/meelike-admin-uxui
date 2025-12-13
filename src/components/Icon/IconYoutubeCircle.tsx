import { type FC } from 'react';

interface IconYoutubeCircleProps {
    className?: string;
    width?: number;
    height?: number;
}

const IconYoutubeCircle: FC<IconYoutubeCircleProps> = ({ className, width, height }) => {
    return (
        <svg width={width ?? '20'} height={height ?? '20'} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path
                d="M17.9998 14.125C17.8332 15 17.1248 15.6667 16.2498 15.7917C14.8748 16 12.5832 16.25 9.99984 16.25C7.45817 16.25 5.1665 16 3.74984 15.7917C2.87484 15.6667 2.1665 15 1.99984 14.125C1.83317 13.1667 1.6665 11.75 1.6665 10C1.6665 8.25 1.83317 6.83333 1.99984 5.875C2.1665 5 2.87484 4.33333 3.74984 4.20833C5.12484 4 7.4165 3.75 9.99984 3.75C12.5832 3.75 14.8332 4 16.2498 4.20833C17.1248 4.33333 17.8332 5 17.9998 5.875C18.1665 6.83333 18.3748 8.25 18.3748 10C18.3332 11.75 18.1665 13.1667 17.9998 14.125Z"
                fill="#FF3D00"
            />
            <path d="M8.3335 12.9167V7.08333L13.3335 9.99999L8.3335 12.9167Z" fill="white" />
        </svg>
    );
};

export default IconYoutubeCircle;
