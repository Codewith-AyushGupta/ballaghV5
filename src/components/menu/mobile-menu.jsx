import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ALink from '../utils/alink';
import Card from '..//utils/accordian/card'
import HomeSearchbox from '../search/home-searchbox';
import { useApiData } from '../../service/api-data-provider';

function MobileMenu(props) {
      const {
        tenantConfiguration,
        tenantConfigurationLoading,
        tenantConfigurationIsError,
      } = useApiData();
    const [search, setSearch] = useState("");
    const router = useLocation();
    const hideMobileMenuHandler = () => {
        if (window.innerWidth > 991) {
            document.querySelector('body').classList.remove('mmenu-active');
        }
    };

    const hideMobileMenu = () => {
        document.querySelector('body').classList.remove('mmenu-active');
    };

    function onSearchChange(e) {
        setSearch(e.target.value);
    }

    function onBodyClick(e) {
        if (e.target.closest('.header-search')) {
            e.target.closest('.header-search').classList.add('show-results');
            return;
        }

        document.querySelector('.header-search.show')?.classList.remove('show');
        document.querySelector('.header-search.show-results')?.classList.remove('show-results');
    }

    function onSubmitSearchForm(e) {
        e.preventDefault();
        router.push({
            pathname: '/shop',
            query: {
                search: search,
            },
        });
    }
    const [isHovered, setIsHovered] = useState(false);


    const handleMouseEnter = () => {
        setIsHovered(true); // Set hover state to true
    };

    const handleMouseLeave = () => {
        setIsHovered(false); // Set hover state to false
    };
    if (tenantConfigurationLoading ) {
        return '';
      }
      if (tenantConfigurationIsError) {
        return '';
      }
    return (
        <div className="mobile-menu-wrapper">
            <div className="mobile-menu-overlay" onClick={hideMobileMenu}></div>

            <ALink className="mobile-menu-close" href="#" onClick={hideMobileMenu}>
                <i className="d-icon-times"></i>
            </ALink>
            <div className="mobile-menu-container scrollable">
                {tenantConfiguration.REACT_APP_HEADER_SRC_IS_SEARCH_BAR_VISIBLE?<HomeSearchbox SearchBarForMobile={true} />:null}
                <ul className="mobile-menu mmenu-anim">
                    {Object.values(props).length > 0 ? (
                        Object.values(props).map((singleItem, index) =>
                            singleItem.isActive ?
                                singleItem.tabType === "SinglePropertyTabView" ? (
                                    <li key={index} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} >
                                        <ALink href={singleItem.url}>{singleItem.label}</ALink>
                                    </li>
                                ) : (
                                    <li>
                                        <Card key={index} title={singleItem.label} type="mobile" >
                                            <ul>
                                                {Array.isArray(singleItem.subItems) && singleItem.subItems.length > 0 ? (
                                                    singleItem.subItems.map((singleSubItem, subIndex) => (
                                                        <li key={`${singleSubItem.title}-${subIndex}`}>
                                                            <ALink href={`/${singleSubItem.url}`}>
                                                                {singleSubItem.title}
                                                            </ALink>
                                                        </li>
                                                    ))
                                                ) : (
                                                    null
                                                )}
                                            </ul>
                                        </Card>
                                    </li>
                                ) : null
                        )
                    ) : (
                        null
                    )}
                </ul>
            </div>
        </div>
    );
}

export default React.memo(MobileMenu);
