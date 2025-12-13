import { type FC, Fragment, useState } from 'react';

import IconPlusCircle from '@/components/Icon/IconPlusCircle';
import IconMinusCircle from '@/components/Icon/IconMinusCircle';
import AnimateHeight from 'react-animate-height';

interface FAQsBoxProps {
    title: string;
    data: {
        question: string;
        answer: string | JSX.Element;
    }[];
}

const FAQsBox: FC<FAQsBoxProps> = ({ title, data }) => {
    const [active, setActive] = useState<number | null>(null);

    return (
        <div className="panel p-0 h-full">
            <div className="border-b border-white-light p-6 text-[22px] font-bold dark:border-dark dark:text-white">{title}</div>
            <div className="divide-y divide-white-light px-6 py-4.5 dark:divide-dark">
                {data.map((item, index) => (
                    <Fragment>
                        <div>
                            <div
                                className={`flex cursor-pointer items-center justify-between gap-10 px-2.5 py-2 text-base font-semibold hover:bg-meelike-secondary hover:text-meelike-dark-2
        ${active === index ? 'bg-meelike-secondary !text-meelike-dark-2' : ''}`}
                                onClick={() => setActive(active === index ? null : index)}
                            >
                                <span>{item.question}</span>
                                {active !== index ? (
                                    <span className="shrink-0">
                                        <IconPlusCircle duotone={false} />
                                    </span>
                                ) : (
                                    <span className="shrink-0">
                                        <IconMinusCircle fill={true} />
                                    </span>
                                )}
                            </div>
                            <AnimateHeight duration={300} height={active === index ? 'auto' : 0}>
                                <div className="px-1 py-3 font-semibold text-white-dark">
                                    <p>{item.answer}</p>
                                </div>
                            </AnimateHeight>
                        </div>
                    </Fragment>
                ))}
            </div>
        </div>
    );
};

export default FAQsBox;
