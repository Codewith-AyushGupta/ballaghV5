import React from 'react';
import Reveal from "react-awesome-reveal";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import ALink from '../utils/alink';
function CategorySection(props) {
    return (
        <>
            <Reveal triggerOnce>
                <section className="pt-md-2 pb-md-6 category-section">
                    <h2 className="title title-simple ls-m">{props.pageHeading}</h2>
                    <div className="row grid" >
                        <div className="grid-item col-md-6 height-x2" style={{ maxHeight: "100vh" }}>
                            <div className="banner banner-fixed content-middle content-center overlay-dark">
                                <ALink href="/">
                                    <figure>
                                        <LazyLoadImage threshold={300} src={props.leftSection.image.url} alt="category" width="585"
                                            height="397" style={{ backgroundColor: "#eef0f1" }} effect="opacity" />
                                    </figure>
                                </ALink>
                                <div className="banner-content text-center w-100 h-100 d-flex flex-column">
                                    <h3 className="banner-title text-uppercase ls-s mb-0 text-white">{props.leftSection.boldHeading}</h3>
                                    <h4
                                        className="banner-subtitle flex-1 font-weight-normal text-capitalize ls-md lh-1 mb-0 text-white">
                                        {props.leftSection.subHeading}</h4>
                                    <div className="btn-group">
                                        <ALink href={props.leftSection.bottomCenterButton.button1.url} className="btn btn-white btn-rounded font-weight-semi-bold">{props.leftSection.bottomCenterButton.button1.label}</ALink>
                                        &nbsp;
                                        <ALink href={props.leftSection.bottomCenterButton.button2.url} className="btn btn-white btn-rounded font-weight-semi-bold">{props.leftSection.bottomCenterButton.button2.label}</ALink>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid-item col-md-6 height-x1 d-sm-flex d-md-block d-block" style={{ maxHeight: "50vh" }}>
                            <div className="category category-light category-absolute overlay-dark mb-4 mb-sm-0 mb-md-4 mr-0 mr-sm-4 mr-md-0">
                                <ALink href='/'>
                                    <figure className="category-media">
                                        <LazyLoadImage threshold={500} src={props.rightSection.topRightPart.image.url} alt="category" width="585"
                                            height="205" style={{ backgroundColor: "#c8ced4" }} effect="opacity" />
                                    </figure>
                                </ALink>
                                <div className="category-content">
                                    <h4 className="category-name"><ALink href={props.rightSection.topRightPart.bottomCenterButton.button1.url}>{props.rightSection.topRightPart.bottomCenterButton.button1.label}</ALink></h4>
                                </div>
                            </div>

                            <div className="category category-light category-absolute overlay-dark">
                                <ALink href='/'>
                                    <figure className="category-media">
                                        <LazyLoadImage src={props.rightSection.bottomRightPart.image.url} threshold={500} alt="category" width="585"
                                            height="397" style={{ backgroundColor: "#ebedef" }} effect="opacity" />
                                    </figure>
                                </ALink>
                                <div className="category-content">
                                    <h4 className="category-name"><ALink href={props.rightSection.bottomRightPart.bottomCenterButton.button1.url}>{props.rightSection.bottomRightPart.bottomCenterButton.button1.label}</ALink></h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </Reveal>
        </>
    )
}

export default React.memo(CategorySection);