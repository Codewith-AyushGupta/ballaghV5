import React, { useEffect, useState } from "react";

export default function CookieConsentBanner(props) {
  const {cookieName, cookieAcceptanceExpirationDays, cookieRejectionExpirationDays,consentHeading, consentDescription} = props;
  const [isCookieConsentDisplayed, setIsCookieConsentDisplayed] = useState(false);
  useEffect(() => {
    checkConsignedCookieExistOrNot();
  }, []);

  const checkConsignedCookieExistOrNot = () => {
    const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
      const [name, value] = cookie.split("=");
      acc[name] = value;
      return acc;
    }, {});
    if (!cookies[cookieName]) {
      setIsCookieConsentDisplayed(true);
    }
  };

  const setCookie = (name, value, days) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  };

  const handleConsentAccept = () => {
    setCookie(cookieName, 'true', cookieAcceptanceExpirationDays);
    setIsCookieConsentDisplayed(false);
  };

  const handleConsentReject = () => {
    setCookie(cookieName, 'false', cookieRejectionExpirationDays);
    setIsCookieConsentDisplayed(false);
  };

  if (!isCookieConsentDisplayed) return null;

  return (
    <div className="minipopup-area" style={{ position: 'fixed', bottom: '10px' }}>
      <div className="minipopup-box show" style={{ padding: '20px', background: '#fff', borderTop: '1px solid #ddd' }}>
        <p className="minipopup-title">
          {consentHeading}
        </p>
        <div className="product product-purchased product-cart mb-0">
          <p>{consentDescription}</p>
        </div>
        <div className="action-group d-flex">
          <button
            onClick={handleConsentAccept}
            className="btn btn-sm btn-primary btn-rounded mr-3"
          >
            Accept
          </button>
          <button
            onClick={handleConsentReject}
            className="btn btn-sm btn-outline btn-primary btn-rounded"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
