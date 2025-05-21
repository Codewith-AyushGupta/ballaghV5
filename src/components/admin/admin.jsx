import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { useApiData } from '../../service/api-data-provider';
import Spinner from '../utils/spinner/full-page-spinner';
import ALink from '../utils/alink';

function Admin() {
    const {
        tenantConfiguration,
        tenantConfigurationLoading,
        tenantConfigurationIsError,
    } = useApiData();
    if (tenantConfigurationLoading) {
        return <Spinner />;
    }
    if (tenantConfigurationIsError) {
        return <p>Error loading tenant configuration.</p>;
    }
    return (
        <div>
            <Helmet>
                <title>{tenantConfiguration.REACT_APP_COMPANY_NAME} | Admin</title>
            </Helmet>
            <div className="container mt-7 page-content pt-2 pb-1 checkout mb-2">
                <div className="row">
                    <div className="col-lg-12">
                        <ALink href="/report-magic-link" className="col-lg-3 mb-3">
                            <button type='submit' className="btn btn-dark btn-rounded btn-order mb-3">
                                Get Magic Link For Report Generation
                            </button>
                        </ALink>
                        <ALink href="/store-magic-link" className="col-lg-3 mb-3">
                            <button type='submit' className="btn btn-dark btn-rounded btn-order mb-3">
                                Get Magic Link For Store Database Update
                            </button>
                        </ALink>
                        <ALink href="/product-magic-link" className="col-lg-3">
                            <button type='submit' className="btn btn-dark btn-rounded btn-order">
                                Get Magic Link For Product Database Update
                            </button>
                        </ALink>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Admin
