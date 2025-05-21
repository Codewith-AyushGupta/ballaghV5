import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import ALink from '../../utils/alink';

import { videoHandler } from '..//..//utils';

function BlogGridView ( props ) {
    const { post, adClass = 'mb-7', isLazy = false, isOriginal = false, btnText = "Read more", btnAdClass = '' } = props;
    return (
        <div className={ `post post-mask gradient ${ post.type === 'video' ? 'post-video' : '' } ${ post.type === 'image' ? 'overlay-zoom' : '' } ${ adClass }` }>
            <figure className="post-media">
                {
                    isLazy ?
                        <ALink href={ `/blog/single/${ post.slug }` }>
                            {
                                isOriginal ? <LazyLoadImage
                                    src={ post.pictures[0].url }
                                    alt="post image"
                                    width={ 380 }
                                    height={ 280 }
                                    effect="opacity; transform"
                                    style={ { backgroundColor: "#DEE6E8" } }
                                />
                                    :
                                    <LazyLoadImage
                                        src={ post.pictures[ 0 ].url }
                                        alt="post image"
                                        width={ 380 }
                                        height={ 280 }
                                        effect="opacity; transform"
                                        style={ { backgroundColor: "#DEE6E8" } }
                                    />
                            }
                        </ALink>
                        :
                        <ALink href={ `/blog/single/${ post.slug }` }>
                            {
                                isOriginal ? <img
                                    src={ post.pictures[ 0 ].url }
                                    alt="post image"
                                    width={ post.pictures[ 0 ].width }
                                    height={ post.pictures[ 0 ].height }
                                /> :

                                    <img
                                        src={ post.pictures[ 0 ].url }
                                        alt="post image"
                                        width={ post.pictures[ 0 ].width }
                                        height={ post.pictures[ 0 ].height }
                                    />
                            }
                        </ALink>
                }
                {
                    post.type === 'video' ?
                        <>
                            <span className="video-play" onClick={ videoHandler }></span>
                            <video width="380">
                                <source src={ post.video.url } type="video/mp4" />
                            </video>
                        </>
                        : ''
                }
            </figure>

            <div className="post-details">
                <div className="post-meta">
                    {/* on <ALink href="#" className="post-date">{ new Date( post.date ).toLocaleDateString( 'en-US', { year: 'numeric', month: 'short', day: "2-digit", timeZone: "UTC" } ) }</ALink> | <ALink href="#" className="post-comment"><span>{ post.comments }</span> Comments</ALink> */}
                    on <ALink href="#" className="post-date">{ new Date( post.date ).toLocaleDateString( 'en-US', { year: 'numeric', month: 'short', day: "2-digit", timeZone: "UTC" } ) }</ALink>
                </div>
                <h4 className="post-title">
                    <ALink href={ `/blog/single/${ post.slug }` }>{ post.title }</ALink>
                </h4>
                <ALink href={ `/blog/single/${ post.slug }` } className={ `btn btn-link btn-underline btn-white ${ btnAdClass }` }>{ btnText }<i className="d-icon-arrow-right"></i></ALink>
            </div>
        </div >
    )
}

export default BlogGridView;