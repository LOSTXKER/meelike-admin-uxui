import { type FC, Fragment } from 'react';
import IconTrash from '@/components/Icon/IconTrash';

interface AttachmentProps {
    url: string;
}

const Attachment: FC<AttachmentProps> = ({ url }) => {
    return (
        <Fragment>
            <div className="shadow h-24 w-24 rounded-lg flex items-center justify-center transition-all relative p-0 overflow-hidden">
                {/* {(file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg') &&  */}
                <img src={url} alt={url} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = '/assets/meelike/no-img.png')} />
                {/* } */}

                {/* {(file.type === 'video/mp4' || file.type === 'video/mov') && <video src={URL.createObjectURL(file)} className="h-20 w-20 object-cover" controls />} */}
            </div>
        </Fragment>
    );
};

export default Attachment;
