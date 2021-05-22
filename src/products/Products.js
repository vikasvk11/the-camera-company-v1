import React, { useEffect, useReducer, useState } from "react";
import "../styles.css";
import { useProduct } from "./ProductContext";
import axios from "axios";
import { Loader } from "../Components/Loader";
import { ProductCard } from "../Components/ProductCard";
import { FilterSort } from "../Components/FilterSort";



export function Products() {

  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(false);
  const [apiData, setApiData] = useState([]);


  function sortData(products, productState) {
    if (productState.sort === "high_to_low") {
      return products.sort((a, b) => b.price - a.price);
    }
    if (productState.sort === "low_to_high") {
      return products.sort((a, b) => a.price - b.price);
    }
    return products;
  }

  function filterData(products, productState) {
    return products
      .filter((item) => (productState.showFD ? item.fastDelivery : true))
      .filter((item) => (productState.showAll ? true : item.inStock));
  }

  useEffect(() => {
    async function getData() {
      setLoader(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BE_URL}products`
        );

        setApiData(res.data.products);
      } catch (err) {
        setError(true);
        console.log(err);
      } finally {
        setLoader(false);
      }
    }
    getData();
  }, []);

  const { productState, productDispatch } = useProduct();

  const sortedData = sortData(apiData, productState);
  const filteredData = filterData(sortedData, productState);

  return (
    <>
    {loader && (
        <Loader />
      )}
      <h1 className="mg-1 product-header mg-t-5"> Products </h1>

      <div className="App products-container">
        {filteredData.map(
          ({
            _id,
            name,
            image,
            price,
            productName,
            inStock,
            fastDelivery,
            ratings
          }) => (
            <>
              <ProductCard 
              key={_id} 
              _id={_id} 
              name={name} 
              image={image} 
              price={price} 
              productName={productName} 
              inStock={inStock} 
              fastDelivery={fastDelivery}
              ratings={ratings}
              />
            </>
          )
        )}
      </div>

      <FilterSort />
    </>
  );
}
