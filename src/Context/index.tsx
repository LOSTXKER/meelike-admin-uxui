import { type FC, Fragment, ReactNode } from 'react';

import { ServiceDetailPopupContextProvider } from './ServiceDetailPopup';
import { PlaceOrderTermsAndConditionsContextProvider } from './PlaceOrderTermsAndConditions';
import Axios2faHandler from './Axios2faHandler';

const ContextProvider: FC<{ children?: ReactNode }> = ({ children }) => {
    return (
        <Fragment>
            <PlaceOrderTermsAndConditionsContextProvider>
                <ServiceDetailPopupContextProvider>
                    <Axios2faHandler>{children}</Axios2faHandler>
                </ServiceDetailPopupContextProvider>
            </PlaceOrderTermsAndConditionsContextProvider>
        </Fragment>
    );
};

export default ContextProvider;
