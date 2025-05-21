import React, { useEffect } from "react";
import Helmet from "react-helmet";
import ALink from "../components/utils/alink";
import { parallaxHandler } from "../components/utils";
import { useApiData } from '../service/api-data-provider';
import Spinner from "../components/utils/spinner/full-page-spinner";

function Error404() {
  const { 
    tenantConfiguration, 
    tenantConfigurationLoading, 
    tenantConfigurationIsError,
    tenantConfigurationErrorMessage,
  } = useApiData();

  useEffect(() => {
    window.addEventListener("scroll", parallaxHandler, true);

    return () => {
      window.removeEventListener("scroll", parallaxHandler, true);
    };
  }, []);

  if (tenantConfigurationLoading) {
    return <Spinner />;
  }

  if (tenantConfigurationIsError) {
    return ''
  }
  return (
    <main className="main">
      <Helmet>
        <title>{tenantConfiguration.REACT_APP_COMPANY_NAME} | 404</title>
      </Helmet>

      <h1 className="d-none">404</h1>

      <div className="page-content">
        <section className="error-section d-flex flex-column justify-content-center align-items-center text-center pl-3 pr-3">
          <h1 className="mb-2 ls-m">Error 404</h1>
          <img
            src={tenantConfiguration.REACT_APP_PAGE_NOT_FOUND_SRC}
            alt={tenantConfiguration.REACT_APP_PAGE_NOT_FOUND_ALT_TEXT}
            width={tenantConfiguration.REACT_APP_PAGE_NOT_FOUND_WIDTH}
            height={tenantConfiguration.REACT_APP_PAGE_NOT_FOUND_HEIGHT}
          />
          <h4 className="mt-7 mb-0 ls-m text-uppercase">
            Ooopps! That page can’t be found.
          </h4>
          <p className="text-grey font-primary ls-m">
            It looks like nothing was found at this location.
          </p>
          <ALink href="/" className="btn btn-primary btn-rounded mb-4">
            Go home
          </ALink>
        </section>
      </div>
    </main>
  );
}

export default React.memo(Error404);
