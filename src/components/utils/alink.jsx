import React from "react";
export default function ALink({ children, className, content, style, href, onClick ,...props}) {

    const preventDefault = (e) => {
        if (href === '#') {
            e.preventDefault();
        }

        if (onClick) {
            onClick();
        }
    }

    return (
        <a  className={className} style={style} onClick={preventDefault} href={href}>
            {children}
        </a>
    )
}
