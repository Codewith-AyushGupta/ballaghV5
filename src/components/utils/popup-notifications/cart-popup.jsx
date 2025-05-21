import React from "react";
import ALink from "../alink";
import { toDecimal } from "..";
import { useApiData } from '../../../service/api-data-provider';
import { toast } from "react-toastify";
export default function CartPopup(props) {
  const { product } = props;
  const { tenantConfiguration, tenantConfigurationLoading, tenantConfigurationIsError } = useApiData();
  let pictureURL = product.bundleItems ? product.bundleDefaultImage.pictures[0].url : product.pictures[0].url
  if (tenantConfigurationLoading) {
    return '';
  }

  if (tenantConfigurationIsError) {
    return <div>Error loading data</div>;
  }
  return (
    <div className="minipopup-area">
      <div className="owl-carousel owl-rtl">
        <button
          className="btn btn-link btn-close text-align-right"

          onClick={() => {
            toast.dismiss()
          }}
        >
          <i className="fas fa-times"></i>
          <span className="sr-only">Close</span>
        </button>
      </div>

      <div className="minipopup-box show" style={{ top: "0" }}>
        <p className="minipopup-title">Successfully added.</p>

        <div className="product product-purchased product-cart mb-0">
          <figure className="product-media pure-media image-grey-background">
            <ALink
              href={`#`}
            >
              <img
                src={pictureURL}
                alt="product"
                width="90"
                height="90"
              />
            </ALink>
          </figure>
          <div className="product-detail">
            <ALink
              href={`#`}
              className="product-name"
            >
              {product.name}
            </ALink>
            <span className="price-box">
              <span className="product-quantity">{product.qty}</span>
              <span className="product-price">
                {tenantConfiguration.REACT_APP_CURRENCY}
                {toDecimal(product.price)}
              </span>
            </span>
          </div>
        </div>

        <div className="action-group d-flex">
          <ALink
            href="/pages/cart"
            className="btn btn-sm btn-outline btn-primary btn-rounded"
          >
            View Cart
          </ALink>
          <ALink
            href="/pages/checkout"
            className="btn btn-sm btn-primary btn-rounded"
          >
            Check Out
          </ALink>
        </div>
      </div>
    </div>
  );
}
