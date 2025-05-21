import React from 'react'
import ALink from '../../utils/alink';
function SinglePropertyTabView(props) {
    const { Pathname, HeaderMenuItem } = props;
    return (
        <li id="menu-home" className={Pathname === HeaderMenuItem.url ? 'active' : ''}>
            <ALink href={HeaderMenuItem.url}>{HeaderMenuItem.label}</ALink>
        </li>
    )
}
export default SinglePropertyTabView
