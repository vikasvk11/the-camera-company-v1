import { useCart } from "../cart/CartContext";
import { NavLink, Route, Routes } from "react-router-dom";
import axios from "axios";

export function Wishlist() {
  const { cartState, cartDispatch } = useCart();

  async function removeFromWishlistHandler({ type, payload }) {
    try {
      const res = await axios.delete(
        `https://theccbackend.vikasvk1997.repl.co/wishlist/${payload._id}`
      );

      cartDispatch({ type, payload });
    } catch (err) {
      console.log(err);
    }
  }

  async function moveToCartClickHandler({ type, payload }) {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BE_URL}cart`,
        {
          productId: payload._id,
          quantity: 1
        }
      );
      const res1 = await axios.delete(
        `${process.env.REACT_APP_BE_URL}wishlist/${payload._id}`
      );
      cartDispatch({ type, payload });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      {cartState.wishlist.length === 0 ? (
        <div className="cart-container empty">
          <h1>What do you wish for? We have it all . . .</h1>
          <img className="empty-cart-img" src="images\cart-icon-v3.png" alt="logo" />
          <button className="btn-primary">
            <NavLink to="/products">Shop Now</NavLink>
          </button>
        </div>
      ) : (
        <div className="wishlist-container">
          <h1 className="cart-header">
            My Wishlist ({cartState.wishlist.length})
          </h1>
          {cartState.wishlist.map(
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
              <div className="product-card" key={_id}>
                <img src={image} alt={productName} />
                <p className="card-title"> {name} </p>
                <p className="product-price">&#8377; {price}</p>
                {inStock && (
                  <div style={{ fontSize: "0.8rem", paddingLeft: "0.5rem" }}>
                    {" "}
                    In Stock{" "}
                  </div>
                )}
                {!inStock && (
                  <div
                    style={{
                      color: "grey",
                      fontSize: "0.8rem",
                      paddingLeft: "0.5rem"
                    }}
                  >
                    {" "}
                    Out of Stock{" "}
                  </div>
                )}
                <p className="product-rating">
                  {ratings}
                  <span className="material-icons">grade</span>
                </p>
                <span
                  onClick={() =>
                    removeFromWishlistHandler({
                      type: "REMOVE_WISHLIST",
                      payload: { _id }
                    })
                  }
                  className="material-icons wishlist-badge delete-badge"
                >
                  delete
                </span>
                {fastDelivery ? (
                  <div style={{ fontSize: "0.8rem", paddingLeft: "0.5rem" }}>
                    {" "}
                    Fast Delivery{" "}
                  </div>
                ) : (
                  <div style={{ fontSize: "0.8rem", paddingLeft: "0.5rem" }}>
                    {" "}
                    3 days minimum{" "}
                  </div>
                )}
                {cartState.cart.find((item) => _id === item._id) ? (
                  <button className="btn-primary mg-1 mg-a-1">
                    <NavLink to="/cart">
                      GO TO CART
                      <span className="material-icons af" style={{fontSize: "0.6rem"}}> 
                        arrow_forward_ios
                      </span>
                    </NavLink>
                  </button>
                ) : (
                  <button
                    className="btn-primary mg-a-1"
                    disabled={inStock ? false : true}
                    onClick={() =>
                      moveToCartClickHandler({
                        type: "MOVE_TO_CART",
                        payload: {
                          _id,
                          name,
                          image,
                          price,
                          productName,
                          inStock,
                          fastDelivery,
                          ratings
                        }
                      })
                    }
                  >
                    MOVE TO CART
                  </button>
                )}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
