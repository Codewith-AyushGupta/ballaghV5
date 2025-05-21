import React, { memo, useState } from 'react'
import Quantity from '../utils/quantity/Quantity'
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { cartActions } from '../store/cart';
function ProductAddToCart(props) {
    const {store, productVariant, product, formId, formGroupName } = props
    const { storeSlug } = useParams();
    const { productSlug } = useParams();
    const [quantity, setQuantity] = useState(1);
    const changeQty = (qty) => setQuantity(qty);

    const handleAddToCart = (e) => {
        e.preventDefault();
        let cartItemId = '';
        const formElements = document.getElementsByName(formGroupName);
        let isFormValid = true;
        if (formElements.length > 0) {
            Array.from(formElements).forEach((singleFormElement) => {
                if (!singleFormElement.reportValidity()) {
                    isFormValid = false;
                }
            });
        }
        if (isFormValid) {
            updateCustomisationsFormWithValues();
            cartItemId = createUniqueCartItemId();
            if(product.bundleItems){
                let bundleProductWithSelectedBundleItemsVariant =  updateProductBundleItemsWithSelectedVariant(); 
                updateCustomisationsFormWithValues()
                props.addToCart({
                    ...bundleProductWithSelectedBundleItemsVariant,
                    cartItemId: cartItemId,
                    storeSlug: storeSlug,
                    storeName: store.storeName,
                    productSlug: productSlug, //this is the bundle Slug but we treat it as a product.
                    qty: quantity,
                });
            }
            else{
                props.addToCart({
                    ...productVariant,
                    cartItemId: cartItemId,
                    storeSlug: storeSlug,
                    storeName: store.storeName,
                    productSlug: productSlug,
                    productName: product.name,
                    vendorTag:product.vendorTag,
                    discount:product.discount,
                    estimatedDeliveryInDays:product.estimatedDeliveryInDays,
                    qty: quantity,
                });
            }
        }
    }
    const updateCustomisationsFormWithValues = () => {
        if (!product.bundleItems) {
            const formElement = document.getElementById(formId);
            const formData = new FormData(formElement);
            let formKeyValues = Object.fromEntries(formData.entries());
            productVariant.customisationsForm.forEach((singleForm) => {
                singleForm.value = formKeyValues[singleForm.id];
            });
        }
        else {
            const formElements = document.getElementsByName(formGroupName);
            if (formElements) {
                Array.from(formElements).forEach((formElement) => {
                    const formId = formElement.id;
                    const form = document.getElementById(formId);
                    if (form) {
                        const formData = new FormData(form);
                        const formKeyValues = Object.fromEntries(formData.entries());
                        Object.entries(productVariant).map(([key, value]) => {
                            if (formId.includes(key)) {
                                productVariant[key].customisationsForm.map((singleCustomsation) => {
                                    singleCustomsation.value = formKeyValues[singleCustomsation.id];
                                })
                            }
                        })
                    }
                });
            }
        }
    }

    const createUniqueCartItemId = () => {
        let formDetails ='';
        let variantMatrix = {};
        if (product.bundleItems) {
            Object.entries(productVariant).map(([key,singleBundleItem]) => {
                variantMatrix += JSON.stringify(productVariant[key].variantMatrix)
            })
        }
        else {
            variantMatrix = productVariant.variantMatrix
        }
        const formElements = document.getElementsByName(formGroupName);
        if(formElements){
            Array.from(formElements).forEach((formElement) => {
                const formId = formElement.id;
                const form = document.getElementById(formId);
                const formData = new FormData(form);
                formDetails += JSON.stringify(Object.fromEntries(formData.entries()));

            })
        }
        return JSON.stringify({
            productId: productSlug,
            productName: productVariant.name,
            variantMatrix: variantMatrix,
            storeSlug: storeSlug,
            formDetails: formDetails
        });
    };
    const updateProductBundleItemsWithSelectedVariant = ()=>{
        let cartProduct = getDeepCloneProduct({...product});
        cartProduct.bundleItems = Object.values(productVariant);
        return cartProduct;
    }
    const getDeepCloneProduct = (product)=>{
        let cloneString = JSON.stringify(product);
        return JSON.parse(cloneString);
    }
    if (!productVariant) {
        return '';
    }
    return (
        <div className="product-form product-qty pb-0">
            <div className="product-form-group">
                <Quantity
                    qty={quantity}
                    max={product.bundleItems ? product.stock : productVariant.stock}
                    product={productVariant}
                    onChangeQty={changeQty}
                />
                <button
                    type="submit"
                    className="btn-product btn-cart text-normal ls-normal font-weight-semi-bold"
                    onClick={handleAddToCart}
                >
                    <i className="d-icon-bag"></i>
                    Add To cart
                </button>
            </div>
        </div>
    )
}
function mapStateToProps(state) {
    return {
        wishlist: state.wishlist.data || [],
    };
}

export default connect(mapStateToProps, {
    addToCart: cartActions.addToCart,
})(memo(ProductAddToCart));
