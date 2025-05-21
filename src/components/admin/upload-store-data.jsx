import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import { useApiData } from '../../service/api-data-provider';
import Spinner from '../utils/spinner/full-page-spinner';
import { toast, ToastContainer } from 'react-toastify';

function UploadStoreData() {
    const {
        tenantConfiguration,
        tenantConfigurationLoading,
        tenantConfigurationIsError,
    } = useApiData();
    const [magicUrl, setMagicUrl] = useState(null);
    const [file, setFile] = useState(null);
    const [isStoreUpdateSuccessFully, setIsStoreUpdateSuccessFully] = useState(false);
    const [jsonData, setJsonData] = useState(null);
    const [fullPageSpinnerStatus, SetFullPageSpinnerStatus] = useState(false);

    useEffect(() => {
        let url = window.location.href;
        let magicURl = url.split('magicUrl=')[1];
        setMagicUrl(magicURl);
    }, []);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === "text/csv") {
            setFile(selectedFile);
            parseCSV(selectedFile);
        } else {
            alert("Please upload a valid CSV file.");
        }
    };

    const parseCSV = (file) => {
        const reader = new FileReader();
        reader.onload = ({ target }) => {
            Papa.parse(target.result, {
                header: true,
                skipEmptyLines: true,
                complete: function (result) {
                    setJsonData(result.data);
                }
            });
        };
        reader.readAsText(file);
    };

    const uploadFile = async (e) => {
        e.preventDefault();
        if (!jsonData || !magicUrl) {
            alert("JSON Data or Magic URL is missing!");
            return;
        }
        try {
            SetFullPageSpinnerStatus(true);
            let tenantID = process.env.REACT_APP_TENANT_ID;
            let response = await axios.post(
                tenantConfiguration.REACT_APP_PIPELINE_PROD_URL,
                {
                    pipelineName: tenantConfiguration.REACT_APP_GET_STORE_DATABASE_UPDATE_PIPELINE,
                    pipelineParams: [
                        { name: 'preSignedUrl', value: magicUrl },
                        { name: 'storeJSONDataArray', value: JSON.stringify(jsonData) },
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
            <form action="" className="form">
                <input type="file" accept=".csv" className='form-control' onChange={handleFileChange} />
                <button onClick={uploadFile} className='mb-3 w-100 btn btn-dark btn-rounded btn-order' disabled={!jsonData || !magicUrl}>
                    Start Upload
                </button>
            </form>
            <ToastContainer />
        </div>
    );
}

export default UploadStoreData;
