import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";
import { getTotalPrice, getCartCount, toDecimal } from "../utils/index";
import ALink from "../utils/alink";
import { cartActions } from "../store/cart";

function CartMenu(props) {
  const { cartList, removeFromCart, tenantConfiguration } = props;
  const router = useLocation();

  useEffect(() => {
    hideCartMenu();
  }, [router.pathname]);

  const showCartMenu = (e) => {
    e.preventDefault();
    e.currentTarget.closest(".cart-dropdown").classList.add("opened");
  };

  const hideCartMenu = () => {
    document.querySelector(".cart-dropdown").classList.remove("opened");
  };

  const removeCart = (item) => {
    removeFromCart(item);
  };
  const convertCamelCaseToTitleCase = (input) => {
    return input
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, (str) => str.toUpperCase());
  }
  return (
    <div className="dropdown cart-dropdown type2 cart-offcanvas mr-0 mr-lg-2">
      <a
        href="/"
        className="cart-toggle label-block link"
        onClick={showCartMenu}
      >
        <div className="cart-label d-lg-show">
          <span className="cart-name">Shopping Cart:</span>
          <span className="cart-price">
            {tenantConfiguration.REACT_APP_CURRENCY}
            {toDecimal(getTotalPrice(cartList))}
          </span>
        </div>
        <i className="d-icon-bag">
          <span className="cart-count">{getCartCount(cartList)}</span>
        </i>
      </a>
      <div className="cart-overlay" onClick={hideCartMenu}></div>
      <div className="dropdown-box">
        <div className="cart-header">
          <h4 className="cart-title">Shopping Cart</h4>
          <ALink
            href="#"
            className="btn btn-dark btn-link btn-icon-right btn-close"
            onClick={hideCartMenu}
          >
            close<i className="d-icon-arrow-right"></i>
            <span className="sr-only">Cart</span>
          </ALink>
        </div>
        {cartList.length > 0 ? (
          <>
            <div className="products scrollable">
              {cartList.map((item, index) => (
                <div
                  className="product product-cart"
                  key={"cart-menu-product-" + index}
                >
                  <figure className="product-media pure-media col-lg-3">
                    <ALink
                      href={`/store/${item.storeSlug}/products/${item.productSlug}`}
                    >
                      <img
                        src={item.bundleItems ? item.bundleDefaultImage.pictures[0].url : item.pictures[0].url}
                        alt="product"
                        width="80"
                        height="88"
                      />
                    </ALink>
                    <button
                      className="btn btn-link btn-close"
                      onClick={() => {
                        removeCart(item);
                      }}
                    >
                      <i className="fas fa-times"></i>
                      <span className="sr-only">Close</span>
                    </button>
                  </figure>
                  <div className="product-detail col-lg-7 overflow-ellipse-for-productName">
                    <div style={{ width: "99%" }}>
                      <p className="mb-2 overflow-ellipse-for-productName">
                        <ALink
                          href={`/store/${item.storeSlug}/products/${item.productSlug}`} className={'p-0'}>
                          {item.name}
                        </ALink>
                      </p>
                      {item.variantMatrix?.map((singleField) => (
                        <>
                          <p className="cart-menu-product-details font-weight-100 ellipsis mb-0" style={{lineHeight:1.5}}>
                            {convertCamelCaseToTitleCase(singleField.id)} : {singleField.value}
                          </p>
                        </>
                      ))}
                      {item.customisationsForm?.map((singleField) => (
                        <>
                          <p className="cart-menu-product-details font-weight-100 ellipsis mb-0" style={{lineHeight:1.5}}>
                            {singleField.label} : {singleField.value}
                          </p>
                        </>
                      ))}
                      {item.bundleItems && item.bundleItems.map((bundleItem, index) => (
                        <div key={index}>
                          <p className="cart-menu-product-details font-weight-100">{bundleItem.name}</p>
                          {bundleItem.variantMatrix?.map((singleField, fieldIndex) => (
                            <p key={`variant-${fieldIndex}`} className="cart-menu-product-details font-weight-100 ellipsis mb-0" style={{lineHeight:1.5}}>
                              {convertCamelCaseToTitleCase(singleField.id)} : {singleField.value}
                            </p>
                          ))}
                          {bundleItem.customisationsForm?.map((singleField, fieldIndex) => (
                            <p key={`customisation-${fieldIndex}`} style={{lineHeight:1.5}} className="cart-menu-product-details font-weight-100 ellipsis mb-0">
                              {singleField.label} : {singleField.value}
                            </p>
                          ))}
                          {index < item.bundleItems.length - 1 && <hr />}
                        </div>
                      ))}
                      <p className="cart-menu-product-details font-weight-100 ellipsis" style={{lineHeight:1.5}}>
                        Store Name : {item.storeName}
                      </p>
                    </div>
                    <div className="price-box">
                      <span className="product-quantity">{item.qty}</span>
                      <span className="product-price">
                        {tenantConfiguration.REACT_APP_CURRENCY}
                        {toDecimal(item.price)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-total">
              <label>Subtotal:</label>
              <span className="price">
                {tenantConfiguration.REACT_APP_CURRENCY}
                {toDecimal(getTotalPrice(cartList))}
              </span>
            </div>

            <div className="cart-action">
              <ALink className="btn btn-dark btn-link" onClick={hideCartMenu}>
                Continue Shopping
              </ALink>
              <ALink
                href="/pages/cart"
                className="btn btn-dark"
                onClick={hideCartMenu}
              >
                <span>Checkout</span>
              </ALink>
            </div>
          </>
        ) : (
          <p className="mt-4 text-center font-weight-semi-bold ls-normal text-body">
            No products in the cart.
          </p>
        )}
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
})(CartMenu);
