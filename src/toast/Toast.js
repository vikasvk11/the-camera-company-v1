import "../styles.css";
import { useEffect, useState } from "react";
import { useToast } from "./ToastProvider.js";

export function Toast({ id, message }) {
  const [exit, setExit] = useState(false);
  const { toastDispatch } = useToast();

  let redBg = false;

  function redBgSet(message) {
    if (message === "Removed from Wishlist") {
      redBg = true;
    }
  }

  redBgSet(message);

  useEffect(() => {
    setTimeout(() => {
      setExit(true);
      setTimeout(
        () => toastDispatch({ type: "REMOVE_TOAST", payload: id }),
        400
      );
    }, 3000);
  }, []);

  function removeToast(id) {
    toastDispatch({ type: "REMOVE_TOAST", payload: id });
  }

  return (
    <div
      className={`toastr ${exit ? "toast-exit" : ""} ${
        redBg ? "toast-remove-wishlist" : ""
      }`}
    >
      <p>{message}</p>
      <span
        onClick={() => removeToast(id)}
        className="material-icons toastr-close"
      >
        close
      </span>
    </div>
  );
}
