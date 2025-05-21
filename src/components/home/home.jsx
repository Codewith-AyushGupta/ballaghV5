import React, { useEffect, useState } from "react";
import ProductGridView from "../product-view/product-grid-view";
import { Helmet } from "react-helmet";
import Spinner from "../utils/spinner/full-page-spinner";
import NewsletterModal from "../modals/news-letter-modal";
import IntroSection from "../modals/intro-section";
import AdvertisementCard from "../modals/advertisement-card";
import CategorySection from "../modals/category-section";
import ServiceBox from "../modals/service-box";
import PromoSection from "../modals/promo-section";
import BlogsGrid from "../blogs/blog-grid";
import { useApiData } from '../../service/api-data-provider';

function Home() {
  const { 
    tenantConfiguration, 
    tenantConfigurationLoading, 
    tenantConfigurationIsError,

    homePageComponentsConfiguration,
    homePageComponentsConfigurationLoading,
    homePageComponentsConfigurationIsError
  } = useApiData();

  const componentsMap = {
    IntroSection,
    AdvertisementCard,
    CategorySection,
    ServiceBox,
    BlogsGrid,
    ProductGridView
  };
  if (tenantConfigurationLoading || homePageComponentsConfigurationLoading) {
    return <Spinner />;
  }

  if (tenantConfigurationIsError || homePageComponentsConfigurationIsError) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="main home demo2-cls">
      <Helmet>
        <title>{tenantConfiguration.REACT_APP_COMPANY_NAME} - Home</title>
      </Helmet>
      <div className="page-content">
        <div className="container">
          {homePageComponentsConfiguration.map((item, index) => {
            const Component = componentsMap[item.component];
            if (!Component) {
              console.warn(`Component ${item.component} not found.`);
              return null;
            }
            return <Component key={index} {...item.props} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default Home;
