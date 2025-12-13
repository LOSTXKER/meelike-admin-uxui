import { type FC } from 'react';

interface IconWatchStopPlayProps {
    className?: string;
    width?: number;
    height?: number;
}

const IconWatchStopPlay: FC<IconWatchStopPlayProps> = ({ className, width, height }) => {
    return (
        <svg width={width ?? '34'} height={height ?? '34'} viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M14.1667 2.83334H19.8334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path
                d="M19.674 15.491C21.1968 16.7332 21.9583 17.3543 21.9583 18.4167C21.9583 19.479 21.1968 20.1001 19.674 21.3424C19.2537 21.6853 18.8367 22.0082 18.4536 22.2772C18.1174 22.5132 17.7368 22.7574 17.3427 22.997C15.8234 23.9209 15.0638 24.3828 14.3825 23.8714C13.7012 23.36 13.6393 22.2893 13.5155 20.148C13.4804 19.5425 13.4583 18.9489 13.4583 18.4167C13.4583 17.8845 13.4804 17.2908 13.5155 16.6853C13.6393 14.544 13.7012 13.4734 14.3825 12.9619C15.0638 12.4505 15.8234 12.9124 17.3427 13.8363C17.7368 14.076 18.1174 14.3201 18.4536 14.5561C18.8367 14.8252 19.2537 15.148 19.674 15.491Z"
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <path
                d="M10.625 7.37238C12.5004 6.28755 14.6777 5.66666 17 5.66666C24.0416 5.66666 29.75 11.375 29.75 18.4167C29.75 25.4583 24.0416 31.1667 17 31.1667C9.95837 31.1667 4.25 25.4583 4.25 18.4167C4.25 16.0943 4.87089 13.917 5.95572 12.0417"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
};

export default IconWatchStopPlay;
