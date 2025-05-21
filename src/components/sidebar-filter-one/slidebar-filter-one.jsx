import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ALink from '../utils/alink';
import Card from '../utils/accordian/card';
import SlideToggle from 'react-slide-toggle';

function SidebarFilterOne(props) {
    const { collectionData, type = "left" } = props;
    const router = useLocation();
    const query = new URLSearchParams(router.search);
    const loading = false;
    let tmpPrice = { max: query.get('max_price') ? parseInt(query.get('max_price')) : 1000, min: query.get('min_price') ? parseInt(query.get('min_price')) : 0 };
    const [filterPrice, setPrice] = useState(tmpPrice);
    const [isFirst, setFirst] = useState(true);
    
    let timerId;

    useEffect(() => {
        window.addEventListener('resize', hideSidebar);
        return () => {
            window.removeEventListener('resize', hideSidebar);
        }
    }, [])

    useEffect(() => {
        setPrice({ max: query.get('max_price') ? parseInt(query.get('max_price')) : 1000, min: query.get('min_price') ? parseInt(query.get('min_price')) : 0 });
        if (isFirst) {
            setFirst(false);
        } else {
            //scrollTopHandler();
        }
    }, [])

    const filterByPrice = (e) => {
        e.preventDefault();
        let url = router.pathname.replace('[grid]', query.get('grid'));
        let arr = [`min_price=${filterPrice.min}`, `max_price=${filterPrice.max}`, 'page=1'];
        for (let key in query) {
            if (key !== 'min_price' && key !== 'max_price' && key !== 'page' && key !== 'grid') arr.push(key + '=' + query[key]);
        }
        url = url + '?' + arr.join('&');
        router.push(url);
    }

    const containsAttrInUrl = (type, value) => {
        const currentQueries = query[type] ? query[type].split(',') : [];
        return currentQueries && currentQueries.includes(value);
    }

    const getUrlForAttrs = (type, value) => {
        let currentQueries = query[type] ? query[type].split(',') : [];
        currentQueries = containsAttrInUrl(type, value) ? currentQueries.filter(item => item !== value) : [...currentQueries, value];
        return currentQueries.join(',');
    }

    const onChangePrice = value => {
        setPrice(value);
    }

    const toggleSidebar = e => {
        e.preventDefault();
        document.querySelector('body').classList.remove(`${type === "left" || type === "off-canvas" ? "sidebar-active" : "right-sidebar-active"}`);

        let stickyWraper = e.currentTarget.closest('.sticky-sidebar-wrapper');

        let mainContent = e.currentTarget.closest('.main-content-wrap');
        if (mainContent && type !== "off-canvas" && query.get('grid') !== '4cols')
            mainContent.querySelector('.row.product-wrapper') && mainContent.querySelector('.row.product-wrapper').classList.toggle('cols-md-4');

        if (mainContent && stickyWraper) {
            stickyWraper.classList.toggle('closed');

            if (stickyWraper.classList.contains('closed')) {
                mainContent.classList.add('overflow-hidden');
                clearTimeout(timerId);
            } else {
                timerId = setTimeout(() => {
                    mainContent.classList.remove('overflow-hidden');
                }, 500);
            }
        }
    }

    const showSidebar = (e) => {
        e.preventDefault();
        document.querySelector('body').classList.add("sidebar-active");
    }

    const hideSidebar = () => {
        document.querySelector('body').classList.remove(`${type === "left" || type === "off-canvas" || type === "boxed" || type === "banner" ? "sidebar-active" : "right-sidebar-active"}`);
    }

    // const filterDataProductData = (item) => {
    //     filteredData(item)
    // }

    return (
        <aside className={`col-lg-3 shop-sidebar skeleton-body ${type === "off-canvas" ? '' : "sidebar-fixed sticky-sidebar-wrapper"} ${type === "off-canvas" || type === "boxed" ? '' : "sidebar-toggle-remain"} ${type === "left" || type === "off-canvas" || type === "boxed" || type === "banner" ? "sidebar" : "right-sidebar"}`}>
            <div className="sidebar-overlay" onClick={hideSidebar}></div>
            {
                type === "boxed" || type === "banner" ? <a href="#" className="sidebar-toggle" onClick={showSidebar}><i className="fas fa-chevron-right"></i></a> : ''
            }
            <ALink className="sidebar-close" href="#" onClick={hideSidebar}><i className="d-icon-times"></i></ALink>

            <div className="sidebar-content">
                {
                    !loading  ?
                        <div className="sticky-sidebar">
                            {
                                type === "boxed" || type === "banner" ? '' :
                                    <div className="filter-actions mb-4">
                                        
                                        <a href="#" className="filter-clean" onClick={toggleSidebar}>Close</a>
                                    </div>
                            }
                            <div className="widget widget-collapsible">
                                <Card title="<h3 class='widget-title'>All Categories<span class='toggle-btn p-0 parse-content'></span></h3>" type="parse" expanded={true}>
                                    <ul className="widget-body filter-items search-ul">
                                        {collectionData &&
                                            Object.entries(collectionData).map(([key, value]) => (
                                                value.length > 0 ? (
                                                    <li key={key + ' - '}>
                                                        <SlideToggle collapsed={true}>
                                                            {({ onToggle, setCollapsibleElement, toggleState }) => (
                                                                <>
                                                                    <ALink href='#' className={'d-flex justify-content-between'} scroll={false}>{key}
                                                                        <i className={`fas fa-chevron-down ${toggleState.toLowerCase()}`} onClick={e => { onToggle(); e.stopPropagation(); e.preventDefault(); }}></i>
                                                                    </ALink>

                                                                    <div ref={setCollapsibleElement}>
                                                                        <div>
                                                                            <ul style={{ display: 'block' }}>
                                                                                {value.map((subItem, index) => (
                                                                                    <li
                                                                                        key={subItem.collectionName + ' - ' + index}
                                                                                        className={`with-ul ${subItem.collectionName === query.get('category') ? 'show' : ''}`}
                                                                                    >
                                                                                        <ALink scroll={false} href={`/collections/${subItem.collectionSlug}`}>
                                                                                            {subItem.collectionName}
                                                                                        </ALink>
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </SlideToggle>
                                                    </li>
                                                ) : (
                                                    <li key={key + ' - '}>
                                                        <SlideToggle collapsed={true}>
                                                            {({ onToggle, setCollapsibleElement, toggleState }) => (
                                                                <>
                                                                    <ALink href='#' className={'d-flex justify-content-between'} scroll={false}>{key}
                                                                        <i className={`fas fa-chevron-down ${toggleState.toLowerCase()}`} onClick={e => { onToggle(); e.stopPropagation(); e.preventDefault(); }}></i>
                                                                    </ALink>

                                                                    <div ref={setCollapsibleElement}>
                                                                        <div>
                                                                            <ul style={{ display: 'block' }}>
                                                                                <li className="no-collection">
                                                                                    No collection exist
                                                                                </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </SlideToggle>
                                                    </li>
                                                )
                                            ))
                                        }
                                    </ul>

                                </Card>

                            </div>
                        </div>
                        : <div className="widget-2 mt-10 pt-5"></div>
                }
            </div>
        </aside >
    )
}

export default SidebarFilterOne;

