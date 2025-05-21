import React, { useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import ALink from '../utils/alink';
function CollectionDetailView(props) {
    return (
        <div className={`product text-left text-center`}>
            <figure className="product-media">
                <ALink href={props.collectionSlug.length > 0 ? `/collections/${props.collectionSlug}` : null}>
                    <LazyLoadImage
                        alt="product"
                        className='d-flex justify-content-center'
                        src={props.collectionIcon}
                        threshold={500}
                        effect="opacity"
                        width="300"
                        height="338"
                    />
                </ALink>

                <div className="product-action">
                    <ALink href={props.collectionSlug.length > 0 ? `/collections/${props.collectionSlug}` : null} className="btn-product btn-quickview" title="Quick View" >View Collection</ALink>
                </div>
            </figure>

            <div className="product-details">
                <h3 className="product-name text-align-center">
                    <ALink href={props.collectionSlug.length > 0 ? `/collections/${props.collectionSlug}` : null}>
                        {props.collectionName}
                    </ALink>
                </h3>
            </div>
        </div>
    )
}

export default (CollectionDetailView);