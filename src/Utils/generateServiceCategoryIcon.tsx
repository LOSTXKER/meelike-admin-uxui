import IconCategoryLike from '@/components/Icon/IconCategoryLike';
import IconCategoryComment from '@/components/Icon/IconCategoryComment';
import IconCategoryShare from '@/components/Icon/IconCategoryShare';
import IconCategoryLive from '@/components/Icon/IconCategoryLive';
import IconCategoryRetweet from '@/components/Icon/IconCategoryRetweet';
import IconCategoryFollowing from '@/components/Icon/IconCategoryFollowing';
import IconEye from '@/components/Icon/IconEye';

export const generateServiceCategoryIcon = (category: string, width?: number, height?: number): React.JSX.Element | null => {
    if (category === 'like') {
        return <IconCategoryLike width={width} height={height} className="text-meelike-service-category-like" />;
    } else if (category === 'comment') {
        return <IconCategoryComment width={width} height={height} className="text-meelike-service-category-comment" />;
    } else if (category === 'share') {
        return <IconCategoryShare width={width} height={height} className="text-meelike-service-category-share" />;
    } else if (category === 'live') {
        return <IconCategoryLive width={width} height={height} className="text-meelike-service-category-live" />;
    } else if (category === 'retweet') {
        return <IconCategoryRetweet width={width} height={height} className="text-meelike-service-category-retweet" />;
    } else if (category === 'view') {
        return <IconEye width={width} height={height} className="text-meelike-service-category-view" />;
    } else if (category === 'following') {
        return <IconCategoryFollowing width={width} height={height} className="text-meelike-service-category-following" />;
    }

    return null;
};
