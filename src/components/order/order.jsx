import axios from "axios";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Spinner from "../utils/spinner/full-page-spinner";
import ALink from "../utils/alink";
import { toDecimal } from "../utils";
import { connect } from "react-redux";
import { cartActions } from "../store/cart";
import { useApiData } from '../../service/api-data-provider';
import Error404 from "../../pages/Error404";
import { Navigate, useNavigate } from "react-router-dom";
function Order(props) {
  const {
    tenantConfiguration,
    tenantConfigurationLoading,
    tenantConfigurationIsError,
  } = useApiData();
  const { cartList, removeFromCart } = props;
  const [lineItems, setLineItems] = useState();
  const [checkoutDetails, setCheckoutDetails] = useState();
  const [fullPageSpinner, setFullPageSpinner] = useState(true);
  const navigate = useNavigate();
  const getCheckOutSessionIdFromURL = () => {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get("session_id");
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await getOrderDetails();
        setFullPageSpinner(false);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        // navigate('/pages/404')
      }
    };
    fetchInitialData();
    clearLocalStorage();
  }, []);

  const getOrderDetails = async () => {
    let tenantId = process.env.REACT_APP_TENANT_ID
    const response = await axios.post(
      tenantConfiguration.REACT_APP_PIPELINE_PROD_URL,
      {
        pipelineName: tenantConfiguration.REACT_APP_ORDER_PROD_PIPELINE_NAME,
        pipelineParams: [
          { name: "checkoutSessionId", value: getCheckOutSessionIdFromURL() },
        ],
      },
      {
        headers: {
          "x-tenant-id": tenantId,
        },
      }
    );
    if (response.status === 200) {
      setLineItems(response.data.message.lineItem);
      setCheckoutDetails(response.data.message.checkoutSession);
    }
  };

  const getFormattedDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    return formattedDate;
  };
  const convertCamelCaseToTitleCase = (input) => {
    return input
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, (str) => str.toUpperCase());
  }
  const clearLocalStorage = () => {
    cartList.forEach((cartItems) => {
      removeFromCart(cartItems);
    });
  };

  if (fullPageSpinner) {
    return <Spinner />;
  }
  if (tenantConfigurationLoading) {
    return <Spinner />;
  }

  if (tenantConfigurationIsError) {
    return <div>Error loading data</div>;
  }
  return (
    <div>
      <Helmet>
        <title>{tenantConfiguration.REACT_APP_COMPANY_NAME} | Order</title>
      </Helmet>
      <div className="page-content pt-7 pb-10">
        <div className="container mb-2">
          <div className="order hide-on-print d-flex justify-content-center">
            <div className="order-message text-center mb-4">
              <div className="icon-box d-inline-flex align-items-center justify-content-center mb-3">
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 50 50"
                  className="icon-check-circle"
                >
                  <g>
                    <path
                      fill="none"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="bevel"
                      strokeMiterlimit="10"
                      d="M33.3,3.9c-2.7-1.1-5.6-1.8-8.7-1.8c-12.3,0-22.4,10-22.4,22.4c0,12.3,10,22.4,22.4,22.4c12.3,0,22.4-10,22.4-22.4c0-0.7,0-1.4-0.1-2.1"
                    ></path>
                    <polyline
                      fill="none"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="bevel"
                      strokeMiterlimit="10"
                      points="48,6.9 24.4,29.8 17.2,22.3"
                    ></polyline>
                  </g>
                </svg>
              </div>
              <h5 className="font-weight-bold lh-1 mb-1">Thank You!</h5>
              <p className="font-weight-normal lh-1 mb-3">
                Your order has been received
              </p>
              <div className="order-details">
                <p className="mb-1 font-weight-normal lh-1">
                  Order number: {checkoutDetails.payment_intent}
                </p>
                <p className="mb-1 font-weight-normal lh-1">
                  Date: {getFormattedDate(checkoutDetails.created)}
                </p>
                <p className="mb-1 font-weight-normal lh-1">
                  Email: {checkoutDetails.customer_details.email}
                </p>
              </div>
            </div>
          </div>

          <h2 className="title title-simple text-left pt-4 font-weight-bold text-uppercase">
            Order Details
          </h2>
          <div className="row">
            {lineItems.length > 0 ? (
              <>
                <div className="col-lg-8 col-md-12 pr-lg-4">
                  <table className="shop-table cart-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th></th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lineItems.map((singleLineItem) =>
                        singleLineItem ? (
                          <tr key={"cart" + singleLineItem.name}>
                            <td className="product-thumbnail">
                              <figure cla>
                                <ALink
                                  href={singleLineItem.storeSlug?`store/${singleLineItem.storeSlug}/products/${singleLineItem.productSlug}`:'#'}
                                >
                                  <img
                                   className="image-grey-background"
                                    src={singleLineItem.product_image}
                                    width="100"
                                    height="100"
                                    alt="product"
                                  />
                                </ALink>
                              </figure>
                            </td>
                            <td colSpan="1">
                              <div className="product-name-section">
                                <ALink
                                  href={singleLineItem.storeSlug?`store/${singleLineItem.storeSlug}/products/${singleLineItem.productSlug}`:'#'}
                                >
                                  <p className="mb-2 font-weight-bolder">
                                    {singleLineItem.productName}
                                  </p>
                                </ALink>
                                {singleLineItem.bundleItems && singleLineItem.bundleItems.map((bundleItem) => (
                                  <>
                                    <p className="mt-1 mb-1" style={{fontWeight:500}}>{bundleItem.variantName}</p>
                                    {bundleItem.variantMatrix?.map((singleField) => (
                                      <>
                                        <p className="mt-0 mb-0 overflow-ellipse">
                                          {convertCamelCaseToTitleCase(singleField.id)}:{" "}
                                          <span className="font-weight-normal">{singleField.value}</span>
                                        </p>
                                      </>
                                    ))}
                                    {bundleItem.customisationsForm?.map((singleField) => (
                                      <p className="mt-0 mb-0 overflow-ellipse">
                                        {singleField.label}:{" "}
                                        <span className="font-weight-normal">{singleField.value}</span>
                                      </p>
                                    ))}
                                  </>
                                ))}
                                {
                                  singleLineItem.storeName ?
                                    <p className="mt-1 mb-0 overflow-ellipse">
                                      {"Store Name"}:{" "}
                                      <span className="font-weight-normal">{singleLineItem.storeName}</span>
                                    </p> : ''
                                }
                              </div>
                            </td>
                            <td className="product-subtotal">
                              {singleLineItem.quantity}
                            </td>
                            <td className="product-quantity">
                              {tenantConfiguration.REACT_APP_CURRENCY}{toDecimal(singleLineItem.unit_amount / 100)}
                            </td>
                            <td className="product-subtotal">

                              {tenantConfiguration.REACT_APP_CURRENCY}
                              {toDecimal(
                                (singleLineItem.unit_amount *
                                  singleLineItem.quantity) /
                                100
                              )}
                            </td>
                          </tr>
                        ) : null
                      )}
                    </tbody>
                  </table>
                  <div className="row">
                    {/* Additional content like Shipping Address or Promo Code could be added here */}
                  </div>
                </div>
                <aside className="col-lg-4 sticky-sidebar-wrapper">
                  <div
                    className="sticky-sidebar"
                    data-sticky-options="{'bottom': 20}"
                  >
                    <div className="summary mb-4">
                      <h3 className="summary-title text-left">Order Totals</h3>
                      <table className="shipping">
                        <tbody>
                          <tr className="summary-subtotal">
                            <td>
                              <h4 className="summary-subtitle">Subtotal</h4>
                            </td>
                            <td>
                              <p className="summary-subtotal-price">
                                {tenantConfiguration.REACT_APP_CURRENCY}
                                {toDecimal(
                                  checkoutDetails.amount_subtotal / 100
                                )}
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table className="total">
                        <tbody>
                          <tr className="summary-subtotal">
                            <td>
                              <h4 className="summary-subtitle">Total</h4>
                            </td>
                            <td>
                              <p className="summary-total-price ls-s">
                                {tenantConfiguration.REACT_APP_CURRENCY}
                                {toDecimal(checkoutDetails.amount_total / 100)}
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="cart-actions pt-4 justify-content-center mb-2 border-bottom">
                        <ALink href="/" className="btn btn-dark btn-link">
                          Continue Shopping
                        </ALink>
                      </div>
                    </div>
                  </div>
                </aside>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    cartList: state.cart.data,
  };
}

export default connect(mapStateToProps, {
  removeFromCart: cartActions.removeFromCart,
})(React.memo(Order));