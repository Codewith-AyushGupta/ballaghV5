import React, { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { connect } from "react-redux";
import ALink from "./alink";
import { cartActions } from "../store/cart";
import { modalActions } from "./modal";
import { wishlistActions } from "../store/wishlistReducer";
import { toDecimal } from ".";
import { useApiData } from '../../service/api-data-provider';
import ProductDatabaseService from "../../service/product-database-service";

function CardItem(props) {
  const {image1,image2,hoverButtonText,subRowText1,subRowText2,onClickOpen} = props;
  const { tenantConfiguration, tenantConfigurationLoading, tenantConfigurationIsError,productDatabase, productDatabaseLoading, productDatabaseIsError} = useApiData();
  if (tenantConfigurationLoading || productDatabaseLoading ) {
    return '';
  }
  if (tenantConfigurationIsError || productDatabaseIsError) {
    return <div>Error loading data</div>;
  }
  return (
    <div className={`product text-left text-center`}>
      <figure className="product-media image-grey-background">
        <ALink
          href={onClickOpen}
        >
          <LazyLoadImage
            alt="product"
            class="image-remove-background"
            src={image1}
            threshold={500}
            effect="opacity"
            width="300"
            height="338"
          />

          { image2? (
            <LazyLoadImage
              alt="product"
              src={image2}
              class="image-remove-background"
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

        <div className="product-action">
          <ALink
            href={onClickOpen}
            className="btn-product btn-quickview"
            title="Quick View"
          >
            {hoverButtonText}
          </ALink>
        </div>
      </figure>

      <div className="product-details">
        <div className="product-cat">
          {/* <ALink>{product.collection.collectionName}</ALink> */}
        </div>
        <h3 className="product-name">
          <ALink
            href={onclick}
          >
            {subRowText1}
          </ALink>
        </h3>
        <div className="product-name">
          <div className="new-price">
            {subRowText2}
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
})(CardItem);
