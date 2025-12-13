import { type FC } from 'react';

interface IconCategoryCommentProps {
    className?: string;
    width?: number;
    height?: number;
}

const IconCategoryComment: FC<IconCategoryCommentProps> = ({ className, width, height }) => {
    return (
        <svg width={width ?? '20'} height={height ?? '20'} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path
                d="M9.9998 1.60001C4.92637 1.60001 0.799805 5.18907 0.799805 9.60001C0.799805 12.075 2.13418 14.4266 4.37949 15.9359C4.32637 16.3563 4.11387 17.3766 3.27324 18.5703L2.83105 19.1969L3.62168 19.2C5.79355 19.2 7.2623 17.8688 7.74512 17.3578C8.47793 17.5188 9.23574 17.6 9.9998 17.6C15.0732 17.6 19.1998 14.0109 19.1998 9.60001C19.1998 5.18907 15.0732 1.60001 9.9998 1.60001Z"
                fill="currentColor"
            />
        </svg>
    );
};

export default IconCategoryComment;
