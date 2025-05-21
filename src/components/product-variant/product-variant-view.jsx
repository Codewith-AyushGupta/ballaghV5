import React, { useState, useEffect, memo } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import Spinner from "../utils/spinner/full-page-spinner";
import ProductDatabaseService from "../../service/product-database-service";
import { useApiData } from '../../service/api-data-provider';
import ProductVariantPriceDescription from "./product-variant-price-description";
import ProductVariantSearch from "./product-variant-search";
import ProductCustomisationForm from "./product-customisations-form";
import ProductVariantMediaViewer from "./product-varient-media-viewer";
import ProductAddToCart from "./product-add-to-cart";

function ProductVariantView(props) {
  const { productDatabase, productDatabaseLoading, productDatabaseIsError } = useApiData();
  const { productSlug } = useParams();
  const [productVariant, setProductVariant] = useState(null);
  const [product, setProduct] = useState(null);
  const [bundleProduct, setBundleProduct] = useState(null);
  const [productDatabaseServiceInstance, setProductDatabaseServiceInstance] = useState()

  useEffect(() => {
    if (!productDatabaseLoading) {
      let instance = new ProductDatabaseService(productDatabase);
      setProductDatabaseServiceInstance(instance);
    }
  }, [productDatabase, productDatabaseLoading]);
  useEffect(() => {
    if (productDatabaseServiceInstance) {
      loadProduct();
      loadDefaultProductVariant();
    }
  }, [productDatabaseServiceInstance, productSlug]);

  const loadProduct = () => {
    if (productDatabaseServiceInstance) {
      let product = productDatabaseServiceInstance.getProductByProductSlug(productSlug);
      setProduct(product);
    }
  };
  const loadDefaultProductVariant = () => {
    let defaultProductVariant = productDatabaseServiceInstance.getDefaultProductVariant(productSlug);
    if (defaultProductVariant) {
      setProductVariant({ ...defaultProductVariant });
    }
  };
  const handleVariantSearchForm = (e) => {
    e.preventDefault();
    const formElement = document.getElementById(e.target.form.id);
    const variantMatrixToSearch = productDatabaseServiceInstance.createVariantMatrixFromSelectorForm(formElement);
    let productVariant = productDatabaseServiceInstance.getProductVariantBasedOnFilters(productSlug, variantMatrixToSearch);
    if (productVariant) {
      setProductVariant({ ...productVariant });
    }
  };
  const handleVariantSearchFormForBundleProducts = (e) => {
    let fromId = e.target.form.id;
    const formElement = document.getElementById(fromId);
    const variantMatrixToSearch = productDatabaseServiceInstance.createVariantMatrixFromSelectorForm(formElement);
    product.bundleItems.map((singleBundleItem)=>{
      if(fromId.includes(singleBundleItem.slug)){
        singleBundleItem.productVariants[0].variantMatrix = variantMatrixToSearch
      }
    })
  }
  if (productDatabaseLoading || !product) {
    return <Spinner />;
  }
  if (productDatabaseIsError) {
    return <div>Error loading data</div>;
  }
  return (
    <div>
      <Helmet>
        <title>Product | {product.name}</title>
      </Helmet>
      <div className="page-content mb-10 pb-6">
        <div className="container vertical">
          <div className="row product product-single mb-2">
            <div className="col-md-6 mt-4 sticky-sidebar-wrapper">
              <ProductVariantMediaViewer productVariant={productVariant} />
            </div>
            <div className="col-md-6">
              <ProductVariantPriceDescription productVariant={productVariant} />
              {
                product.bundleItems ?
                  product.bundleItems.map((singleBundleItem) => (
                    <>
                      <p>{singleBundleItem.name}</p>
                      <ProductVariantSearch formId={`product-variant-${singleBundleItem.slug}`} product={singleBundleItem} handleVariantSearchForm={handleVariantSearchFormForBundleProducts} productVariant={singleBundleItem.productVariants[0]} />
                      <ProductCustomisationForm formId={`customisation-${singleBundleItem.slug}`} productVariant={singleBundleItem.productVariants[0]} />
                    </>
                  )) :
                  <>
                    <ProductVariantSearch  formId={`productVariantSearchForm`} product={product} handleVariantSearchForm={handleVariantSearchForm} productVariant={productVariant} />
                    <ProductCustomisationForm formId={`customisationForm`} productVariant={productVariant} />
                  </>
              }
              <ProductAddToCart product={product} productVariant={productVariant} />
            </div>
          </div>
        </div>
      </div>
    </div>

  )

}
export default ProductVariantView;
