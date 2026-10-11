
import { useEffect, useRef, useState } from "react";
import "./GlobalToast.css";

function GlobalToast() {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const showSavedToast = () => {
      const savedToast = sessionStorage.getItem("nexoraToast");

      if (!savedToast) {
        return;
      }

      try {
        const toastData = JSON.parse(savedToast);

        // Remove the saved message so it does not appear again.
        sessionStorage.removeItem("nexoraToast");

        // Clear the previous timer, if any.
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        setToast(toastData);

        // Hide the toast after 3 seconds.
        timerRef.current = setTimeout(() => {
          setToast(null);
          timerRef.current = null;
        }, 3000);
      } catch (error) {
        sessionStorage.removeItem("nexoraToast");
        console.error("Unable to display toast:", error);
      }
    };

    showSavedToast();

    window.addEventListener("nexora-toast", showSavedToast);

    return () => {
      window.removeEventListener("nexora-toast", showSavedToast);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  if (!toast) {
    return null;
  }

  return (
    <div
      className={`nexora-global-toast ${toast.type || "success"}`}
      role="status"
      aria-live="polite"
    >
      <span className="toast-check">
        {toast.type === "error" ? "!" : "✓"}
      </span>

      <span>{toast.message}</span>
    </div>
  );
}

export default GlobalToast;