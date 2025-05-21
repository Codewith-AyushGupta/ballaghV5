import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import ShopBanner from '../banner/shop-banner';
import { useParams } from "react-router-dom";
import Spinner from '../utils/spinner/full-page-spinner';
import ProductDatabaseService from '../../service/product-database-service';
import ProductViewCard from './product-view-card';
import { useApiData } from '../../service/api-data-provider';
import StoreDatabaseService from '../../service/store-database-service';
import CardItem from '../utils/card-item';
import StoreBanner from '../banner/store-banner';
function ProductView() {
    const { storeSlug } = useParams();
    const [defaultProductProductVariant, setDefaultProductVariant] = useState([]);
    const [store, setStore] = useState([]);
    const [productVariant, setProductVariant] = useState();
    const {
        storeDatabase,
        storeDatabaseLoading,
        storeDatabaseIsError,

        productDatabase,
        productDatabaseLoading,
        productDatabaseIsError,

        tenantConfiguration,
        tenantConfigurationLoading,
        tenantConfigurationIsError
    } = useApiData();

    useEffect(() => {
        if (!productDatabaseLoading && !storeDatabaseLoading) {
            getProductsForStore();
        }
    }, [storeSlug, productDatabaseLoading, storeDatabaseLoading]);
    const getProductsForStore = () => {
        try {

            let ProductDatabaseServiceInstance = new ProductDatabaseService(productDatabase)
            let StoreDatabaseServiceInstance = new StoreDatabaseService(storeDatabase)

            const filteredProducts = ProductDatabaseServiceInstance.getDefaultProductsVariantArrayByStoreSlug(storeSlug);
            const filteredStore = StoreDatabaseServiceInstance.getStoreByStoreSlug(storeSlug);
            setDefaultProductVariant(filteredProducts);
            setStore(filteredStore);
        } catch (error) {
            console.error('Error loading products:', error);
            setDefaultProductVariant([]);
        }
    };

    if (productDatabaseLoading || storeDatabaseLoading || tenantConfigurationLoading) {
        return <Spinner />;
    }

    if (productDatabaseIsError || storeDatabaseIsError || tenantConfigurationIsError) {
        return <div>Error loading data</div>;
    }
    if (defaultProductProductVariant === undefined) {
        return <div>No products available for this collection.</div>;
    }
    return (
        <main className="main">
            <Helmet>
                <title>Store | {String(store.storeName)}</title>
            </Helmet>
            <StoreBanner store={store}/>
            <div className="page-content mb-lg-10 mb-0 pb-lg-6 pb-0">
                <div className="container">
                    <div className="row main-content-wrap gutter-lg">
                        <div className="main-content">
                            <div className={`row product-wrapper cols-2 cols-sm-3 cols-md-4 mt-5`}>
                                {defaultProductProductVariant.map(item => (
                                    <div className="product-wrap" key={'shop-' + item.slug}>
                                        <CardItem
                                            image1={item.bundleItems? item.bundleDefaultImage.pictures[0].url: item.pictures[0].url}
                                            image2={item.bundleItems? item.bundleDefaultImage.pictures[0].url: item.pictures[0].url}
                                            hoverButtonText={'View Product'}
                                            subRowText1={item.name}
                                            subRowText2={`${tenantConfiguration.REACT_APP_CURRENCY} ${item.price}`}
                                            onClickOpen={`/store/${storeSlug}/products/${item.slug}`}
                                        />
                                    </div>
                                ))}

                            </div>
                            {
                                defaultProductProductVariant.length === 0 ? <h2 className=" text-align-center container post-title">
                                    No Products For This Store
                                </h2> : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default React.memo(ProductView);
