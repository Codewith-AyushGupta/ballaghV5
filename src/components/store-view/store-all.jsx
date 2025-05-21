import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Spinner from '../utils/spinner/full-page-spinner';
import ToolBox from '../toolbox/tool-box';
import SidebarFilterOne from '../sidebar-filter-one/slidebar-filter-one';
import ShopBanner from '../banner/shop-banner';
import { useApiData } from '../../service/api-data-provider';
import StoreDetailView from './store-product-card-detail-view';
import StoreDatabaseService from '../../service/store-database-service';
import CardItem from '../utils/card-item';
function CollectionAll(props) {
    const [store,setStore] = useState([]);
    const {
        storeDatabase,
        storeDatabaseLoading,
        storeDatabaseIsError,

        tenantConfiguration,
        tenantConfigurationLoading,
        tenantConfigurationIsError,
    } = useApiData();
    let storeDatabaseServiceInstance;
    useEffect(()=>{
        if(storeDatabase){
            storeDatabaseServiceInstance = new StoreDatabaseService(storeDatabase);
            let openStoreArray = storeDatabaseServiceInstance.getOpenStore()
            if(openStoreArray){
                setStore(openStoreArray)
            }
        }
    },[storeDatabaseLoading ,storeDatabaseIsError ])
    const { type = "left", isToolbox = false } = props;
    if (storeDatabaseLoading || tenantConfigurationLoading) {
        return <Spinner />;
    }

    if (storeDatabaseIsError || tenantConfigurationIsError) {
        return <div>Error loading data</div>;
    }

    return (
        <>
            <main className="main">
                <Helmet>
                    <title>{tenantConfiguration.REACT_APP_COMPANY_NAME} | {tenantConfiguration.REACT_APP_ALL_STORE_TITLE}</title>
                </Helmet>
                <ShopBanner subTitle="" title={tenantConfiguration.REACT_APP_ALL_STORE_TITLE} current={''} bannerImageUrl={tenantConfiguration.REACT_APP_ALL_STORE_PAGE_BANNER_URL} backgroundColor={''} />
                <div className="page-content mb-lg-10 mb-0 pb-lg-6 pb-0">
                    <div className="container">
                        <div className="row main-content-wrap gutter-lg">
                            <div className="main-content ">
                                {isToolbox && <ToolBox type={type} />}
                                <div className={`row product-wrapper cols-2 cols-sm-3 cols-md-4 ${!isToolbox ? 'mt-5' : ''}`}>
                                    {store.map((singleStore) =>
                                        <>
                                            <CardItem
                                                image1 = {singleStore.storeLogo}
                                                image2 = {''}
                                                hoverButtonText={'View Store'}
                                                subRowText1={singleStore.storeName}
                                                subRowText2={''}
                                                onClickOpen={`/store/${singleStore.storeSlug}`}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                            <SidebarFilterOne collectionData={storeDatabase} type="off-canvas" />
                        </div>
                    </div>
                </div>
            </main >
        </>

    )
}

export default React.memo(CollectionAll);