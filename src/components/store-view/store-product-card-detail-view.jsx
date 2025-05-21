import React, { useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import ALink from '../utils/alink';
function StoreProductCardDetailView(props) {
    return (
        <div className={`product text-left text-center`}>
            <figure className="product-media">
                <ALink href={props.storeSlug.length > 0 ? `/store/${props.storeSlug}` : null}>
                    <LazyLoadImage
                        alt="product"
                        className='d-flex justify-content-center'
                        src={props.storeLogo}
                        threshold={500}
                        effect="opacity"
                        width="300"
                        height="338"
                    />
                </ALink>

                <div className="product-action">
                    <ALink href={props.storeSlug.length > 0 ? `/store/${props.storeSlug}` : null} className="btn-product btn-quickview" title="Quick View" >View Store</ALink>
                </div>
            </figure>

            <div className="product-details">
                <h3 className="product-name text-align-center">
                    <ALink href={props.storeSlug.length > 0 ? `/store/${props.storeSlug}` : null}>
                        {props.storeName}
                    </ALink>
                </h3>
            </div>
        </div>
    )
}

export default (StoreProductCardDetailView);