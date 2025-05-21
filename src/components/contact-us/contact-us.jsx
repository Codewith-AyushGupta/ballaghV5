import React, { useState } from 'react';
import Helmet from 'react-helmet';
import Reveal from 'react-awesome-reveal';
import { fadeIn } from '../utils/keyFrames';
import Spinner from '../utils/spinner/full-page-spinner';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ALink from '../utils/alink';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApiData } from '../../service/api-data-provider';

function ContactUs() {
    const [isFullPageSpinnerActive, setFullPageSpinnerActive] = useState(false);
    const {
        tenantConfiguration,
        tenantConfigurationLoading,
        tenantConfigurationIsError,
    } = useApiData();

    const handleContactFormSubmit = async (event) => {
        event.preventDefault();
        let formDetails = getFormDetails();
        if (!formDetails) return;

        setFullPageSpinnerActive(true);
        let response = await sendMessage(formDetails);
        if (response === 200) {
            showSuccessToast('Thank you for contacting us! We will get in touch with you shortly.', true);
        }
        else {
            showSuccessToast('Failed to send please try again after some time.', false);
        }
        setFullPageSpinnerActive(false);
    };

    const showSuccessToast = (message, isSuccess) => {
        if (isSuccess) {
            toast.success(message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        else {
            toast.error(message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    if (tenantConfigurationLoading) {
        return <Spinner />;
    }

    if (tenantConfigurationIsError) {
        return <div>Error loading data</div>;
    }

    const sendMessage = async (formDetails) => {
        try {
            let tenantID = process.env.REACT_APP_TENANT_ID;
            const response = await axios.post(
                tenantConfiguration.REACT_APP_PIPELINE_PROD_URL,
                {
                    pipelineName: tenantConfiguration.REACT_APP_CONTACT_US_PROD_PIPELINE_NAME,
                    pipelineParams: [{ name: "formDetails", value: formDetails }]
                },
                {
                    headers: {
                        'x-tenant-id': tenantID,
                    }
                }
            );
            return response.status;
        } catch (error) {
            console.error('Error in API request:', error);
            return 500; // Fallback error status
        }
    };

    const getFormDetails = () => {
        const formElement = document.getElementById('contactForm');
        if (!formElement) {
            console.error('Form element not found!');
            return null;
        }
        const formData = new FormData(formElement);
        const formDataObject = Object.fromEntries(formData.entries());
        return JSON.stringify(formDataObject);
    };

    if (isFullPageSpinnerActive) return <Spinner />;

    return (
        <>
            <main className="main contact-us">
                <Helmet>
                    <title>{tenantConfiguration.REACT_APP_COMPANY_NAME} | Contact Us</title>
                </Helmet>

                <h1 className="d-none">Contact Us</h1>

                <nav className="breadcrumb-nav">
                    <div className="container">
                        <ul className="breadcrumb">
                            <li><ALink href="/"><i className="d-icon-home"></i></ALink></li>
                            <li>Contact Us</li>
                        </ul>
                    </div>
                </nav>

                <div className="page-header" style={{ backgroundImage: `url(${tenantConfiguration.REACT_APP_CONTACT_US_PAGE_BANNER_URL})`, backgroundColor: "#92918f" }}>
                    <h1 className="page-title font-weight-bold text-capitalize ls-l">Contact Us</h1>
                </div>

                <div className="page-content mt-2 pt-7">
                    <Reveal keyframes={fadeIn} delay="50" duration="1000" triggerOnce>
                        <section className="contact-section">
                            <div className="container">
                                <div className="row reverse-form">
                                    <div className="col-lg-3 col-md-4 col-sm-6 ls-m mb-4">
                                        <div className="grey-section d-flex align-items-center h-100">
                                            <div>
                                                <h4 className="mb-2 text-capitalize">Address</h4>
                                                {tenantConfiguration.REACT_APP_ADDRESS_LINE1}<br />
                                                <p>{tenantConfiguration.REACT_APP_ADDRESS_LINE2}<br />
                                                    {tenantConfiguration.REACT_APP_ADDRESS_LINE3}<br />
                                                    {tenantConfiguration.REACT_APP_ADDRESS_LINE4}<br /></p>
                                                {tenantConfiguration.REACT_APP_PHONE && tenantConfiguration.REACT_APP_PHONE.length >= 10 && (
                                                    <>
                                                        <h4 className="mb-2 text-capitalize">Phone Number</h4>
                                                        <p><ALink href="#">{tenantConfiguration.REACT_APP_PHONE}</ALink><br /></p>
                                                    </>
                                                )}
                                                <h4 className="mb-2 text-capitalize">Support</h4>
                                                <p className="mb-4"><ALink href="#">{tenantConfiguration.REACT_APP_EMAIL}</ALink><br /></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-9 col-md-8 col-sm-6 d-flex align-items-center mb-4">
                                        <div className="w-100">
                                            <form className="pl-lg-2" onSubmit={handleContactFormSubmit} id="contactForm">
                                                <div className="row mb-2">
                                                    <label htmlFor="firstName">First Name *</label>
                                                    <input className="form-control" name="First Name" id="firstName" type="text" required={true} placeholder="" />
                                                </div>
                                                <div className="row mb-2">
                                                    <label htmlFor="lastName">Last Name *</label>
                                                    <input className="form-control" name="Last Name" id="lastName" type="text" required={true} placeholder="" />
                                                </div>
                                                <div className="row mb-2">
                                                    <label htmlFor="email">Email *</label>
                                                    <input className="form-control" name="Email" id="email" type="email" required={true} placeholder="" />
                                                </div>
                                                <div className="row mb-2">
                                                    <label htmlFor="phone">Phone *</label>
                                                    <input className="form-control" name="Phone" id="phone" type="number" required={true} placeholder="" />
                                                </div>
                                                <div className="row mb-2">
                                                    <label htmlFor="Message">Message *</label>
                                                    <textarea className="form-control" name="Message" id="Message" required={true} placeholder=""></textarea>
                                                </div>
                                                <button className="btn btn-dark btn-rounded" disabled={isFullPageSpinnerActive}>
                                                    Send<i className="d-icon-arrow-right"></i>
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </Reveal>
                </div>
            </main>

            <ToastContainer />
        </>
    );
}

export default React.memo(ContactUs);
