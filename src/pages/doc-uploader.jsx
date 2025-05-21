import React, { useState } from 'react'
import { useApiData } from '../service/api-data-provider';
import axios from 'axios';
import Spinner from '../components/utils/spinner/full-page-spinner';
import { toast, ToastContainer } from 'react-toastify';

function DocUploader() {
  const {
    tenantConfiguration,
    tenantConfigurationLoading,
    tenantConfigurationIsError,
  } = useApiData();
  const [isFullPageSpinnerActive, setFullPageSpinnerActive] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.elements.email.value;
    const action = e.nativeEvent.submitter.getAttribute("data-action"); 
    try {
      setFullPageSpinnerActive(true)
      let tenantID = process.env.REACT_APP_TENANT_ID;
      const response = await axios.post(
        tenantConfiguration.REACT_APP_PIPELINE_PROD_URL,
        {
          pipelineName: tenantConfiguration.REACT_APP_DOC_UPLOAD_NAME,
          pipelineParams: [{ name: "email", value: email },
            { name: "actionType", value: action }
          ]
        },
        {
          headers: {
            'x-tenant-id': tenantID,
          }
        }
      );
      setFullPageSpinnerActive(false);
      if (response.status === 200) {
        showSuccessToast('Successfully Send mail.', true);
      }
      else {
        showSuccessToast('Failed to send please try again after some time.', false);
      }
    } catch (error) {
      console.error('Error in API request:', error);
      return 500;
    }
  }
  if (isFullPageSpinnerActive || tenantConfigurationLoading) {
    return <Spinner />
  }
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
  return (
    <div className='container mb-4'>
      <h3 className="row mb-2 title title-simple text-left text-uppercase text-align-center">Doc Upload Form</h3>
      <form className="form" onSubmit={handleSubmit} id="" aria-label="Checkout Form">
        <label htmlFor="email">Email *</label>
        <input
          className="form-control"
          name="email"
          id="email"
          type="email"
          required
        />
        <button
          type="submit"
          name="action"
          data-action="uploadDocument"
          className="btn btn-dark btn-rounded btn-order mr-4"
        >
          Upload Products
        </button>
        <button
          type="submit"
          name="action"
          data-action="generateReport"
          className="btn btn-dark btn-rounded btn-order"
        >
          Generate Report
        </button>
      </form>

      <ToastContainer />
    </div>
  )
}

export default DocUploader
