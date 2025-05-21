import React, { useEffect, useState } from 'react'
import ProductVariantMediaViewer from '../product-variant/product-varient-media-viewer'
import ProductVariantPriceDescription from '../product-variant/product-variant-price-description'
import ProductVariantSearch from '../product-variant/product-variant-search'
import ProductCustomisationForm from '../product-variant/product-customisations-form'
import ProductAddToCart from '../product-variant/product-add-to-cart'
function BundleProductDummy(props) {
  const { product, store } = props
  const [productVariantByProductSlug, setProductVariantByProductSlug] = useState(null);
  const [ProductVariant, setProductVariant] = useState(null);
  useEffect(() => {
    if (product) {
      loadAllDefaultProductVariantForBundleItems()
    }
  }, [])

  useEffect(() => {
    if (ProductVariant) {
      let productVariantImage = { ...productVariantByProductSlug };
      productVariantImage[ProductVariant.slug] = ProductVariant;
      setProductVariantByProductSlug(productVariantImage)
    }
  }, [ProductVariant])
  const loadAllDefaultProductVariantForBundleItems = () => {
    let variantByProductSlug = {};
    product.bundleItems.map((product) => {
      product.productVariants.map((singleProductVariant) => {
        if (singleProductVariant.isDefaultVariant) {
          variantByProductSlug[product.slug] = singleProductVariant
        }
      })
    })
    if (variantByProductSlug) {
      
      setProductVariantByProductSlug(variantByProductSlug);
    }
  }
  if (!product || !productVariantByProductSlug) {
    return ''
  }
  return (
    <div className="page-content mb-10 pb-6">
      <div className="container vertical">
        <div className="row product product-single mb-2">
          <div className="col-md-6 mt-4 sticky-sidebar-wrapper">
            <ProductVariantMediaViewer productVariant={product} />
          </div>
          <div className="col-md-6">
            <ProductVariantPriceDescription productVariant={product} />
            {
              product.bundleItems.map((product) => (
                <>
                  <p>{product.name}</p>
                  <ProductVariantSearch formId={`productVariantSearchForm-${product.slug}`} product={product} setProductVariant={setProductVariant} defaultProductVariant={productVariantByProductSlug[product.slug]} />
                  <ProductCustomisationForm formId={`singleProductForm-${product.slug}`} formGroupName={'allCustomisationForm'} productVariant={productVariantByProductSlug[product.slug]} />
                </>
              ))
            }
            <ProductAddToCart store={store} formId={'singleProductForm'} formGroupName={'allCustomisationForm'} product={product} productVariant={productVariantByProductSlug} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BundleProductDummy
