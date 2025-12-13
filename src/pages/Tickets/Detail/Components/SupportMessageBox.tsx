import { type FC, Fragment } from 'react';
import moment from 'moment';
import 'moment-timezone';
import IconDownload from '@/components/Icon/IconDownload';

interface SupportMessageBoxProps {
    author: string;
    messageType: 'text' | 'file' | 'video';
    message: string | { message: string; createdAt: string };
    time: string;
}

const SupportMessageBox: FC<SupportMessageBoxProps> = ({ author, messageType, message, time }) => {
    const getMessageContent = () => {
        return typeof message === 'string' ? message : message?.message || '';
    };

    const getMessageUrl = () => {
        return typeof message === 'string' ? message : '';
    };

    const downloadImage = async () => {
        try {
            const url = getMessageUrl();
            const response = await fetch(url);
            const blob = await response.blob();
            const objectUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = objectUrl;
            link.download = `image_${Date.now()}.jpg`; // You can customize the filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(objectUrl);
        } catch (error) {
            console.error('Error downloading image:', error);
        }
    };

    return (
        <Fragment>
            <div className="panel border-meelike-primary border">
                <div className="text-meelike-dark font-bold mb-5">
                    {author}
                    <span className="ml-2 text-gray-600 text-sm font-medium">({moment(time).format('DD/MM/YYYY HH:mm:ss')})</span>
                </div>
                {messageType === 'text' && <div className="text-meelike-dark-2" dangerouslySetInnerHTML={{ __html: getMessageContent().replace(/\\n/g, '<br />') }}></div>}
                {messageType === 'file' && (
                    <div className="flex flex-row items-center gap-3">
                        <div className="flex flex-row items-center gap-3">
                            <img src={getMessageUrl()} alt="file" className="w-8 h-8" />
                        </div>
                        <button type="button" className="btn bg-meelike-primary font-bold text-meelike-dark text-center px-4 py-2 shadow border-none cursor" onClick={downloadImage}>
                            <IconDownload className="w-4 h-4 mr-2" />
                            Download
                        </button>
                    </div>
                )}
                {messageType === 'video' && (
                    <div className="flex flex-col gap-3">
                        <video controls className="max-w-full h-auto rounded-lg">
                            <source src={getMessageUrl()} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                )}
            </div>
        </Fragment>
    );
};

export default SupportMessageBox;
