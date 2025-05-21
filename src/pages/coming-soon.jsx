import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import ALink from '../components/utils/alink';
import CountDown from '../components/utils/count-down';
import Spinner from '../components/utils/spinner/full-page-spinner';

function ComingSoon(props) {
    const [time, setTime] = useState(0);
    useEffect(() => {
        if (Object.keys(props).length > 0) {
            const countdownTime = props.countdown.days * 24 * 3600000;
            setTime(Date.now() + countdownTime);
        }
    }, []);
    if (Object.keys(props).length === 0) {
        return <Spinner />
    }
    return (
        <main className="main">
            <Helmet>
                <title>{props.metaTitle}</title>
            </Helmet>

            <h1 className="d-none">{props.pageTitle}</h1>

            <div className="page-props">
                <section className="coming-section container text-center text-grey font-primary">
                    <div className="row align-items-center pt-10 pb-10">
                        <div className="col-md-6">
                            <LazyLoadImage
                                src={props.images.url}
                                alt={props.heading}
                                width="519"
                                height="568"
                                effect="opacity"
                                style={{ backgroundColor: "#fff" }}
                            />
                        </div>
                        <div className="col-md-6 order-md-first">
                            <h1 className="mb-9 ls-m lh-1 font-italic text-uppercase">
                                {props.heading}
                            </h1>

                            <CountDown
                                adClass="countdown-coming mb-7"
                                date={time}
                            />

                            <hr className="mb-6 ml-8 mr-8" />
                            <p>{props.description}</p>
                            <form action="#" className="ml-lg-8 mr-lg-8 mb-8">
                                <input
                                    type="email"
                                    className="form-control font-primary text-grey"
                                    name="email"
                                    id="email"
                                    placeholder={props.form.inputPlaceholder}
                                    required
                                />
                                <button
                                    className="btn btn-primary btn-link btn-icon-right"
                                    type="submit"
                                >
                                    {props.form.buttonText}
                                </button>
                            </form>
                            <div className="social-links">
                                {props.socialLinks.map((link, index) => (
                                    <ALink
                                        key={index}
                                        href={link.url}
                                        className={`social-link ${link.iconClass}`}
                                    ></ALink>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default React.memo(ComingSoon);
