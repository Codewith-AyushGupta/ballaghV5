import React from 'react'
import Reveal from "react-awesome-reveal";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import ALink from '../../utils/alink';
import { fadeInUpShorter, fadeInRightShorter, fadeInDownShorter, blurIn } from '..//..//utils/keyFrames';
function bodyCenterSlide(props) {
    return (
        <div>
            <div className="banner banner-fixed intro-slide1 content-center content-middle"
                style={{ backgroundColor: "#444342" }}>
                <figure>
                    <LazyLoadImage
                        threshold={500}
                        src={props.image.url}
                        alt="intro-banner"
                        width="1180"
                        height="330"
                        style={{ backgroundColor: "#444342", maxHeight: "50px" }}
                        effect="opacity"
                    />
                </figure>
                <div className="banner-content">
                    <Reveal keyframes={fadeInRightShorter} duration={1200} delay={300}>
                        <h4 className="banner-subtitle font-weight-semi-bold text-white ls-normal lh-1 mb-0 text-uppercase text-left">
                            {props.smallTextTile}</h4>
                    </Reveal>

                    <Reveal keyframes={fadeInRightShorter} duration={1200} delay={300}>
                        <h2 className="banner-title text-uppercase text-white">
                            {props.largeTextTitle}</h2>
                    </Reveal>

                    <Reveal keyframes={fadeInRightShorter} duration={1000} delay={1000}>
                        <h5 className="font-weight-normal text-white lh-1 ls-normal text-right mb-1">
                            {props.rightAlign.normalText} <span className="text-secondary font-weight-bold">{props.rightAlign.highlightedText}</span>
                        </h5>
                    </Reveal>

                    <Reveal keyframes={fadeInUpShorter} duration={1200} delay={1100}>
                        <ALink href={props.centerAlignButton.url} className="btn btn-white btn-rounded">{props.centerAlignButton.label}</ALink>
                    </Reveal>
                </div>
            </div>
        </div>
    )
}

export default bodyCenterSlide
