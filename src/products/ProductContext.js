import { createContext, useReducer, useContext } from "react";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  function red(state, action) {
    switch (action.type) {
      case "sort":
        return { ...state, sort: action.payload };
      case "showAll":
        if (state.showAll === true) {
          return { ...state, showAll: false };
        } else return { ...state, showAll: true };
      case "showFD":
        if (state.showFD === true) {
          return { ...state, showFD: false };
        } else return { ...state, showFD: true };
      default:
        return state;
    }
  }

  const [productState, productDispatch] = useReducer(red, {
    sort: null,
    showFD: false,
    showAll: true
  });

  return (
    <ProductContext.Provider value={{ productState, productDispatch }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  return useContext(ProductContext);
}
