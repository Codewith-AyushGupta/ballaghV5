import React, { useEffect } from 'react';
import Reveal from "react-awesome-reveal";

import OwlCarousel from '../owl-carousel/owl-carousel';

import { serviceSlider } from '../owl-carousel/data/carousel';
import { fadeInRightShorter } from '../utils/keyFrames';

function ServiceBox(props) {
    return (
        <section className="service-list mt-10">
            <OwlCarousel adClass="owl-theme" options={serviceSlider}>
                {
                    Object.values(props).map((singleService) => (
                        <Reveal keyframes={fadeInRightShorter} delay={200} triggerOnce>
                            <div className="icon-box">
                                <div className="icon-box-content">
                                    <h3 className="icon-box-title font-weight-bold text-capitalize ls-normal mb-0">{singleService.boldHeading}</h3>
                                    <p className="text-primary">{singleService.subHeading}</p>
                                </div>
                            </div>
                        </Reveal>
                    ))
                }
            </OwlCarousel>
        </section>


    )
}

export default React.memo(ServiceBox);