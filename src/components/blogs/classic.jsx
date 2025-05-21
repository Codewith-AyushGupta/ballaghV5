import React, { useState, useEffect } from 'react';
import Helmet from 'react-helmet';
import { useLocation } from 'react-router-dom';

import ALink from '../utils/alink';
import Pagination from '../utils/pagination';

import BlogTemplateOne from './template/blog-template-one';
import { useApiData } from '../../service/api-data-provider';
import Spinner from '../utils/spinner/full-page-spinner';

function Classic() {
    const location = useLocation();
    const [perPage, setPerPage] = useState(3);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const page = searchParams.get('page');
        if (page) {
            setCurrentPage(parseInt(page));
        }
    }, [location.search]);

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

    const posts = blogPostMetadata?.post || [];
    const totalPage = Math.ceil(posts.length / perPage);
    const startIndex = (currentPage - 1) * perPage;
    const currentPosts = posts.slice(startIndex, startIndex + perPage);

    return (
        <main className="main skeleton-body">
            <Helmet>
                <title>{tenantConfiguration.REACT_APP_COMPANY_NAME} | Blog</title>
            </Helmet>
            <nav className="breadcrumb-nav">
                <div className="container">
                    <ul className="breadcrumb">
                        <li>
                            <ALink href="/">
                                <i className="d-icon-home"></i>
                            </ALink>
                        </li>
                        <li>
                            <ALink href="#" className="active">
                                Blog
                            </ALink>
                        </li>
                        <li>Classic</li>
                    </ul>
                </div>
            </nav>

            <div className="page-content with-sidebar">
                <div className="container">
                    <div className="row gutter-lg">
                        <div className="col-lg-12">
                            <div className="posts">
                                {currentPosts.length > 0 ? (
                                    currentPosts.map((post, index) => (
                                        <React.Fragment key={index}>
                                            <BlogTemplateOne post={post} />
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <div className="info-box with-icon">
                                        <p className="mt-4">No blogs were found matching your selection.</p>
                                    </div>
                                )}
                            </div>

                            <Pagination totalPage={totalPage} currentPage={currentPage} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Classic;