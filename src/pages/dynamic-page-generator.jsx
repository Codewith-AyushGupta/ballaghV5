import React from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/utils/spinner/full-page-spinner";
import { useApiData } from "../service/api-data-provider";

import IntroSection from "../components/modals/intro-section";
import AdvertisementCard from "../components/modals/advertisement-card";
import CategorySection from "../components/modals/category-section";
import ServiceBox from "../components/modals/service-box";
import ProductGridView from "../components/product-view/product-grid-view";
import NewsletterModal from "../components/modals/news-letter-modal";
import PromoSection from "../components/modals/promo-section";
import Error404 from "./Error404";

function DynamicPageGenerator() {
    const { pageSlug } = useParams();
    const {
        dynamicPagesMetadataIndex,
        dynamicPagesMetadataIndexLoading,
        dynamicPagesMetadataIndexIsError,
    } = useApiData();

    const componentsMap = {
        IntroSection,
        AdvertisementCard,
        CategorySection,
        ServiceBox,
        ProductGridView,
        NewsletterModal,
        PromoSection,
    };

    if (dynamicPagesMetadataIndexLoading) {
        return <Spinner />;
    }

    if (dynamicPagesMetadataIndexIsError) {
        return <div>Error loading page data. Please try again later.</div>;
    }
    const pageConfig = dynamicPagesMetadataIndex[pageSlug];
    if (!pageConfig || pageSlug.length<0|| pageSlug.length === undefined) {
        return <Error404 />;
    }

    return (
        <div className="main home demo2-cls">
            <div className="page-content">
                <div className="container">
                    {pageConfig.map((item, index) => {
                        const Component = componentsMap[item.component];
                        if (!Component) {
                            console.warn(`Component "${item.component}" not found.`);
                            return null;
                        }
                        return <Component key={index} {...item.props} />;
                    })}
                </div>
            </div>
        </div>
    );
}

export default DynamicPageGenerator;
