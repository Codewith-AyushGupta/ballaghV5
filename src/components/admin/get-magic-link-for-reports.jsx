import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { useApiData } from '../../service/api-data-provider';
import Spinner from '../utils/spinner/full-page-spinner';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

function GetMagicLinkForReport() {
    const {
        tenantConfiguration,
        tenantConfigurationLoading,
        tenantConfigurationIsError,
    } = useApiData();
    const [pageSpinner, setPageSpinner] = useState(false);
    const generateMagicLink = async (e) => {
        e.preventDefault();
        setPageSpinner(true);
        let tenantID = process.env.REACT_APP_TENANT_ID;
        let formDetails = getFormDetails('adminForm')
        try {
            let response = await axios.post(
                tenantConfiguration.REACT_APP_PIPELINE_PROD_URL,
                {
                    pipelineName: tenantConfiguration.REACT_APP_GET_ADMIN_ACCESS_MAGIC_PIPELINE_NAME,
                    pipelineParams: [
                        { name: 'email', value: formDetails.email },
                        { name: 'pageUrl', value: window.location.origin+'/admin-after-getting-presignedURL' },
                    ],
                },
                {
                    headers: {
                        'x-tenant-id': tenantID,
                    },
                }
            )
            if (response.status === 200) {
                toast.dismiss();
                toast.success("Check your mail to get magic link", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,

                });
            }
        }
        catch (e) {
            toast.dismiss();
            toast.error("Failed to generate magic url", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,

            });
        }
        finally {
            setPageSpinner(false);
        }
    }
    const getFormDetails = (formId) => {
        const formElement = document.getElementById(formId);
        if (!formElement) {
            console.error(`Form with ID ${formId} not found.`);
            return {};
        }
        const formInstance = new FormData(formElement);
        return Object.fromEntries(formInstance.entries())
    }
    if (tenantConfigurationLoading || pageSpinner) {
        return <Spinner />;
    }
    if (tenantConfigurationIsError) {
        return <p>Error loading tenant configuration.</p>;
    }
    return (
        <div>
            <Helmet>
                <title>{tenantConfiguration.REACT_APP_COMPANY_NAME} | Admin</title>
            </Helmet>
            <div className="container mt-7 page-content pt-2 pb-1 checkout mb-2">
                <div className="row">
                    <div className="col-lg-12">
                        <form className="form" id="adminForm" onSubmit={generateMagicLink} aria-label="Checkout Form">
                            <h3 className="mb-3 title title-simple text-left text-uppercase text-align-center">Admin Page</h3>
                            <div className="form-group mb-1">
                                <label htmlFor="email">Email *</label>
                                <input className="form-control" name="email" id="email" type="email" required />
                            </div>
                            <button type='submit' className="btn btn-dark btn-rounded btn-order">
                                Get Magic Link For Report Generation
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default GetMagicLinkForReport
