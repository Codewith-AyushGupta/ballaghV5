import React, { useState } from 'react'
import ProductVariantMediaViewer from '../product-variant/product-varient-media-viewer'
import ProductVariantPriceDescription from '../product-variant/product-variant-price-description'
import ProductVariantSearch from '../product-variant/product-variant-search'
import ProductCustomisationForm from '../product-variant/product-customisations-form'
import ProductAddToCart from '../product-variant/product-add-to-cart'

function SingleProductDummy(props) {
    const { product ,store } = props
    const [productVariant, setProductVariant] = useState(null);
    if (!product) {
        return ''
    }
    return (
        <div className="page-content mb-10 pb-6">
            <div className="container vertical">
                <div className="row product product-single mb-2">
                    <div className="col-md-6 mt-4 sticky-sidebar-wrapper">
                        <ProductVariantMediaViewer productVariant={productVariant} />
                    </div>
                    <div className="col-md-6">
                        <ProductVariantPriceDescription productVariant={productVariant} />
                        <ProductVariantSearch formId={'productVariantSearchForm'} product={product} setProductVariant={setProductVariant}/>
                        <ProductCustomisationForm formId={'singleProductForm'} formGroupName ={'allCustomisationForm'} productVariant={productVariant} />
                        <ProductAddToCart formId={'singleProductForm'} store={store} formGroupName ={'allCustomisationForm'} product={product} productVariant={productVariant} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleProductDummy
