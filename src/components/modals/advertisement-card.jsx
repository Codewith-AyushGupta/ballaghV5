//Recommended image size was 580 X 249PX
import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Reveal from "react-awesome-reveal";
import ALink from '../utils/alink';
import { fadeInUpShorter } from '../utils/keyFrames';
function AdvertisementCard(props) {
    return (
        <section className="intro-section">
            <div className="row">
                <div className="col-md-6 mb-4">
                    <Reveal keyframes={fadeInUpShorter} delay={300} triggerOnce>
                        <div className="banner banner-fixed intro-banner intro-banner1 content-middle">
                            <figure>
                                <LazyLoadImage
                                    threshold={500}
                                    src={props.leftAlignCard.image.url}
                                    width="580"
                                    height="249"
                                    alt="banner"
                                    style={{ backgroundColor: "#eca5a9" }}
                                    effect="opacity"
                                />
                            </figure>
                            <div className="banner-content">
                                <h4
                                    className="banner-subtitle ls-normal text-white text-uppercase font-weight-normal lh-1">
                                    {props.leftAlignCard.rightAlignLightWeightHeading}</h4>
                                <h3 className="banner-title text-white font-weight-bold ls-md">
                                {props.leftAlignCard.rightAlignBoldWeightHeading}
                                </h3>
                                <ALink href={props.leftAlignCard.anchorButton.url}
                                    className="btn btn-white btn-link btn-underline font-weight-semi-bold">{props.leftAlignCard.anchorButton.label}<i className="d-icon-arrow-right"></i></ALink>
                            </div>
                        </div>
                    </Reveal>
                </div>

                <div className="col-md-6 mb-4">
                    <Reveal keyframes={fadeInUpShorter} delay={500} triggerOnce>
                        <div className="banner banner-fixed intro-banner intro-banner2 content-middle">
                            <figure>
                                <LazyLoadImage
                                    threshold={500}
                                    src={props.rightAlignCard.image.url}
                                    width="580"
                                    height="249"
                                    alt="banner"
                                    style={{ backgroundColor: "#494442" }}
                                    effect="opacity"
                                />
                            </figure>
                            <div className="banner-content">
                                <h4
                                    className="banner-subtitle ls-normal text-white text-uppercase font-weight-normal lh-1">
                                    {props.leftAlignCard.rightAlignLightWeightHeading}</h4>
                                <h3 className="banner-title text-white font-weight-bold ls-md">
                                    {props.leftAlignCard.rightAlignBoldWeightHeading}
                                </h3>
                                <ALink href={props.rightAlignCard.anchorButton.url}
                                    className="btn btn-white btn-link btn-underline btn-white font-weight-semi-bold">{props.rightAlignCard.anchorButton.label}<i className="d-icon-arrow-right"></i></ALink>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    )
}

export default AdvertisementCard
