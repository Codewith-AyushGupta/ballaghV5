import React, { Suspense, useEffect, useState } from "react";
import ALink from "../utils/alink";
import MainMenu from "../menu/main-menu";
import CartMenu from "../cart/cart-menu";
import HomeSearch from "../search/home-searchbox";
import { useApiData } from '../../service/api-data-provider';

function Header() {
  const {
    tenantConfiguration,
    tenantConfigurationLoading,
    tenantConfigurationIsError,
    
    headerTabsMetaDataConfiguration,
    headerTabsMetaDataConfigurationLoading,
    headerTabsMetaDataConfigurationIsError
  } = useApiData();
  const [isMenuActive, setIsMenuActive] = useState(false);
  if (tenantConfigurationLoading || headerTabsMetaDataConfigurationLoading) {
    return '';
  }
  if (tenantConfigurationIsError || headerTabsMetaDataConfigurationIsError) {
    return '';
  }
  const showMobileMenu = () => {
    document.querySelector('body').classList.add('mmenu-active');
  };

  return (
    <header className="header hide-on-print">
      <div className="header-middle sticky-header fix-top sticky-content">
        <div className="container">
          <div className="header-left">
            <ALink
              href="#"
              className="mobile-menu-toggle"
              onClick={showMobileMenu}
            >
              <i className="d-icon-bars2"></i>
            </ALink>
            <ALink href="/" className="logo">
              <Suspense fallback={<div>Loading logo...</div>}>
                <img
                  src={tenantConfiguration.REACT_APP_HEADER_SRC}
                  alt={tenantConfiguration.REACT_APP_HEADER_ALT_TEXT}
                  width={tenantConfiguration.REACT_APP_HEADER_WIDTH}
                  height={tenantConfiguration.REACT_APP_HEADER_HEIGHT}
                />
              </Suspense>
            </ALink>
            {tenantConfiguration.REACT_APP_HEADER_SRC_IS_SEARCH_BAR_VISIBLE?<HomeSearch />:null}
          </div>

          <div className="header-right">
            {
              tenantConfiguration.REACT_APP_IS_PHONE_ACTIVE ?
                <>
                  <ALink href={`tel:${tenantConfiguration.REACT_APP_PHONE}`} className="icon-box icon-box-side">
                    <div className="icon-box-icon mr-0 mr-lg-2">
                      <i className="d-icon-phone"></i>
                    </div>
                    <div className="icon-box-content d-lg-show">
                      <h4 className="icon-box-title">Call Us Now:</h4>
                      <p>{tenantConfiguration.REACT_APP_PHONE}</p>
                    </div>
                  </ALink>
                  <span className="divider"></span>
                </>
                : null
            }

            <CartMenu tenantConfiguration={tenantConfiguration} />
          </div>
        </div>
      </div>
      <div className={`header-bottom d-lg-show ${isMenuActive ? 'mmenu-active' : ''}`}>
        <div className="container">
          <div className="header-left">
            <MainMenu {...headerTabsMetaDataConfiguration} />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
