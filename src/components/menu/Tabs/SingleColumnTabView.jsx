import React from 'react'
import { useLocation } from 'react-router-dom';
import ALink from '../../utils/alink';
function SingleColumnTabView(props) {
  const { HeaderMenuItem } = props;
  const Pathname = useLocation().pathname;
  return (
    <li className={`submenu ${Pathname.includes(HeaderMenuItem.url) ? 'active' : ''}`}>
      <ALink href={HeaderMenuItem.url}>{HeaderMenuItem.label}</ALink>
      <ul>
        {
          HeaderMenuItem.subItems.map((subMenuEntry, index) => (
            <li key={`${subMenuEntry.title}-${index}`}>
              <ALink href={`/${subMenuEntry.url}`}>{subMenuEntry.title}</ALink>
            </li>
          ))
        } 
      </ul>
    </li>

  )
}

export default SingleColumnTabView
