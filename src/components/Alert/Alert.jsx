import cl from "./Alert.module.css";
import React, { useEffect } from "react";

export default function Alert({ alertText, setAlertText, type = 'notyfy' }) {

  const closeAlert = () => {
    setAlertText('');
  };

  useEffect(() => {
    if (alertText) {
      const timer = setTimeout(closeAlert, 4000);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [alertText]);

  return (
    alertText && (
      <div className={`${cl.alert} ${type === 'error' ? cl.alert_error : cl.alert_notify}`} >
        {alertText}
        <span className={cl.closebtn} onClick={closeAlert}>
          &times;
        </span>
      </div>
    )
  );
}