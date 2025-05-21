import React, { useEffect, useLayoutEffect } from 'react';
import Header from './header/header';
import Footer from './footer/footer';
import Alink from './utils/alink';
import MobileMenu from './menu/mobile-menu';
import { ToastContainer } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import CookieConsentBanner from './cookie-consent/consent-banner';
import { useApiData } from '../service/api-data-provider';
function Layout({ children }) {
    const router = useLocation();
    const {
        tenantConfiguration,
        tenantConfigurationLoading,
        tenantConfigurationIsError,

        headerTabsMetaDataConfiguration,
        headerTabsMetaDataConfigurationLoading,
        headerTabsMetaDataConfigurationIsError
    } = useApiData();

    useLayoutEffect(() => {
        document.querySelector('body').classList.remove('loaded');
    }, [router.pathname]);

    useEffect(() => {
        let bodyClasses = [...document.querySelector("body").classList];
        for (let i = 0; i < bodyClasses.length; i++) {
            document.querySelector('body').classList.remove(bodyClasses[i]);
        }

        setTimeout(() => {
            document.querySelector('body').classList.add('loaded');
        }, 50);
    }, [router.pathname]);
    if (tenantConfigurationLoading || headerTabsMetaDataConfigurationLoading) {
        return '';
    }

    if (tenantConfigurationIsError || headerTabsMetaDataConfigurationIsError) {
        return '';
    }
    return (
        <>
            <div className="page-wrapper">
                <Header />
                {children}
                <CookieConsentBanner cookieName={tenantConfiguration.REACT_APP_COOKIE_NAME} cookieAcceptanceExpirationDays={tenantConfiguration.REACT_APP_CONSENT_ACCEPTANCE_EXPIRE_DAYS} cookieRejectionExpirationDays={tenantConfiguration.REACT_APP_CONSENT_REJECTION_EXPIRE_DAYS} consentHeading={tenantConfiguration.REACT_APP_CONSENT_HEADING} consentDescription={tenantConfiguration.REACT_APP_CONSENT_DESCRIPTION} />
                <Footer />
            </div>
            <Alink id="scroll-top" href="#" title="Top" role="button" className="scroll-top"><i className="d-icon-arrow-up"></i></Alink>
            <MobileMenu {...headerTabsMetaDataConfiguration} />
            <ToastContainer
                autoClose={3000}
                duration={300}
                newestOnTo={true}
                className="toast-container"
                position="bottom-left"
                closeButton={false}
                hideProgressBar={true}
                newestOnTop={true}
            />
        </>
    );
}

export default React.memo(Layout);
