import { type FC } from 'react';

interface IconCategoryLikeProps {
    className?: string;
    width?: number;
    height?: number;
}

const IconCategoryLike: FC<IconCategoryLikeProps> = ({ className, width, height }) => {
    return (
        <svg width={width ?? '20'} height={height ?? '20'} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <g clip-path="url(#clip0_97_280)">
                <path
                    d="M19.9668 6.24728C19.6749 3.03402 17.4005 0.702731 14.5542 0.702731C12.6579 0.702731 10.9217 1.72317 9.94471 3.35865C8.97658 1.70202 7.31148 0.702347 5.44561 0.702347C2.59967 0.702347 0.324928 3.03363 0.0333724 6.2469C0.0102942 6.38883 -0.0843267 7.13579 0.203382 8.35394C0.618021 10.111 1.57577 11.7091 2.97239 12.9746L9.9401 19.2976L17.0274 12.975C18.424 11.7091 19.3818 10.1114 19.7964 8.35394C20.0841 7.13618 19.9895 6.38921 19.9668 6.24728Z"
                    fill="currentColor"
                />
            </g>
            <defs>
                <clipPath id="clip0_97_280">
                    <rect width="20" height="20" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
};

export default IconCategoryLike;
