import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const DataContext = createContext();

export const fetchProductDatabase = async () => {
  try {
    const baseUrl = process.env.REACT_APP_S3_BUCKET + "/productDatabase.json";
    const urlWithTimestamp = `${baseUrl}?t=${Date.now()}`;
    const response = await axios.get(urlWithTimestamp, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching product database:", error);
    throw new Error("Failed to fetch product database.");
  }
};

export const fetchTenantConfiguration = async () => {
  try {
    const response = await axios.get(
      process.env.REACT_APP_S3_BUCKET + "/tenant-configuration.json",
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching tenant configuration:", error);
    throw new Error("Failed to fetch tenant configuration.");
  }
};
const fetchHomePageComponentsMetadata = async () => {
  let response = await axios.get(
    process.env.REACT_APP_S3_BUCKET + "/home-page-configuration-metadata.json",
    {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );

  if (response.status === 200) {
    return response.data;
  }
};
const fetchHeaderTabsMetaData = async () => {
  let response = await axios.get(
    process.env.REACT_APP_S3_BUCKET +
      "/header-tabs-configurations-metadata.json",
    {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
  if (response.status === 200) {
    return response.data;
  }
};
const fetchDynamicPagesMetadataIndex = async () => {
  let response = await axios.get(
    process.env.REACT_APP_S3_BUCKET + "/dynamic-pages-metadata-index.json",
    {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
  if (response.status === 200) {
    return response.data;
  }
};
const fetchBlogPostMetadata = async () => {
  let response = await axios.get(
    process.env.REACT_APP_S3_BUCKET + "/blog-database.json",
    {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
  if (response.status === 200) {
    return response.data;
  }
};
const fetchReportGenerationMetadata = async () => {
  let response = await axios.get(
    process.env.REACT_APP_S3_BUCKET + "/reportGenerationMetaData.json",
    {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
  if (response.status === 200) {
    return response.data;
  }
};
const fetchStoreMetadata = async () => {
  const baseUrl = process.env.REACT_APP_S3_BUCKET + "/storeDatabase.json";
  const urlWithTimestamp = `${baseUrl}?t=${Date.now()}`;
  let response = await axios.get(urlWithTimestamp, {
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
  if (response.status === 200) {
    return response.data;
  }
};
export const ApiDataProvider = ({ children }) => {
  if (!children) {
    throw new Error(
      "ApiDataProvider must wrap components and provide 'children' as its prop."
    );
  }

  const productDatabaseQuery = useQuery({
    queryKey: ["productDatabase"],
    queryFn: fetchProductDatabase,
    // staleTime: 5 * 60 * 1000,
    // cacheTime: 1 * 60 * 1000,
    // refetchOnWindowFocus: true,
  });
  const tenantConfigurationQuery = useQuery({
    queryKey: ["fetchTenantConfiguration"],
    queryFn: fetchTenantConfiguration,
    // staleTime: 5 * 60 * 1000,
    // cacheTime: 1 * 60 * 1000,
    // refetchOnWindowFocus: true,
  });
  const getHomePageComponentsMetadataQuery = useQuery({
    queryKey: ["fetchHomePageComponentsMetadata"],
    queryFn: fetchHomePageComponentsMetadata,
    // staleTime: 5 * 60 * 1000,
    // cacheTime: 1 * 60 * 1000,
    // refetchOnWindowFocus: true,
  });

  const getHeaderTabsMetaDataQuery = useQuery({
    queryKey: ["fetchHeaderTabsMetaData"],
    queryFn: fetchHeaderTabsMetaData,
    // staleTime: 5 * 60 * 1000,
    // cacheTime: 1 * 60 * 1000,
    // refetchOnWindowFocus: true,
  });
  const getFetchDynamicPagesMetadataIndexQuery = useQuery({
    queryKey: ["fetchDynamicPagesMetadataIndex"],
    queryFn: fetchDynamicPagesMetadataIndex,
    // staleTime: 5 * 60 * 1000,
    // cacheTime: 1 * 60 * 1000,
    // refetchOnWindowFocus: true,
  });
  const getBlogPostMetadataQuery = useQuery({
    queryKey: ["fetchBlogPostMetadata"],
    queryFn: fetchBlogPostMetadata,
    // staleTime: 5 * 60 * 1000,
    // cacheTime: 1 * 60 * 1000,
    // refetchOnWindowFocus: true,
  });
  const getStoreQuery = useQuery({
    queryKey: ["fetchStoreMetadata"],
    queryFn: fetchStoreMetadata,
    // staleTime: 5 * 60 * 1000,
    // cacheTime: 1 * 60 * 1000,
    // refetchOnWindowFocus: true,
  });
  const getReportGenerationMetadataQuery = useQuery({
    queryKey: ["fetchReportGenerationMetadata"],
    queryFn: fetchReportGenerationMetadata,
    // cacheTime: 1 * 60 * 1000,
    // staleTime: 5 * 60 * 1000,
    // refetchOnWindowFocus: true,
  });

  return (
    <DataContext.Provider
      value={{
        productDatabase: productDatabaseQuery.data,
        productDatabaseLoading: productDatabaseQuery.isLoading,
        productDatabaseIsError: productDatabaseQuery.error,

        tenantConfiguration: tenantConfigurationQuery.data,
        tenantConfigurationLoading: tenantConfigurationQuery.isLoading,
        tenantConfigurationIsError: tenantConfigurationQuery.isError,

        homePageComponentsConfiguration:
          getHomePageComponentsMetadataQuery.data,
        homePageComponentsConfigurationLoading:
          getHomePageComponentsMetadataQuery.isLoading,
        homePageComponentsConfigurationIsError:
          getHomePageComponentsMetadataQuery.isError,

        headerTabsMetaDataConfiguration: getHeaderTabsMetaDataQuery.data,
        headerTabsMetaDataConfigurationLoading:
          getHeaderTabsMetaDataQuery.isLoading,
        headerTabsMetaDataConfigurationIsError:
          getHeaderTabsMetaDataQuery.isError,

        dynamicPagesMetadataIndex: getFetchDynamicPagesMetadataIndexQuery.data,
        dynamicPagesMetadataIndexLoading:
          getFetchDynamicPagesMetadataIndexQuery.isLoading,
        dynamicPagesMetadataIndexIsError:
          getFetchDynamicPagesMetadataIndexQuery.isError,

        blogPostMetadata: getBlogPostMetadataQuery.data,
        blogPostMetadataLoading: getBlogPostMetadataQuery.isLoading,
        blogPostMetadataIsError: getBlogPostMetadataQuery.isError,

        storeDatabase: getStoreQuery.data,
        storeDatabaseLoading: getStoreQuery.isLoading,
        storeDatabaseIsError: getStoreQuery.isError,

        reportGenerationDatabase: getReportGenerationMetadataQuery.data,
        reportGenerationDatabaseLoading:
          getReportGenerationMetadataQuery.isLoading,
        reportGenerationDatabaseIsError:
          getReportGenerationMetadataQuery.isError,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useApiData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useApiData must be used within an ApiDataProvider");
  }
  return context;
};
