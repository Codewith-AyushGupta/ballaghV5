import React from 'react';
import { useLocation } from 'react-router-dom';
import ALink from './alink';

function Pagination({ totalPage, currentPage }) {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const buildLink = (pageNum) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', pageNum);
        return `${location.pathname}?${newParams.toString()}`;
    };

    return (
        <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <ALink className="page-link page-link-prev" href={currentPage > 1 ? buildLink(currentPage - 1) : '#'}>
                    <i className="d-icon-arrow-left"></i>Prev
                </ALink>
            </li>

            {Array.from({ length: totalPage }).map((_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                    <ALink className="page-link" href={buildLink(index + 1)}>
                        {index + 1}
                    </ALink>
                </li>
            ))}

            <li className={`page-item ${currentPage === totalPage ? 'disabled' : ''}`}>
                <ALink className="page-link page-link-next" href={currentPage < totalPage ? buildLink(currentPage + 1) : '#'}>
                    Next<i className="d-icon-arrow-right"></i>
                </ALink>
            </li>
        </ul>
    );
}

export default React.memo(Pagination);