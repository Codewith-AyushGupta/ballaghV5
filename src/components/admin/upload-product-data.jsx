import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import { useApiData } from '../../service/api-data-provider';
import Spinner from '../utils/spinner/full-page-spinner';
import { toast, ToastContainer } from 'react-toastify';

function UploadProductData() {
    const {
        tenantConfiguration,
        tenantConfigurationLoading,
        tenantConfigurationIsError,
    } = useApiData();
    const [magicUrl, setMagicUrl] = useState(null);
    const [file, setFile] = useState(null);
    const [isStoreUpdateSuccessFully, setIsStoreUpdateSuccessFully] = useState(false);
    const [productJsonData, setProductJsonData] = useState(null);
    const [productVariantJsonData, setProductVariantJsonData] = useState(null);
    const [fullPageSpinnerStatus, SetFullPageSpinnerStatus] = useState(false);
    const [productBundleJsonData, setProductBundleJsonData] = useState(false);

    useEffect(() => {
        let url = window.location.href;
        let magicURl = url.split('magicUrl=')[1];
        setMagicUrl(magicURl);
    }, []);

    const handleProductFileChange =async (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === "text/csv") {
            setFile(selectedFile);
            let response =await  parseCSV(selectedFile);
            setProductJsonData(response)
        } else {
            alert("Please upload a valid CSV file.");
        }
    };
    const handleProductVariantFileChange =async  (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === "text/csv") {
            setFile(selectedFile);
            let response =await  parseCSV(selectedFile);
            setProductVariantJsonData(response)
        } else {
            alert("Please upload a valid CSV file.");
        }
    };
    const handleProductBundleFileChange =async  (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === "text/csv") {
            setFile(selectedFile);
            let response =await  parseCSV(selectedFile);
            setProductBundleJsonData(response)
        } else {
            alert("Please upload a valid CSV file.");
        }
    };

    const parseCSV = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = ({ target }) => {
                Papa.parse(target.result, {
                    header: true,
                    skipEmptyLines: true,
                    complete: function (result) {

                        resolve(result.data);
                    },
                    error: function (error) {
                        reject(error);
                    }
                });
            };
            reader.readAsText(file);
        });
    };

    const uploadFile = async (e) => {
        e.preventDefault();
        if (!productVariantJsonData || !productJsonData || !magicUrl) {
            alert("JSON Data or Magic URL is missing!");
            return;
        }
        try {
            SetFullPageSpinnerStatus(true);
            let tenantID = process.env.REACT_APP_TENANT_ID;
            let response = await axios.post(
                tenantConfiguration.REACT_APP_PIPELINE_PROD_URL,
                {
                    pipelineName: tenantConfiguration.REACT_APP_GET_PRODUCT_DATABASE_UPDATE_PIPELINE,
                    pipelineParams: [
                        { name: 'preSignedUrl', value: magicUrl },
                        { name: 'ProductJSONDataArray', value: JSON.stringify(productJsonData) },
                        // { name: 'ProductBundleJSONDataArray', value: JSON.stringify(productBundleJsonData) },
                        { name: 'ProductVariantsJSONDataArray', value: JSON.stringify(productVariantJsonData) },
                    ],
                },
                {
                    headers: {
                        'x-tenant-id': tenantID,
                    },
                }
            )

            if (response.status === 200) {
                setIsStoreUpdateSuccessFully(true)
            } else {
                alert("Upload failed!");
                setIsStoreUpdateSuccessFully(false)
            }
        } catch (error) {
            setIsStoreUpdateSuccessFully(false)
        }
        finally {
            SetFullPageSpinnerStatus(false);
            toast.dismiss();
            setIsStoreUpdateSuccessFully((prevState) => {
                if (prevState) {
                    toast.success('Store Updates Successfully', {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                } else {
                    toast.error('Error On Updating Store Database.', {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
                return prevState;
            });
        }
    };
    if (tenantConfigurationLoading || fullPageSpinnerStatus) {
        return <Spinner />;
    }
    if (tenantConfigurationIsError) {
        return <p>Error loading tenant configuration.</p>;
    }
    return (
        <div className='container'>
            <h2 className='text-align-left mt-4 mb-4 post-title'>Upload Store CSV</h2>
            <form action="" className="form" onSubmit={uploadFile}>
                <label htmlFor="productCSV">Upload Product</label>
                <input type="file" accept=".csv" name='productCSV' className='form-control' onChange={handleProductFileChange} required />
                {/* <label htmlFor="productBundleCSV">Upload Bundle Product</label> */}
                {/* <input type="file" accept=".csv" name='productBundleCSV' className='form-control' onChange={handleProductBundleFileChange} /> */}
                <label htmlFor="productVariantCSV">Upload Product variants</label>
                <input type="file" accept=".csv" name='productVariantCSV' className='form-control' onChange={handleProductVariantFileChange} required />
                <button type='submit' className='mb-3 w-100 btn btn-dark btn-rounded btn-order' disabled={!productJsonData ||!productVariantJsonData || !magicUrl}>
                    Start Upload
                </button>
            </form>
            <ToastContainer />
        </div>
    );
}

export default UploadProductData;
