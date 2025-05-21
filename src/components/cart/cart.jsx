import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ALink from "../utils/alink";
import Quantity from "../utils/quantity/Quantity";
import { cartActions } from "../store/cart";
import { toDecimal, getTotalPrice } from "../utils";
import { Helmet } from "react-helmet";
import Spinner from "../utils/spinner/full-page-spinner";

import { useApiData } from '../../service/api-data-provider';

function Cart(props) {
  const { cartList, removeFromCart, updateCart } = props;
  const [cartItems, setCartItems] = useState([]);

  const {
    tenantConfiguration,
    tenantConfigurationLoading,
    tenantConfigurationIsError,
  } = useApiData();

  useEffect(() => {
    setCartItems([...cartList]);
  }, [cartList]);

  const onChangeQty = (cartItemId, qty) => {
    const updatedItems = cartItems.map((item) =>
      item.cartItemId === cartItemId ? { ...item, qty: qty } : item
    );
    setCartItems(updatedItems);
    updateCart(updatedItems);
  };
  const showCartMenu = (e) => {
    e.preventDefault();
    document.querySelector(".cart-dropdown").classList.add("opened");
  };
  const convertCamelCaseToTitleCase = (input) => {
    return input
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, (str) => str.toUpperCase());
  }
  if (tenantConfigurationLoading) {
    return <Spinner />;
  }

  if (tenantConfigurationIsError) {
    return <div>Error loading data</div>;
  }
  return (
    <>
      <Helmet>
        <title>{tenantConfiguration.REACT_APP_COMPANY_NAME} | Cart</title>
      </Helmet>
      <div className="main cart">
        <div className="page-content pt-7 pb-10">
          <div className="container mt-7 mb-2">
            <div className="row">
              {cartItems.length > 0 ? (
                <>
                  <div className="col-lg-8 col-md-12 pr-lg-4">
                    <table className="shop-table cart-table">
                      <thead>
                        <tr>
                          <th>
                            <span>Product</span>
                          </th>
                          <th></th>
                          <th>
                            <span>Price</span>
                          </th>
                          <th>
                            <span>Quantity</span>
                          </th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((item) => (
                          <tr key={"cart" + item.name}>
                            <td className="product-thumbnail">
                              <figure className="image-grey-background">
                                <ALink
                                  href={`/store/${item.storeSlug}/products/${item.productSlug}`}>
                                  <img
                                    src={item.bundleItems ? item.bundleDefaultImage.pictures[0].url : item.pictures[0].url}
                                    width="100"
                                    height="100"
                                    alt="product"
                                  />
                                </ALink>
                              </figure>
                              {/* <div>
                                <a
                                  href="/"
                                  className="cart-toggle label-block link"
                                  onClick={showCartMenu}
                                >
                                  <span className="amount">
                                    (View details)
                                  </span>
                                </a>
                              </div> */}
                            </td>
                            <td colSpan="1">
                              <div className="product-name-section">
                                <ALink href={`/store/${item.storeSlug}/products/${item.productSlug}`}>
                                  <p className="mb-2 font-weight-bolder">{item.name}</p>
                                </ALink>
                              </div>
                              {item.variantMatrix?.map((singleField) => (
                                <>
                                  <p className="mt-0 mb-0 overflow-ellipse">
                                    {convertCamelCaseToTitleCase(singleField.id)} : {singleField.value}
                                  </p>
                                </>
                              ))}
                              {item.customisationsForm?.map((singleField) => (
                                <>
                                  <p className="mt-0 mb-0 overflow-ellipse">
                                    {singleField.label} : {singleField.value}
                                  </p>
                                </>
                              ))}
                              {item.bundleItems && item.bundleItems.map((bundleItem) => (
                                <>
                                  <p className="shop-table cart-table mb-1" style={{fontWeight:500}}>{bundleItem.name}</p>
                                  {bundleItem.variantMatrix?.map((singleField) => (
                                    <>
                                      <p className="mt-0 mb-0 overflow-ellipse">
                                        {convertCamelCaseToTitleCase(singleField.id)} : {singleField.value}
                                      </p>
                                    </>
                                  ))}
                                  {bundleItem.customisationsForm?.map((singleField) => (
                                    <>
                                      <p className="mt-0 mb-0 overflow-ellipse">
                                        {singleField.label} : {singleField.value}
                                      </p>
                                    </>
                                  ))}
                                </>
                              ))}
                              <p className="mt-0 mb-0 overflow-ellipse ">
                                Store Name : {item.storeName}
                              </p>
                              <p className="mt-0 mb-0 overflow-ellipse ">
                                Vendor Name : {item.vendorTag}
                              </p>
                            </td>
                            <td className="product-subtotal">
                              <span className="amount">
                                {tenantConfiguration.REACT_APP_CURRENCY}{toDecimal(item.price)}
                              </span>
                            </td>

                            <td className="product-quantity">
                              <Quantity
                                qty={item.qty}
                                max={item.stock}
                                onChangeQty={(qty) => onChangeQty(item.cartItemId, qty)}
                              />
                            </td>
                            <td className="product-price">
                              <span className="amount">
                                {tenantConfiguration.REACT_APP_CURRENCY}{toDecimal(item.price * item.qty)}
                              </span>
                            </td>
                            <td className="product-close">
                              <ALink
                                href="#"
                                className="product-remove"
                                title="Remove this product"
                                onClick={() => removeFromCart(item)}
                              >
                                <i className="fas fa-times"></i>
                              </ALink>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <aside className="col-lg-4 sticky-sidebar-wrapper">
                    <div
                      className="sticky-sidebar"
                      data-sticky-options="{'bottom': 20}"
                    >
                      <div className="summary mb-4">
                        <h3 className="summary-title text-left">Cart Totals</h3>
                        <table className="shipping">
                          <tbody>
                            <tr className="summary-subtotal">
                              <td>
                                <h4 className="summary-subtitle">Subtotal</h4>
                              </td>
                              <td>
                                <p className="summary-subtotal-price">
                                  {tenantConfiguration.REACT_APP_CURRENCY}{toDecimal(getTotalPrice(cartItems))}
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
                                  {tenantConfiguration.REACT_APP_CURRENCY}{toDecimal(getTotalPrice(cartItems))}
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="cart-actions pt-4 justify-content-center mb-2 border-bottom">
                          <ALink href="/" className="btn btn-dark btn-link">Continue Shopping</ALink>
                        </div>
                        <ALink
                          href="checkout"
                          className="btn btn-dark btn-rounded btn-checkout"
                        >
                          Proceed to checkout
                        </ALink>
                      </div>
                    </div>
                  </aside>
                </>
              ) : (
                <div className="empty-cart text-center">
                  <p>Your cart is currently empty.</p>
                  <i className="cart-empty d-icon-bag"></i>
                  <p className="return-to-shop mb-0">
                    <ALink
                      className="button wc-backward btn btn-dark btn-md"
                      href="/"
                    >
                      Return to shop
                    </ALink>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function mapStateToProps(state) {
  return {
    cartList: state.cart.data ? state.cart.data : [],
  };
}

export default connect(mapStateToProps, {
  removeFromCart: cartActions.removeFromCart,
  updateCart: cartActions.updateCart,
})(React.memo(Cart));
