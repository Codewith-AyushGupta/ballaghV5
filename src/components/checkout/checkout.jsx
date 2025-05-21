import React, { useEffect, useState } from "react";
import { useApiData } from "../../service/api-data-provider";
import Spinner from "../utils/spinner/full-page-spinner";
import { connect } from "react-redux";
import StoreDatabaseService from "../../service/store-database-service";
import { Helmet } from "react-helmet";
import ProductVariantSearch from "../product-variant/product-variant-search";
import ProductCustomisationForm from "../product-variant/product-customisations-form";
import { toDecimal, getTotalPrice } from "../utils";
import axios from "axios";
import ALink from "../utils/alink";
import { toast, ToastContainer } from "react-toastify";
import alasql from "alasql";
function Checkout({ cartList }) {
  const {
    tenantConfiguration,
    tenantConfigurationLoading,
    tenantConfigurationIsError,

    productDatabase,
    productDatabaseLoading,
    productDatabaseIsError,

    storeDatabase,
    storeDatabaseLoading,
    storeDatabaseIsError,
  } = useApiData();

  const [product, setProduct] = useState(null);
  const [productVariant, setProductVariant] = useState(null);
  const [storeDiscountCode, setStoreDiscountCode] = useState('');
  const [storeDiscountResponse, setStoreDiscountResponse] = useState("");
  const [storeSlugByDeliveryOptionsArray, setStoreSlugByDeliveryOptionsArray] =
    useState(null);
  const [pageSpinner, setPageSpinner] = useState(false);
  const [estimatedDelivery, setEstimatedDelivery] = useState(false);

  useEffect(() => {
    if (
      cartList.length > 0 &&
      !productDatabaseLoading &&
      !storeDatabaseLoading
    ) {
      getDeliveryOptions();
    }
    let estimatedDeliveryInDays = alasql("SELECT MAX(estimatedDeliveryInDays) AS maxDays FROM ?", [cartList]);
    const maxDays = estimatedDeliveryInDays[0]?.maxDays;
    setEstimatedDelivery(maxDays ? maxDays+' Days' : 'Immediately');

  }, [cartList, productDatabaseLoading, storeDatabaseLoading]);

  const getDeliveryOptions = () => {
    const StoreDatabaseServiceInstance = new StoreDatabaseService(
      storeDatabase
    );
    let stores = [];
    cartList.forEach((singleCartItem) => {
      let response = StoreDatabaseServiceInstance.getStoreByStoreSlug(
        singleCartItem.storeSlug
      );
      if (response) {
        stores.push(response);
      }
    });
    let response =
      StoreDatabaseServiceInstance.getStoreSlugByDeliveryOptionsArray(stores);
    let productWithNoDuplicates =
      StoreDatabaseServiceInstance.removeDuplicatesFromStoreDeliveryOptions(
        stores
      );

    let defaultVariant =
      StoreDatabaseServiceInstance.getDefaultDeliveryOptionsVariant(
        productWithNoDuplicates.storeSlug
      );

    setStoreSlugByDeliveryOptionsArray(response || null);
    setProductVariant(defaultVariant || null);
    setProduct(productWithNoDuplicates || null);
  };
  const handleVariantSearchForm = (e) => {
    if (e.target) {
      let selectedDeliveryOption = e.target.value;
      const StoreDatabaseServiceInstance = new StoreDatabaseService(
        storeDatabase
      );
      const formElement = document.getElementById(e.target.form.id);

      const variantMatrixToSearch =
        StoreDatabaseServiceInstance.createVariantMatrixFromSelectorForm(
          formElement
        );
      let storeSlug =
        StoreDatabaseServiceInstance.getStoreSlugFromDeliveryOption(
          selectedDeliveryOption,
          storeSlugByDeliveryOptionsArray
        );
      const response =
        StoreDatabaseServiceInstance.getParticularStoreVariantBasedOnMatrix(
          storeSlug,
          variantMatrixToSearch
        );

      if (response) {
        setProductVariant(response);
      } else {
        setProductVariant(null);
      }
    } else {
      setProductVariant(e);
    }
  };
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const checkoutFormPersonalDetails = document.getElementById(
      "personalDetailsCheckoutForm"
    );
    const DeliveryOptionsCustomisationForm =
      document.getElementById("addressForm");
    const DeliveryOptionsVariantForm =
      document.getElementById("deliveryOptionForm");
    if (
      checkoutFormPersonalDetails.reportValidity() &&
      DeliveryOptionsCustomisationForm.reportValidity() &&
      DeliveryOptionsVariantForm.reportValidity()
    ) {
      try {
        setPageSpinner(true);
        updateProductVariantCustomisationFormWithValues();
        let url = await generateStripeCheckoutURL();
        if (url.length > 0) {
          window.location.href = url;
        }
      } catch (e) {
        toast.dismiss();
        toast.error("Failed To Generate Checkout Url", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setPageSpinner(false);
      }
    }
  };
  const generateStripeCheckoutURL = async () => {
    let tenantID = process.env.REACT_APP_TENANT_ID;
    const response = await axios.post(
      tenantConfiguration.REACT_APP_PIPELINE_PROD_URL,
      {
        pipelineName: tenantConfiguration.REACT_APP_CHECKOUT_PROD_PIPELINE_NAME,
        pipelineParams: [
          { name: "cartItems", value: JSON.stringify(cartList) },
          { name: "checkoutFormDetails", value: generateFormDataForCheckout() },
          { name: "originUrl", value: window.location.origin },
        ],
      },
      {
        headers: {
          "x-tenant-id": tenantID,
        },
      }
    );
    return response.data.message.checkOutSessionUrL || "";
  };
  const getFormDetails = (formId) => {
    const formElement = document.getElementById(formId);
    if (!formElement) {
      console.error(`Form with ID ${formId} not found.`);
      return {};
    }
    const formInstance = new FormData(formElement);
    return Object.fromEntries(formInstance.entries());
  };
  const updateProductVariantCustomisationFormWithValues = () => {
    const DeliveryOptionsCustomisationForm = getFormDetails("addressForm");
    productVariant.customisationsForm.map((singleFormField) => {
      singleFormField.value =
        DeliveryOptionsCustomisationForm[singleFormField.id] || "";
    });
    productVariant.slug = "delivery";
    productVariant.productName = productVariant.name;
  };
  const generateFormDataForCheckout = () => {
    const DeliveryOptionsPersonalDetailsForm = getFormDetails(
      "personalDetailsCheckoutForm"
    );
    return JSON.stringify({
      personalForm: DeliveryOptionsPersonalDetailsForm,
      deliveryForm: { ...productVariant },
      storeDiscountCode: storeDiscountCode,
    });
  };
  const validateStoreDiscountCode = async () => {
    if(storeDiscountCode.length===0){
      setStoreDiscountResponse('')
      return;
    }
    let isDiscountCodeValid = false;
    cartList.map((cartItem) => {
      if (cartItem?.discount?.name === storeDiscountCode) {
        isDiscountCodeValid = true;
      }
    });
    if (isDiscountCodeValid) {
      setStoreDiscountResponse(
        <p
          style={{ color: "green" }}
          className="row text-align-left w-100 ml-1 mb-3"
        >
          Store discount code is applied after checkout.
        </p>
      );
    } else {
      productDatabase.map((product) => {
        if (product?.discount?.name === storeDiscountCode) {
          setStoreDiscountResponse(
            <p
              style={{ color: "Orange" }}
              className="row text-align-left w-100 ml-1 mb-3"
            >
              Store discount is not applicable for product in cart.
            </p>
          );
          isDiscountCodeValid = true;
        }
      });
      if (!isDiscountCodeValid) {
        setStoreDiscountResponse(
          <p
            style={{ color: "red" }}
            className="row text-align-left w-100 ml-1 mb-3"
          >
            Store discount code is not valid
          </p>
        );
      }
    }
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
    return <p>Error loading tenant configuration.</p>;
  }
  return (
    <>
      <Helmet>
        <title>{tenantConfiguration.REACT_APP_COMPANY_NAME} | Checkout</title>
      </Helmet>
      {cartList.length > 0 && product ? (
        <div className="container mt-7 page-content pt-2 pb-1 checkout mb-2">
          <div className="row">
            <div className="col-lg-7">
              <form
                className="form"
                id="personalDetailsCheckoutForm"
                aria-label="Checkout Form"
              >
                <h3 className="mb-3 title title-simple text-left text-uppercase">
                  Personal Details
                </h3>
                <div className="form-group mb-1">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    className="form-control"
                    name="firstName"
                    id="firstName"
                    type="text"
                    required
                  />
                </div>
                <div className="form-group mb-1">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    className="form-control"
                    name="lastName"
                    id="lastName"
                    type="text"
                    required
                  />
                </div>
                <div className="form-group mb-1">
                  <label htmlFor="email">Email *</label>
                  <input
                    className="form-control"
                    name="email"
                    id="email"
                    type="email"
                    required
                  />
                </div>
                <div className="form-group mb-1">
                  <label htmlFor="phone">Phone *</label>
                  <input
                    className="form-control"
                    name="phone"
                    id="phone"
                    type="text"
                    required
                  />
                </div>
              </form>
              <div className="form">
                <h3 className="mb-3 title title-simple text-left text-uppercase">
                  Delivery Options
                </h3>
                <div className="row">
                  <ProductVariantSearch
                    formId="deliveryOptionForm"
                    product={product.deliveryOption}
                    setProductVariant={handleVariantSearchForm}
                    defaultProductVariant={productVariant}
                  />

                  <ProductCustomisationForm
                    formId="addressForm"
                    formGroupName={"deliveryAddressForm"}
                    productVariant={productVariant}
                  />
                </div>
              </div>
            </div>
            <aside className="col-lg-5">
              <div className="sticky-sidebar mt-1">
                <div className="summary pt-5 form">
                  <table>
                    <tr>
                      <h3 className="title title-simple text-left text-uppercase">
                        Order Summary
                      </h3>
                    </tr>
                    <tr>
                      <td>
                        <p className="text-left">Cart Cost</p>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <p>
                          {tenantConfiguration.REACT_APP_CURRENCY}
                          {toDecimal(getTotalPrice(cartList))}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p className="text-left">Delivery Cost</p>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <p>
                          {tenantConfiguration.REACT_APP_CURRENCY}
                          {productVariant?.price}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p className="text-left">Estimated Delivery</p>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <p>
                          {estimatedDelivery}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h3 className="title title-simple text-left text-uppercase">
                          Total
                        </h3>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <h3
                          className="title title-simple"
                          style={{ textAlign: "right" }}
                        >
                          {tenantConfiguration.REACT_APP_CURRENCY}
                          {toDecimal(
                            productVariant?.price + getTotalPrice(cartList)
                          )}
                        </h3>
                      </td>
                    </tr>
                  </table>
                  <div className="w-100">
                    <input
                      style={{ width: "41rem !important" }}
                      className="form-control mb-2 w-100"
                      name="storeDiscount"
                      id="storeDiscount"
                      placeholder="Store Discount Code"
                      value={storeDiscountCode}
                      onChange={(e) => setStoreDiscountCode(e.target.value)}
                      onBlur={validateStoreDiscountCode}
                      type="text"
                      minLength={3}
                      required
                    />
                  </div>
                  <div className="w-100">
                    <span>{storeDiscountResponse}</span>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    className="btn btn-dark btn-rounded btn-order"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </aside>
          </div>
          <ToastContainer />
        </div>
      ) : (
        <div className="empty-cart text-center mb-5">
          <p>No item for checkout.</p>
          <ALink className="button wc-backward btn btn-dark btn-md" href="/">
            Return to shop
          </ALink>
        </div>
      )}
      {pageSpinner ? <Spinner /> : null}
    </>
  );
}

const mapstateToProps = (state) => ({
  cartList: state.cart.data || [],
});

export default connect(mapstateToProps)(Checkout);
