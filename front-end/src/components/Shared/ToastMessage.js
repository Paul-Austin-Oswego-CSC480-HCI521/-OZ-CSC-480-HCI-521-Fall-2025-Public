import React, { useEffect } from "react";

function ToastMessage({ message, type = "info", duration = 3000, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor =
    type === "success"
      ? "green"
      : type === "error"
      ? "red"
      : type === "warning"
      ? "orange"
      : "gray";

  return (
    <div
      className="toast-message"
      style={{
        position: "fixed",
        bottom: "1rem",
        right: "1rem",
        backgroundColor: bgColor,
        color: "white",
        padding: "0.75rem 1.25rem",
        borderRadius: "5px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
        zIndex: 1000,
      }}
    >
      {message}
    </div>
  );
}

export default ToastMessage;
