import React, { useState, useEffect, memo } from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import GenerateInputFields from "../dynamic-form/generate-input-fields";
import MediaOne from "../utils/product-media/MediaOneForGental";
import { useParams } from "react-router-dom";
import Quantity from "../utils/quantity/Quantity";
import { cartActions } from "../store/cart";
import ALink from "../utils/alink";
import { fadeIn } from "../utils/keyFrames";
import Reveal from "react-awesome-reveal";
import Spinner from "../utils/spinner/full-page-spinner";
import ProductDatabaseService from "../../service/product-database-service";

import { useApiData } from '../../service/api-data-provider';
// import axios from "axios";
function ProductHome(props) {
  const { productDatabase, productDatabaseLoading, productDatabaseIsError, tenantConfiguration,
    tenantConfigurationLoading,
    tenantConfigurationIsError, } = useApiData();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const { productSlug } = useParams();
  useEffect(() => {
    if (!productDatabaseLoading) {
      loadProductDatabase();
    }
  }, [productSlug, productDatabaseLoading]);
  // /////////////////////////////////////////////////////////////////////////////////////////
  // useEffect(() => {
  //   const fetchSignedURLData = async () => {
  //     const queryParams = window.location.href.split("?");
  //     const signedURL = queryParams.find((param) => param.startsWith("https://"));
  //     if (signedURL) {
  //       try {
  //         const response = await axios.get(signedURL);
  //         updateFormFields(response.data)
  //       } catch (error) {
  //         console.error("Error fetching the signed URL:", error);
  //       }
  //     } else {
  //       console.warn("Signed URL not found in query parameters.");
  //     }
  //   };
  //   const updateFormFields = (data) => {
  //     const form = document.getElementById("productForm");
  //     if (form) {
  //       Object.keys(data).forEach((key) => {
  //         const inputElement = form.elements[key];
  //         if (inputElement) {
  //           inputElement.value = data[key];
  //         }
  //       });
  //     }
  //   }

  //   fetchSignedURLData();
  // }, [])
  // /////////////////////////////////////////////////////////////////////////////////////
  const loadProductDatabase = () => {
    let product = ProductDatabaseService.getSingleProductByProductSlug(
      productSlug, productDatabase
    );
    setProduct(product);
  };
  const handleAddToCartSubmit = (event) => {
    event.preventDefault();
    const formElement = document.getElementById("productForm");
    const uniqueProductInstanceId = createUniqueNameForProduct(formElement);
    const formFieldsWithValues = populateFormFieldsWithValues(formElement);
    if (product.isBundledProduct) {
      props.addToCart({
        ...product,
        productInstanceId: uniqueProductInstanceId,
        qty: quantity,
        price: product.onePrice,
        bundleProductItems: formFieldsWithValues,
      });
    }
    else {
      props.addToCart({
        ...product,
        productInstanceId: uniqueProductInstanceId,
        qty: quantity,
        price: product.onePrice,
        formFields: formFieldsWithValues,
      });
    }

    formElement.reset();
  };

  const populateFormFieldsWithValues = (formElement) => {
    const formData = new FormData(formElement);
    const fieldValues = Object.fromEntries(formData.entries());
    if (product.isBundledProduct) {
      return product.bundleProductItems.map((bundleItem) => ({
        ...bundleItem,
        formFields: bundleItem.formFields.map((field) => ({
          ...field,
          value: fieldValues[field.id],
        }))
      }));
    }
    if (product.formFields) {
      return product.formFields.map((field) => ({
        ...field,
        value: fieldValues[field.name] || "",
      }));
    }
    return [];
  };

  const createUniqueNameForProduct = (formElement) => {
    const formData = new FormData(formElement);
    return JSON.stringify({
      productName: product.name,
      formDetails: product.isBundledProduct ? populateFormFieldsWithValues(formElement) : Object.fromEntries(formData.entries()),
    });
  };

  const changeQty = (qty) => setQuantity(qty);

  const handleVariantChange = () => {
    let updatedProductCopy = { ...product };
    let additionalPrice = 0;
    if (updatedProductCopy.variants) {
      updatedProductCopy.variants.forEach((singleVariant) => {
        let variantCombination = {};
        Object.entries(singleVariant.combination).forEach(([key, value]) => {
          let fieldValue = getFormValueForParticularField(key);
          if (fieldValue.length > 0) {
            variantCombination[key] = fieldValue;
          }
        });

        if (JSON.stringify(variantCombination) === JSON.stringify(singleVariant.combination)) {
          updatedProductCopy.onePrice = singleVariant.price;
        }
      });
    }
    if (product.additionalPrice) {
      let fieldValue = getFormValueForParticularField(product.additionalPrice.key);
      if (fieldValue.length > 0 && !product.additionalPrice.isApplied) {
        product.additionalPrice.isApplied = true;
        additionalPrice = product.additionalPrice.cost;
        if (additionalPrice > 0) {
          updatedProductCopy.onePrice += product.additionalPrice.cost;
        }
      } else if (product.additionalPrice.isApplied && fieldValue.length === 0) {
        updatedProductCopy.onePrice -= product.additionalPrice.cost;
        product.additionalPrice.isApplied = false;
      }
      else if (fieldValue.length > 0) {
        updatedProductCopy.onePrice += product.additionalPrice.cost;
      }
    }
    setProduct(updatedProductCopy);
  }

  const getFormValueForParticularField = (fieldId) => {
    let fieldValue = '';
    const formElement = document.getElementById("productForm");
    let formEntries = populateFormFieldsWithValues(formElement);

    formEntries.forEach((formEntry) => {
      if (formEntry.id.toLowerCase() === fieldId.toLowerCase()) {
        fieldValue = formEntry.value;
      }
    });

    return fieldValue;
  }


  if (!product && !productDatabaseLoading) {
    return <p className="container mt-2">Product Not Found</p>;
  }
  if (tenantConfigurationLoading || productDatabaseLoading) {
    return <Spinner />;
  }

  if (tenantConfigurationIsError || productDatabaseIsError) {
    return <div>Error loading data</div>;
  }

  return (
    <div>
      <Helmet>
        <title>Product | {product.name}</title>
      </Helmet>
      <div className="page-content mb-10 pb-6">
        <div className="container vertical">
          <div className="product product-single row mb-2">
            <div className="col-md-6 mt-4 sticky-sidebar-wrapper">
              {product && product.pictures && product.pictures.length > 0 ? (
                <MediaOne product={[product]} />
              ) : (
                <p>Product images are not available.</p>
              )}
            </div>
            <div className="col-md-6">
              <nav className="breadcrumb-nav">
                <div className="container pl-1">
                  <ul className="breadcrumb">
                    <li>
                      <ALink href="/">
                        <i className="d-icon-home"></i>
                      </ALink>
                    </li>
                    <li>{product.name}</li>
                  </ul>
                </div>
              </nav>
              <form
                className="pl-lg-2"
                onSubmit={handleAddToCartSubmit}
                id="productForm"
              >
                <main className="main contact-us">
                  <div className="page-content pt-3">
                    <Reveal
                      keyframes={fadeIn}
                      delay="50"
                      duration="1000"
                      triggerOnce
                    >
                      <section className="contact-section">
                        <div className="w-100">
                          <h4 className="ls-m font-weight-bold">
                            {product.name}
                          </h4>
                          <p>{product.short_description}</p>
                          <h5>
                            {tenantConfiguration.REACT_APP_CURRENCY}
                            {product.onePrice}
                          </h5>
                          {
                            product.isBundledProduct ?
                              product.bundleProductItems.map((singleItems) => (
                                <>
                                  <div className="col-md-12">
                                    <ul className="breadcrumb">
                                      <li>{singleItems.name}</li>
                                    </ul>
                                    <GenerateInputFields formFields={singleItems.formFields} handleVariantChange={handleVariantChange} />
                                  </div>
                                </>
                              )) : product.formFields ? <GenerateInputFields formFields={product.formFields} handleVariantChange={handleVariantChange} /> : ''
                          }
                        </div>
                      </section>
                    </Reveal>
                  </div>
                </main>
                <div className="product-form product-qty pb-0">
                  <div className="product-form-group">
                    <Quantity
                      qty={quantity}
                      max={product.isBundledProduct ? product.bundleProductItems[0].stock : product.stock}
                      product={product}
                      onChangeQty={changeQty}
                    />
                    <button
                      type="submit"
                      className="btn-product btn-cart text-normal ls-normal font-weight-semi-bold"
                    >
                      <i className="d-icon-bag"></i>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    wishlist: state.wishlist.data || [],
  };
}

export default connect(mapStateToProps, {
  addToCart: cartActions.addToCart,
})(memo(ProductHome));
