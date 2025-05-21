import React, { useEffect } from 'react'
import ALink from '../../utils/alink';
function FourColumnImageTabView(props) {
    const { Pathname, HeaderMenuItem } = props;
    return (
        <li className={`submenu  ${Pathname.includes(HeaderMenuItem.url) ? 'active' : ''}`}>
            <ALink href={HeaderMenuItem.url}>{HeaderMenuItem.label}</ALink>

            <div className="megamenu">
                <div className="row">
                    {
                        Object.entries(HeaderMenuItem.subItems).map(([subMenuHeading, subMenuEntries]) => (
                            <div className="col-6 col-sm-4 col-md-3 col-lg-3">
                                <h4 className="menu-title">{subMenuHeading}</h4>
                                {subMenuEntries.map((subMenuEntry, index) => (
                                    <ul>
                                        <li key={index}>
                                            <ALink href={'/' + subMenuEntry.url}>
                                                {subMenuEntry.title}
                                                {subMenuEntry.new ? <span className="tip tip-new">New</span> : ""}
                                            </ALink>
                                        </li>
                                    </ul>
                                ))}
                            </div>
                        ))

                    }
                    <div className="col-6 col-sm-4 col-md-3 col-lg-3 menu-banner menu-banner2 banner banner-fixed">
                        <figure>
                            <img src={HeaderMenuItem.image.url} alt="Menu banner" width={HeaderMenuItem.image.width} height={HeaderMenuItem.image.height} />
                        </figure>
                        <div className="banner-content x-50 text-center">
                            <h3 className="banner-title text-white text-uppercase">Sunglasses</h3>
                            <h4 className="banner-subtitle font-weight-bold text-white mb-0">$23.00 - $120.00</h4>
                        </div>
                    </div>
                </div>
            </div>
        </li>

    )
}

export default FourColumnImageTabView
