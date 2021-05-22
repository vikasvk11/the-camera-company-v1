import React, { StrictMode } from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { CartProvider } from "./cart/CartContext";
import { ProductProvider } from "./products/ProductContext";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastProvider } from "./toast/ToastProvider";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <ToastProvider>
      <CartProvider>
        <ProductProvider>
          <Router>
            <App />
          </Router>
        </ProductProvider>
      </CartProvider>
    </ToastProvider>
  </StrictMode>,
  rootElement
);
