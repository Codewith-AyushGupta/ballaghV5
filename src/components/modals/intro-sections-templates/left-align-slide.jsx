import React from 'react'
import Reveal from "react-awesome-reveal";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import ALink from '../../utils/alink';
import { fadeInUpShorter, fadeInRightShorter, fadeInDownShorter, blurIn } from '..//..//utils/keyFrames';
function leftAlignSlide(props) {
    return (
        <div>
            <div className="intro-slide2 banner banner-fixed">
                <figure>
                    <LazyLoadImage
                        threshold={500}
                        src={props.image.url}
                        alt="banner" width="1180"
                        height="550"
                        style={{ backgroundColor: "#686868", maxHeight: "50px" }}
                        effect="opacity" />
                </figure>
                <div className="banner-content y-50">
                    <Reveal keyframes={fadeInDownShorter} duration={1200} delay={500}>
                        <h4 className="banner-subtitle font-weight-normal lh-1 ls-m text-dark">
                            {props.smallTextTile}</h4>
                    </Reveal>

                    <Reveal keyframes={blurIn} duration={1400} delay={100}>
                        <h3 className="banner-title ls-l text-white text-uppercase font-weight-bold lh-1 text-dark">
                        {props.largeTextTitle}</h3>
                    </Reveal>

                    <Reveal keyframes={fadeInUpShorter} duration={1000} delay={700}>
                        <h5 className="font-weight-normal text-white text-uppercase lh-1 ls-m mb-1 text-dark">
                        {props.subTitle.normalText}<span className="text-secondary font-weight-bold">{props.subTitle.highlightedText}</span>
                        </h5>
                    </Reveal>

                    <Reveal keyframes={fadeInUpShorter} duration={1000} delay={900}>
                        <p className="font-weight-normal ls-s mb-7 text-dark">
                            {props.blowSubtitle}</p>
                    </Reveal>

                    <Reveal keyframes={fadeInUpShorter} duration={1200} delay={1100}>
                        <ALink href={props.leftAlignButton.url} className="btn btn-white btn-rounded text-dark">{props.leftAlignButton.label}</ALink>
                    </Reveal>
                </div>
            </div>
        </div>
    )
}

export default leftAlignSlide
