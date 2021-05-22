import { createContext, useContext, useReducer } from "react";
import "../styles.css";
import { Toast } from "./Toast.js";
import { v4 } from "uuid";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  function toastRed(state, action) {
    switch (action.type) {
      case "TO_CART":
        return [...state, { id: v4(), message: "Added to Cart" }];
      case "TO_WISHLIST":
        return [...state, { id: v4(), message: "Added to Wishlist" }];
      case "REMOVE_WISHLIST":
        return [...state, { id: v4(), message: "Removed from Wishlist" }];
      case "REMOVE_TOAST":
        return state.filter((toast) => toast.id !== action.payload);

      default:
        return state;
    }
  }

  const [toastState, toastDispatch] = useReducer(toastRed, []);

  return (
    <ToastContext.Provider value={{ toastDispatch }}>
      <div className="toast-container">
        {toastState.map((item) => (
          <Toast key={item.id} {...item} />
        ))}
      </div>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
