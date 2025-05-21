import React from "react";
import ALink from "../utils/alink";
import { useApiData } from '../../service/api-data-provider';

export default function Footer() {
  const { 
    tenantConfiguration, 
    tenantConfigurationLoading, 
    tenantConfigurationIsError 
  } = useApiData();

  if (tenantConfigurationLoading) {
    return '';
  }

  if (tenantConfigurationIsError || !tenantConfiguration) {
    return '';
  }

  return (
    <footer className="footer hide-on-print">
      <div className="container">
        <div className="footer-middle">
          <div className="row">
            <div className="col-lg-4 col-sm-6">
              <div className="widget widget-about">
                <ALink href="/" className="logo-footer mb-4">
                  <img
                    src={tenantConfiguration.REACT_APP_FOOTER_SRC}
                    alt={tenantConfiguration.REACT_APP_FOOTER_ALT_TEXT}
                    width={tenantConfiguration.REACT_APP_FOOTER_WIDTH}
                    height={tenantConfiguration.REACT_APP_FOOTER_HEIGHT}
                  />
                </ALink>
                <div className="widget-body">
                  {tenantConfiguration.REACT_APP_ADDRESS_LINE1}
                  <br />
                  <p>
                    {tenantConfiguration.REACT_APP_ADDRESS_LINE2}
                    <br />
                    {tenantConfiguration.REACT_APP_ADDRESS_LINE3}
                    <br />
                    {tenantConfiguration.REACT_APP_ADDRESS_LINE4}
                    <br />
                  </p>
                  <ALink href={`mailto:${tenantConfiguration.REACT_APP_EMAIL}`}>
                    {tenantConfiguration.REACT_APP_EMAIL}
                  </ALink>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-left"></div>
          <div className="footer-center">
            <p className="copyright">{tenantConfiguration.REACT_APP_COPYRIGHT}</p>
          </div>
          <div className="footer-right">
            <div className="social-links">
              <ALink
                href={tenantConfiguration.REACT_APP_SOCIAL_MEDIA_FACEBOOK}
                className="social-link social-facebook fab fa-facebook-f"
              ></ALink>
              <ALink
                href={tenantConfiguration.REACT_APP_SOCIAL_MEDIA_TWITTER}
                className="social-link social-twitter fab fa-twitter"
              ></ALink>
              <ALink
                href={tenantConfiguration.REACT_APP_SOCIAL_MEDIA_LINKEDIN}
                className="social-link social-linkedin fab fa-linkedin-in"
              ></ALink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
