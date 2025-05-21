import React, { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { connect } from "react-redux";
import ALink from "../utils/alink";
import { cartActions } from "../store/cart";
import { modalActions } from "../utils/modal";
import { wishlistActions } from "../store/wishlistReducer";
import { toDecimal } from "../utils";
import { useApiData } from '../../service/api-data-provider';
import ProductDatabaseService from "../../service/product-database-service";

function ProductViewCard(props) {
  const {product,adClass = "text-center",storeSlug = "",} = props;
  const [productVariant , setProductVariant] = useState();
  const { tenantConfiguration, tenantConfigurationLoading, tenantConfigurationIsError,productDatabase, productDatabaseLoading, productDatabaseIsError} = useApiData();
  useEffect(()=>{
    if(productDatabase){
      getProductDefaultVariant();
    }
  },[])
  const getProductDefaultVariant = ()=>{
    let ProductDatabaseServiceInstance = new ProductDatabaseService(productDatabase)
    let defaultProductVariant = ProductDatabaseServiceInstance.getDefaultProductVariant(product.slug);
    if(defaultProductVariant){
      setProductVariant(defaultProductVariant);
    }
  }
  if (tenantConfigurationLoading || productDatabaseLoading ||!productVariant) {
    return '';
  }
  if (tenantConfigurationIsError || productDatabaseIsError) {
    return <div>Error loading data</div>;
  }
  return (
    <div className={`product text-left ${adClass}`}>
      <figure className="product-media">
        <ALink
          href={`${
            storeSlug.length > 0 ? `/store/${storeSlug}` : ""
          }/products/${productVariant.slug}`}
        >
          <LazyLoadImage
            alt="product"
            src={productVariant.pictures.length >1?productVariant.pictures[0].url:''}
            threshold={500}
            effect="opacity"
            width="300"
            height="338"
          />

          {productVariant.pictures.length >= 2 ? (
            <LazyLoadImage
              alt="product"
              src={productVariant.pictures[1].url}
              threshold={500}
              width="300"
              height="338"
              effect="opacity"
              wrapperClassName="product-image-hover"
            />
          ) : (
            ""
          )}
        </ALink>

        <div className="product-label-group">
          {productVariant.is_new && (
            <label className="product-label label-new">New</label>
          )}
          {productVariant.is_top && (
            <label className="product-label label-top">Top</label>
          )}
          {productVariant.discount > 0 && productVariant.variants.length === 0 && (
            <label className="product-label label-sale">
              {productVariant.discount}% OFF
            </label>
          )}
          {productVariant.discount > 0 && productVariant.variants.length > 0 && (
            <label className="product-label label-sale">Sale</label>
          )}
        </div>

        <div className="product-action">
          <ALink
            href={
              storeSlug.length > 0
                ? `/store/${storeSlug}/products/${productVariant.slug}`
                : `/storeSlug/${productVariant.slug}`
            }
            className="btn-product btn-quickview"
            title="Quick View"
          >
            View
          </ALink>
        </div>
      </figure>

      <div className="product-details">
        <div className="product-cat">
          {/* <ALink>{product.collection.collectionName}</ALink> */}
        </div>
        <h3 className="product-name">
          <ALink
            href={
              storeSlug.length > 0
                ? `/store/${storeSlug}/products/${product.slug}`
                : `/products/${productVariant.slug}`
            }
          >
            {productVariant.name}
          </ALink>
        </h3>
        <div className="product-name">
          <div className="new-price">
            {tenantConfiguration.REACT_APP_CURRENCY}
            {toDecimal(productVariant.price)}
          </div>
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    wishlist: state.wishlist.data ? state.wishlist.data : [],
  };
}

export default connect(mapStateToProps, {
  toggleWishlist: wishlistActions.toggleWishlist,
  addToCart: cartActions.addToCart,
  ...modalActions,
})(ProductViewCard);
