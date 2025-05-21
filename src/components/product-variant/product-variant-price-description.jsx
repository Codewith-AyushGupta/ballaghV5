import React, { useEffect, useState } from 'react'
import { fadeIn } from "../utils/keyFrames";
import Reveal from "react-awesome-reveal";
import { useApiData } from '../../service/api-data-provider';
import ALink from '../utils/alink';
import { useParams } from 'react-router-dom';
import StoreDatabaseService from '../../service/store-database-service';
function ProductVariantPriceDescription(props) {
  const { storeSlug } = useParams();
  const { tenantConfiguration, tenantConfigurationLoading, tenantConfigurationIsError, storeDatabase,storeDatabaseIsError,storeDatabaseLoading} = useApiData();
  const { productVariant } = props;
  const [store , setStore] = useState(null);
  let storeDatabaseInstance ;
  useEffect(()=>{
    if(storeDatabase){
      storeDatabaseInstance = new StoreDatabaseService(storeDatabase);
      let storeResponse = storeDatabaseInstance.getStoreByStoreSlug(storeSlug);
      if(storeResponse){
        setStore(storeResponse);
      }
    }
  },[tenantConfigurationLoading, tenantConfigurationIsError,storeDatabaseIsError,storeDatabaseLoading])
  if (tenantConfigurationLoading || !productVariant || storeDatabaseLoading || !store) {
    return ''
  }
  if (tenantConfigurationIsError || storeDatabaseIsError) {
    return <div>Error loading data</div>;
  }
  return (
    <div>
      <main className="main contact-us">
        <div className="page-content pt-3">
          <Reveal keyframes={fadeIn} delay="50" duration="1000" triggerOnce>
            <section className="contact-section">
              <nav className="breadcrumb-nav">
                <div className="container pl-1">
                  <ul className="breadcrumb">
                    <li>
                      <ALink href="/">
                        <i className="d-icon-home"></i>
                      </ALink>
                    </li>
                    <li>
                      <ALink href="../">
                        {store.storeName}
                      </ALink>
                    </li>
                    <li>{productVariant.name}</li>
                  </ul>
                </div>
              </nav>
              <div className="w-100">
                <h4 className="ls-m font-weight-bold">
                  {productVariant.name}
                </h4>
                <p>{productVariant.short_description}</p>
                <h5>
                  {tenantConfiguration.REACT_APP_CURRENCY}
                  {productVariant.price}
                </h5>
              </div>
            </section>
          </Reveal>
        </div>
      </main>
    </div>
  )
}

export default ProductVariantPriceDescription
