import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Spinner from '../utils/spinner/full-page-spinner';
import ProductDatabaseService from '../../service/product-database-service';
import CollectionDetailView from './collection-detail-view';
import ToolBox from '../toolbox/tool-box';
import SidebarFilterOne from '../sidebar-filter-one/slidebar-filter-one';
import ShopBanner from '../banner/shop-banner';
import { useApiData } from '../../service/api-data-provider';


function CollectionAll(props) {
    const {
        productDatabase,
        productDatabaseLoading,
        productDatabaseIsError,

        tenantConfiguration,
        tenantConfigurationLoading,
        tenantConfigurationIsError,
    } = useApiData();

    const { type = "left", isToolbox = false } = props;
    if (productDatabaseLoading || tenantConfigurationLoading) {
        return <Spinner />;
    }

    if (productDatabaseIsError || tenantConfigurationIsError) {
        return <div>Error loading data</div>;
    }
    return (
        <>
            <main className="main">
                <Helmet>
                    <title>{tenantConfiguration.REACT_APP_COMPANY_NAME} |All Collections</title>
                </Helmet>
                <ShopBanner subTitle="" title={'All Collections'} current={''} bannerImageUrl={tenantConfiguration.REACT_APP_ALL_COLLECTION_PAGE_BANNER_URL} backgroundColor={''} />
                <div className="page-content mb-lg-10 mb-0 pb-lg-6 pb-0">
                    <div className="container">
                        <div className="row main-content-wrap gutter-lg">
                            <div className="main-content ">
                                {isToolbox && <ToolBox type={type} />}
                                <div className={`row product-wrapper cols-2 cols-sm-3 cols-md-4 ${!isToolbox ? 'mt-5' : ''}`}>
                                    {productDatabase.map((singleCollection) =>
                                        <>
                                            <CollectionDetailView
                                                {...singleCollection}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                            <SidebarFilterOne collectionData={productDatabase} type="off-canvas" />
                        </div>
                    </div>
                </div>
            </main >
        </>

    )
}

export default React.memo(CollectionAll);