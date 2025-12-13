import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/store/profile';
import { useAuthStore } from '@/store/auth';
import { useShallow } from 'zustand/react/shallow';
import { SidebarMenu } from '@/Configuration/sidebar-menu';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { paths } from '@/router/paths';

const ViewModel = () => {
    const navigate = useNavigate();
    const { profile } = useProfileStore(
        useShallow((state) => ({
            profile: state.data,
        }))
    );
    const { signout } = useAuthStore(
        useShallow((state) => ({
            signout: state.signout,
        }))
    );
    const profileId = profile?.id;
    const profilePermissions = profile?.permissions || [];

    const handleLanding = () => {
        if (profileId !== undefined && profileId !== null) {
            navigate(paths.orders.list);
        }
    };

    useEffect(() => {
        handleLanding();
    }, [profile]);

    return {};
};

export default ViewModel;
