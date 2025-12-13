import { type FC } from 'react';

interface IconCategoryRetweetProps {
    className?: string;
    width?: number;
    height?: number;
}

const IconCategoryRetweet: FC<IconCategoryRetweetProps> = ({ className, width, height }) => {
    return (
        <svg
            fill="currentColor"
            version="1.1"
            baseProfile="tiny"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width={width ?? '800px'}
            height={height ?? '800px'}
            viewBox="-0.5 0.5 42 42"
            xmlSpace="preserve"
            className={className}
        >
            <path
                d="M24.5,30.5l7.96,7.371L40.5,30.5h-5V9.549c0-2.5-0.561-3.049-3-3.049h-18l6.641,6H29.5v18H24.5z M16.5,12.5L8.52,5.16
       L0.5,12.5h5v21.049c0,2.5,0.62,2.951,3,2.951h18.32l-6.32-6h-9v-18H16.5z"
            />
        </svg>
    );
};

export default IconCategoryRetweet;
