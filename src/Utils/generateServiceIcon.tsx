import IconFacebookCircle from '@/components/Icon/IconFacebookCircle';
import IconInstagram from '@/components/Icon/IconInstagram';
import IconTwitter from '@/components/Icon/IconTwitter';
import IconYoutubeCircle from '@/components/Icon/IconYoutubeCircle';
import IconShopeeCircle from '@/components/Icon/IconShopeeCircle';
import IconTiktokCircle from '@/components/Icon/IconTiktokCircle';
import IconTelegram from '@/components/Icon/IconTelegram';

export const generateServiceIcon = (platform: string, width?: number, height?: number): React.JSX.Element | null => {
    if (platform === 'facebook') {
        return <IconFacebookCircle width={width} height={height} />;
    } else if (platform === 'instagram') {
        return <IconInstagram width={width} height={height} />;
    } else if (platform === 'twitter') {
        return <IconTwitter width={width} height={height} />;
    } else if (platform === 'youtube') {
        return <IconYoutubeCircle width={width} height={height} />;
    } else if (platform === 'shopee') {
        return <IconShopeeCircle width={width} height={height} />;
    } else if (platform === 'tiktok') {
        return <IconTiktokCircle width={width} height={height} />;
    } else if (platform === 'telegram') {
        return <IconTelegram width={width} height={height} />;
    }

    return null;
};
