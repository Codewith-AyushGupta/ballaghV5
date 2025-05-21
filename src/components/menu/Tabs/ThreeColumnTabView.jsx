import React from 'react'
import ALink from '../../utils/alink';
function ThreeColumnTabView(props) {
    const { Pathname, HeaderMenuItem } = props;
    return (
        <li className={`submenu  ${Pathname.includes(HeaderMenuItem.url) ? 'active' : ''}`}>
            <ALink href={HeaderMenuItem.url}>{HeaderMenuItem.label}</ALink>

            <div className="megamenu">
                <div className="row">
                    {
                        Object.entries(HeaderMenuItem.subItems).map(([subMenuHeading, subMenuEntries]) => (
                            <div className="col-6 col-sm-4 col-md-3 col-lg-4">
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
                </div>
            </div>
        </li>

    )
}

export default ThreeColumnTabView
