import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useApiData } from "../../service/api-data-provider";
import Spinner from "../utils/spinner/full-page-spinner";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Papa from "papaparse";
import Table from "./table";

function AdminAfterGettingPreSignedURL() {
  const {
    tenantConfiguration,
    tenantConfigurationLoading,
    tenantConfigurationIsError,

    storeDatabase,
    storeDatabaseLoading,
    storeDatabaseIsError,

    reportGenerationDatabase,
    reportGenerationDatabaseLoading,
    reportGenerationDatabaseIsError,
  } = useApiData();

  const [pageSpinner, setPageSpinner] = useState(false);
  const [magicUrl, setMagicUrl] = useState(false);
  const [email, setEmail] = useState(false);
  const [queryResponse, setQueryResponse] = useState(null);
  const [selectedReportMetaData, setSelectedReportMetaData] = useState(null);
  const [forDetails, setForDetails] = useState(null);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    let url = window.location.href;
    let magicURl = url.split("magicUrl=")[1].split("?email=")[0];
    let email = url.split("email=")[1];
    setEmail(email);
    setMagicUrl(magicURl);
  }, []);

  const handleFormSubmit = async (e, downloadType) => {
    e.preventDefault();
    setPageSpinner(true);
    setQueryResponse(null);
    let tenantID = process.env.REACT_APP_TENANT_ID;
    let formDetails = getFormDetails("adminForm");
    let selectedOperation = reportGenerationDatabase.find(
      (entry) => entry.label === formDetails.operationType
    );
    let query =
      formDetails.storeName === "All"
        ? selectedOperation.allStoreQuery
        : selectedOperation.storeBasesQuery.replace(
            "{{storeNamePlaceHolder}}",
            formDetails.storeName
          );
    setForDetails(formDetails);
    try {
      let response = await axios.post(
        tenantConfiguration.REACT_APP_PIPELINE_PROD_URL,
        {
          pipelineName: tenantConfiguration.REACT_APP_RUN_REPORT_QUERY,
          pipelineParams: [
            { name: "email", value: email },
            { name: "preSignedURL", value: magicUrl },
            { name: "query", value: query },
            { name: "tablePathName", value: selectedOperation.tableName },
            {
              name: "greaterThanOrEqualToDate",
              value: formDetails.greaterThanOrEqualToDate,
            },
            {
              name: "lessThanOrEqualToDate",
              value: formDetails.lessThanOrEqualToDate,
            },
          ],
        },
        {
          headers: {
            "x-tenant-id": tenantID,
          },
        }
      ); 
      if (response.status === 200) {
        setPageSpinner(false);
        toast.dismiss();
        toast.success("Success", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        if (response.data.message.queryResponse.length > 0) {
          setQueryResponse(response.data.message.queryResponse);
          setSelectedReportMetaData(selectedOperation);
          if (downloadType === "table") {
            setShowTable(true);
          }
        } else {
          toast.dismiss();
          toast.warning("No data Found.", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      }
    } catch (e) {
      setPageSpinner(false);
      toast.dismiss();
      toast.error("Failed to run query or magic link expired", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      
    }
  };
  const downloadPDFWithBlob = (PDFBlob, fileName) => {
    if (PDFBlob) {
      const url = URL.createObjectURL(PDFBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}.pdf`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };
  const downloadJsonAsCsv = (isHeaderRequired) => {
    if (!Array.isArray(queryResponse) || queryResponse.length === 0) {
      console.error("Invalid or empty JSON data");
      return;
    }

    const flattenObject = (obj, parentKey = "", result = {}) => {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          const newKey = parentKey ? `${parentKey}.${key}` : key;
          if (
            typeof obj[key] === "object" &&
            obj[key] !== null &&
            !Array.isArray(obj[key])
          ) {
            flattenObject(obj[key], newKey, result);
          } else {
            result[newKey] = obj[key];
          }
        }
      }
      return result;
    };

    const flattenedData = queryResponse.map((item) => flattenObject(item));

    const csv = Papa.unparse(flattenedData, {
      header: isHeaderRequired,
      quotes: false,
      delimiter: ",",
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${selectedReportMetaData.reportFileName}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const getFormDetails = (formId) => {
    const formElement = document.getElementById(formId);
    if (!formElement) {
      console.error(`Form with ID ${formId} not found.`);
      return {};
    }
    const formInstance = new FormData(formElement);
    return Object.fromEntries(formInstance.entries());
  };
  if (
    tenantConfigurationLoading ||
    storeDatabaseLoading ||
    reportGenerationDatabaseLoading
  ) {
    return <Spinner />;
  }
  if (
    tenantConfigurationIsError ||
    storeDatabaseIsError ||
    reportGenerationDatabaseIsError
  ) {
    return <p>Error loading tenant configuration.</p>;
  }
  return (
    <div>
      <Helmet>
        <title>{tenantConfiguration.REACT_APP_COMPANY_NAME} | Admin</title>
      </Helmet>
      <div className="container-fluid mt-7 page-content pt-2 pb-1 checkout mb-2">
        <div className="row mb-4 justify-content-center">
          <div className="col-lg-11 col-md-10 col-sm-12">
            <h3 className="mb-3 title title-simple text-left text-uppercase text-center">
              Admin Page
            </h3>
            <form
              className="form"
              id="adminForm"
              aria-label="Checkout Form"
              onSubmit={(e) => handleFormSubmit(e)}
            >
              <div className="row g-3">
                <div className="col-md-4">
                  <label htmlFor="storeName" className="form-label">
                    Select Store *
                  </label>
                  <select
                    id="storeName"
                    className="form-control"
                    name="storeName"
                    required
                  >
                    <option key={0} value={"All"}>
                      All
                    </option>
                    {storeDatabase?.map((entry, index) => (
                      <option key={index} value={entry.storeName}>
                        {entry.storeName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4">
                  <label htmlFor="operationType" className="form-label">
                    Select Report Type *
                  </label>
                  <select
                    id="operationType"
                    className="form-control"
                    name="operationType"
                    required
                  >
                    {reportGenerationDatabase.map((entry, index) => (
                      <option key={index} value={entry.label}>
                        {entry.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label
                    htmlFor="greaterThanOrEqualToDate"
                    className="form-label"
                  >
                    Greater Than Or Equal *
                  </label>
                  <input
                    className="form-control"
                    name="greaterThanOrEqualToDate"
                    id="greaterThanOrEqualToDate"
                    type="date"
                    required
                    style={{ content: "none" }}
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="lessThanOrEqualToDate" className="form-label">
                    Lesser Than Or Equal *
                  </label>
                  <input
                    className="form-control"
                    name="lessThanOrEqualToDate"
                    id="lessThanOrEqualToDate"
                    type="date"
                    required
                  />
                </div>
                <div className="col-md-4"></div>
                <div className="col-md-4">
                  <button
                    type="submit"
                    className="btn btn-dark btn-rounded btn-order mb-2"
                    onClick={(e) => handleFormSubmit(e, "table")}
                  >
                    Run Report
                  </button>
                </div>
                {showTable ? (
                  <>
                    <div className="col-md-4">
                      <button
                        type="button"
                        className="btn btn-dark btn-rounded btn-order mb-2  hide-on-print"
                        onClick={(e) =>{window.print();}}
                      >
                        Download As PDF
                      </button>
                    </div>
                    <div className="col-md-4">
                      <button
                        type="button"
                        className="btn btn-dark btn-rounded btn-order mb-2 hide-on-print pl-2 pr-2"
                        onClick={(e) => downloadJsonAsCsv(true)}
                      >
                        Download As CSV With Headers
                      </button>
                    </div>
                    <div className="col-md-4">
                      <button
                        type="button"
                        className="btn btn-dark btn-rounded btn-order mb-2 hide-on-print pl-0  pr-0"
                        onClick={(e) => downloadJsonAsCsv(false)}
                      >
                        Download As CSV Without Headers
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            </form>
          </div>
        </div>
        {showTable ? <Table data={queryResponse} /> : null}
      </div>
      {pageSpinner?<Spinner/>:<ToastContainer className="hide-on-print" />}
    </div>
  );
}

export default AdminAfterGettingPreSignedURL;
