import React, { useEffect } from 'react';
import Reveal from "react-awesome-reveal";
import { LazyLoadImage } from 'react-lazy-load-image-component';
// import Custom Components
import ALink from '../utils/alink';
import OwlCarousel from '../owl-carousel/owl-carousel';
import BodyCenterSlide from './intro-sections-templates/body-center-slide';
import LeftAlignSlide from './intro-sections-templates/left-align-slide';
// images and content should be posted in dyanmically via props.

import { fadeInUpShorter, fadeInRightShorter, fadeInDownShorter, blurIn } from '..//utils/keyFrames';
import { introSlider } from '..//owl-carousel/data/carousel';

function IntroSection(props) {
    return (
        <section className="intro-section">
            <div className="row">
                <div className="col-12 mb-4">
                    <OwlCarousel adClass="owl-theme owl-dot-inner owl-dot-white intro-slider animation-slider" options={introSlider}>
                        {
                            Object.values(props)?.map((singleSlide) =>
                                singleSlide.slideId === 'bodyCenter'
                                    ? <BodyCenterSlide {...singleSlide} />
                              : singleSlide.slideId === 'leftAlign'
                                    ? <LeftAlignSlide {...singleSlide} />
                              : <></>
                            )
                        }


                    </OwlCarousel>
                </div>
            </div>
        </section >
    )
}

export default React.memo(IntroSection);