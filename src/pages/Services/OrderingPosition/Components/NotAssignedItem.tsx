import { type FC, Fragment } from 'react';

interface Props {}

const NotAssignedItem: FC<Props> = ({}) => {
    return (
        <li className='cursor-not-allowed'>
            <li id='not-assigned-item' className='bg-gray-300 border-none py-1 px-2 rounded-none h-[56px]'>
                <div className='grid grid-cols-12 gap-4 h-full'>
                    <div className='col-span-12'>
                        <div className='flex items-center h-full'>
                            <div className='text-gray-400 font-bold'>Not Assigned</div>
                        </div>
                    </div>
                </div>
            </li>
        </li>
    );
};

export default NotAssignedItem;
