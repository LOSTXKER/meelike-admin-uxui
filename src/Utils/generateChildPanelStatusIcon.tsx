import { ChildPanelStatus } from '@/Data/child-panel-status';
import IconChildPanelWaitForApproval from '@/components/Icon/MeeLike/ChildPanelStatus/10';
import IconChildPanelInProgress from '@/components/Icon/MeeLike/ChildPanelStatus/20';
import IconChildPanelStopped from '@/components/Icon/MeeLike/ChildPanelStatus/30';
import IconChildPanelRejected from '@/components/Icon/MeeLike/ChildPanelStatus/40';

export const generateChildPanelStatusIcon = (status: ChildPanelStatus, width?: number, height?: number): JSX.Element | null => {
    switch (status) {
        case ChildPanelStatus.WAIT_FOR_APPROVAL:
            return <IconChildPanelWaitForApproval width={width} height={height} />;
        case ChildPanelStatus.IN_PROGRESS:
            return <IconChildPanelInProgress width={width} height={height} />;
        case ChildPanelStatus.STOPPED:
            return <IconChildPanelStopped width={width} height={height} />;
        case ChildPanelStatus.REJECTED:
            return <IconChildPanelRejected width={width} height={height} />;
        default:
            return null;
    }
};
