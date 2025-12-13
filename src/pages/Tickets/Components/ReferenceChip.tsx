import { type FC, Fragment } from 'react';

interface ReferenceChipProps {
    label: string;
    onClick?: () => void;
}

const ReferenceChip: FC<ReferenceChipProps> = ({ label, onClick }) => {
    return (
        <Fragment>
            <span className="badge font-bold text-meelike-pink bg-white border-meelike-pink cursor-pointer hover:opacity-70 transition-all" onClick={onClick}>
                {label}
            </span>
        </Fragment>
    );
};

export default ReferenceChip;
