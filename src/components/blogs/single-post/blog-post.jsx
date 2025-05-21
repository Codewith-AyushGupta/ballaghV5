import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Helmet from 'react-helmet';

import ALink from "../../utils/alink";
import OwlCarousel from '../../owl-carousel/owl-carousel';
import Error404 from "../../../pages/Error404";

import { mainSlider20 } from '../../owl-carousel/data/carousel';
import { videoHandler } from '../../utils';
import { useApiData } from "../../../service/api-data-provider";
import Spinner from "../../utils/spinner/full-page-spinner";
function BlogPost() {
    const { blogSlug } = useParams();
    const [post, setPost] = useState(null);
    const {
        tenantConfiguration,
        tenantConfigurationLoading,
        tenantConfigurationIsError,

        blogPostMetadata,
        blogPostMetadataLoading,
        blogPostMetadataIsError

    } = useApiData();
    useEffect(() => {
        if (!blogPostMetadataLoading) {
            const foundPost = blogPostMetadata.post.find(post => post.slug === blogSlug);
            setPost(foundPost);
        }

    }, [blogSlug, blogPostMetadataLoading]);
    if (tenantConfigurationLoading || blogPostMetadataLoading) {
        return <Spinner />;
    }

    if (tenantConfigurationIsError || blogPostMetadataIsError) {
        return <div>Error loading data</div>;
    }
    const loading = !post;
    const error = !post && blogSlug;


    if (error) return <Error404 />;

    return (
        <main className="main skeleton-body">
            <Helmet>
                <title>{tenantConfiguration.REACT_APP_COMPANY_NAME} | Blog Single</title>
            </Helmet>

            <h1 className="d-none"> - Blog Single</h1>

            <nav className="breadcrumb-nav">
                <div className="container">
                    <ul className="breadcrumb">
                        <li><ALink href="/"><i className="d-icon-home"></i></ALink></li>
                        <li><ALink href="/blogs/all" className="active">Blog</ALink></li>
                        <li>Single Post</li>
                    </ul>
                </div>
            </nav>

            <div className="page-content with-sidebar">
                <div className="container">
                    <div className="row gutter-lg">
                        <div className="col-lg-12">
                            {
                                loading ?
                                    <div className="skel-post"></div>
                                    :
                                    <div className={`post post-single ${post.type === 'video' ? 'post-video' : ''}`}>
                                        {
                                            post.type === 'image' || post.type === 'video' ?
                                                <figure className="post-media">
                                                    <ALink href="#">
                                                        <LazyLoadImage
                                                            src={post.pictures[0].url}
                                                            alt="post image"
                                                            width="900"
                                                            height={500}
                                                            style={{ backgroundColor: "#DEE6E8" }}
                                                        />
                                                    </ALink>
                                                    {
                                                        post.type === 'video' ?
                                                            <>
                                                                <span className="video-play" onClick={videoHandler}></span>
                                                                <video width="380">
                                                                    <source src={post.video.url} type="video/mp4" />
                                                                </video>
                                                            </>
                                                            : ''
                                                    }
                                                </figure> :
                                                <figure className="post-media">
                                                    <OwlCarousel adClass="owl-theme owl-dot-inner owl-dot-white gutter-no" options={mainSlider20}>
                                                        {
                                                            post.pictures.map((item, index) =>
                                                                <img
                                                                    src={item.url}
                                                                    alt="post gallery"
                                                                    key={item.url + '-' + index}
                                                                    width={item.width}
                                                                    height={item.height}
                                                                    style={{ backgroundColor: "#DEE6E8" }}
                                                                />
                                                            )}
                                                    </OwlCarousel>
                                                </figure>
                                        }

                                        <div className="post-details">
                                            <div className="post-meta">
                                                by <ALink href="#" className="post-author">{post.author.name}</ALink> on <ALink href="#" className="post-date">{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: "2-digit", timeZone: "UTC" })}</ALink>
                                            </div>
                                            <h4 className="post-title">
                                                <ALink href="#">{post.title}</ALink>
                                            </h4>
                                            <div className="post-body mb-7">
                                                <p className="mb-5">{post.content}</p>

                                                {post.additionalContent.map((content, index) => (
                                                    <div key={index}>
                                                        <h4 className="font-weight-semi-bold ls-s">{content.title}</h4>
                                                        <p className="mb-8 col-lg-11">{content.description}</p>
                                                        <ul className="list list-type-check mb-6">
                                                            {content.details.map((detail, idx) => (
                                                                <li key={idx}>{detail}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}

                                                <blockquote className="mt-1 mb-6 p-relative">
                                                    <p className="font-weight-semi-bold ls-m">{post.quote.text}</p>
                                                </blockquote>

                                                <p>{post.additionalParagraph} </p>
                                            </div>
                                            <div className="post-footer mt-7 mb-3">
                                                <div className="social-icons">
                                                    <ALink href="#" className="social-icon social-facebook" title="Facebook"><i className="fab fa-facebook-f"></i></ALink>
                                                    <ALink href="#" className="social-icon social-twitter" title="Twitter"><i className="fab fa-twitter"></i></ALink>
                                                    <ALink href="#" className="social-icon social-pinterest" title="Pinterest"><i className="fab fa-pinterest-p"></i></ALink>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default BlogPost;