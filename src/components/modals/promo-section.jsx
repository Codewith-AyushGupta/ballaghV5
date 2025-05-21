// Recommended image size was 1194 X 282PX
import Reveal from 'react-awesome-reveal';

import {fadeInUpShorter } from '..//utils/keyFrames';

export default function PromoSection(props) {
    return (
        <>
            <Reveal triggerOnce>
                <section className="banner banner-sale mt-10 mb-10"
                    style={{ backgroundImage: `url(${props.image.url})`, backgroundColor: "#1f272b" }}>
                    <Reveal keyframes={fadeInUpShorter} duration={1000} triggerOnce>
                        <div className="banner-content">
                            <h4 className="banner-subtitle text-uppercase text-white font-weight-normal lh-1 ls-m mb-0">{props.leftCenterTitleText.normalHeading}</h4>
                            <hr className="divider mb-2" />
                            <h3 className="banner-title text-uppercase text-white lh-1 mb-0">{props.leftCenterTitleText.boldHeading}</h3>
                            <div className="banner-price-info d-flex align-items-center justify-content-center">
                                <h5 className="text-uppercase text-white ls-l mb-0">{props.insideCircle.normalText}<br /><span
                                    className="text-secondary ls-l">{props.insideCircle.highlightedText}</span>{props.insideCircle.smallTextSize}</h5>
                            </div>
                        </div>
                    </Reveal>
                </section>
            </Reveal>
        </>
    )
}