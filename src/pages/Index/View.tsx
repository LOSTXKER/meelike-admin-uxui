import { Fragment, type FC } from 'react';
import useViewModel from './ViewModel';

const IndexView: FC = () => {
    useViewModel();

    return <Fragment></Fragment>;
};

export default IndexView;
