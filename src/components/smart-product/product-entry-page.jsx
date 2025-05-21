import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useApiData } from '../../service/api-data-provider';
import Spinner from '../utils/spinner/full-page-spinner';
import ProductDatabaseService from '../../service/product-database-service';
import StoreDatabaseService from '../../service/store-database-service';
import SingleProductDummy from '../dummy-product/single-product-dummy';
import BundleProductDummy from '../dummy-product/bundle-product-dummy';
import { Helmet } from 'react-helmet';
function ProductEntryPage() {
    const { productDatabase, productDatabaseLoading, productDatabaseIsError ,storeDatabase, storeDatabaseLoading, storeDatabaseIsError } = useApiData();
    const { productSlug } = useParams();
    const { storeSlug } = useParams();
    const [product, setProduct] = useState(null)
    const [store, setStore] = useState(null)
    let productDatabaseServiceInstance;
    let storeDatabaseServiceInstance;

    useEffect(() => {
        if (!productDatabaseLoading && productDatabase && !storeDatabaseLoading && storeDatabase) {
            productDatabaseServiceInstance = new ProductDatabaseService(productDatabase);
            storeDatabaseServiceInstance = new StoreDatabaseService(storeDatabase);

            let productResponse = productDatabaseServiceInstance.getProductByProductSlug(productSlug);
            let storeResponse = storeDatabaseServiceInstance.getStoreByStoreSlug(storeSlug);

            if (productResponse) {
                setProduct(productResponse);
            }
            if(storeResponse){
                setStore(storeResponse);
            }
        }

    }, [productDatabaseLoading , storeDatabaseLoading])
    
    if (productDatabaseLoading  || !store || storeDatabaseLoading) {
        return <Spinner/>;
    }
    if (productDatabaseIsError || storeDatabaseIsError) {
        return <div>Error loading data</div>;
    }
    if(product === null){
        
        return <div>No Product Found</div>;
    }
    return (
        <div>
            <Helmet>
                <title>Product | {product.name}</title>
            </Helmet>
            {
                product.bundleItems ? <BundleProductDummy store={store} product={product} /> : <SingleProductDummy store={store} product={product} />
            }
        </div>
    )
}

export default ProductEntryPage
