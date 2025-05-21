import React from "react";
const SuccessPopupNotification = React.memo(function SuccessMessagePopupNotification(props) {
  const { data } = props;
  return (
    <div className="minipopup-area" style={{ position: 'fixed' }}>
      <div className="minipopup-box show" style={{ top: "0" }}>
        <p className={`minipopup-title minipopup-title  mb-0`} >{data.header.heading}</p>      
        <hr/>  
        <p >{data.body.message}</p>        
      </div>
    </div>
  );
});

export default SuccessPopupNotification;


