// import { withRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import Helmet from 'react-helmet';
import BlogGridView from './template/grid-view';
import { useApiData } from '../../service/api-data-provider';
import Spinner from '../utils/spinner/full-page-spinner';
import OwlCarousel from '../owl-carousel/owl-carousel';
import { featuredSlider } from '../owl-carousel/data/carousel';
function BlogsGrid() {
    const {
        tenantConfiguration,
        tenantConfigurationLoading,
        tenantConfigurationIsError,
        blogPostMetadata,
        blogPostMetadataLoading,
        blogPostMetadataIsError
    } = useApiData();

    if (tenantConfigurationLoading || blogPostMetadataLoading) {
        return <Spinner />;
    }
    if (tenantConfigurationIsError || blogPostMetadataIsError) {
        return <div>Error loading data</div>;
    }
    const loading = false;
    const posts = blogPostMetadata && blogPostMetadata.post;
    return (
        <main className="main skeleton-body">
            <Helmet>
                <title>{tenantConfiguration.REACT_APP_COMPANY_NAME}| Home</title>
            </Helmet>
            <section className="mt-10 pt-3 mb-6">
                <h2 className="title title-simple title-center ls-m">Blogs</h2>
            </section>
            <h1 className="d-none"> - Blog Mask Grid</h1>
            <div className="page-content pb-10 mb-10">
                <div className="container">
                    <div className="">
                        {
                            loading ?
                                new Array(parseInt(4)).fill(1).map((item, index) => (
                                    <div key={"Skeleton:" + index}>
                                        <div className="skel-post"></div>
                                    </div>
                                )) :
                                posts ?
                                    posts.length ?
                                    <OwlCarousel adClass="owl-theme owl-nav-full"options={featuredSlider}>
                                            {posts.map((post, index) => (
                                                <div className="grid-item" key={"post-nine" + index}>
                                                    <BlogGridView post={post} adClass="" />
                                                </div>
                                            ))}
                                        </OwlCarousel>
                                        :
                                        <div className="info-box with-icon"><p className="mt-4">No blogs were found matching your selection.</p></div>
                                    : ''
                        }
                    </div>
                </div>
            </div>
        </main>
    )
}

export default BlogsGrid;