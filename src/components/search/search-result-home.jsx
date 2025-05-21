import React, { useEffect, useState } from "react";
import SideBarFilterSearch from "../sidebar-filter-one/side-bar-filter-search";
import { useLocation } from "react-router-dom";
import { useApiData } from "../../service/api-data-provider";
import Spinner from "../utils/spinner/full-page-spinner";
import { Helmet } from "react-helmet";
import SearchResultService from "../../service/search-result-service";
import CardItem from "../utils/card-item";

function SearchResultHome() {
  const {
    productDatabase,
    productDatabaseLoading,
    productDatabaseIsError,
    storeDatabase,
    storeDatabaseLoading,
    storeDatabaseIsError,
    tenantConfiguration,
    tenantConfigurationLoading,
    tenantConfigurationIsError,
  } = useApiData();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("key");
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState([
    { label: "Products", count: 0 },
    { label: "Stores", count: 0 },
  ]);
  const [activeTab, setActiveTab] = useState("Products");

  useEffect(() => {
    if (productDatabase && storeDatabase) {
      loadSearchResult();
    }
  }, [searchQuery]);
  const loadSearchResult = () => {
    let SearchResultServiceInstance = new SearchResultService(
      productDatabase,
      storeDatabase
    );
    //load matching Products
    let matchingProductResponse =
      SearchResultServiceInstance.getProductByMatchingKey(searchQuery);
    setProducts(matchingProductResponse ? matchingProductResponse : []);
    //load matching Store
    let matchingStoreResponse =
      SearchResultServiceInstance.getStoreByMatchingKey(searchQuery);
    setStores(matchingStoreResponse ? matchingStoreResponse : []);
    let updatedStoreFiltersCount = filters.map((filter) => {
      if (filter.label === "Products") {
        return { ...filter, count: matchingProductResponse.length };
      }
      if (filter.label === "Stores") {
        return { ...filter, count: matchingStoreResponse.length };
      }
      return filter;
    });

    setFilters(updatedStoreFiltersCount);
  };

  if (
    tenantConfigurationLoading ||
    productDatabaseLoading ||
    storeDatabaseLoading
  ) {
    return <Spinner />;
  }

  if (
    tenantConfigurationIsError ||
    productDatabaseIsError ||
    storeDatabaseIsError
  ) {
    return <div>Error loading data</div>;
  }
  return (
    <div className="container">
      <Helmet>
        <title>{tenantConfiguration.REACT_APP_COMPANY_NAME} | Search</title>
      </Helmet>
      <div className="row">
        <h1 className="product-name text-align-center justify-content-center ">
          Search results for "{searchQuery}"
        </h1>
        <div className="col-lg-2">
          <SideBarFilterSearch setActiveTab={setActiveTab} filters={filters} />
        </div>
        <div className="col-lg-10">
          <div className="page-content mb-lg-10 mb-0 pb-lg-6 pb-0">
            <div className="container">
              <div className="row main-content-wrap gutter-lg">
                <div className="main-content">
                  <div
                    className={`row product-wrapper cols-2 cols-sm-3 cols-md-4 mt-5`}
                  >
                    {activeTab === "Products" ? (
                      products && products.length > 0 ? (
                        products.map((product, index) => (
                          <div
                            className="product-wrap"
                            key={`product-${index}`}
                          >
                            <CardItem
                              image1={
                                product?.productVariants[0]?.pictures[0]?.url
                              }
                              image2={
                                product?.productVariants[0]?.pictures[1]?.url
                              }
                              hoverButtonText="View Product"
                              subRowText1={product.name}
                              subRowText2={''}
                              onClickOpen={`/store/${product.storeTag}/products/${product.slug}`}
                            />
                          </div>
                        ))
                      ) : (
                        <div className="no-data text-align-center">
                          No products found
                        </div>
                      )
                    ) : activeTab === "Stores" ? (
                      stores && stores.length > 0 ? (
                        stores.map((store, index) => (
                          <div className="product-wrap" key={`store-${index}`}>
                            <CardItem
                              image1={store.storeLogo}
                              image2={""}
                              hoverButtonText="View Product"
                              subRowText1={store.storeName}
                              subRowText2={''}
                              onClickOpen={`/store/${store.storeSlug}`}
                            />
                          </div>
                        ))
                      ) : (
                        <div className="no-data text-align-center">
                          No stores found
                        </div>
                      )
                    ) : (
                      <div className="no-data text-align-center">
                        No Pages found
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchResultHome;
