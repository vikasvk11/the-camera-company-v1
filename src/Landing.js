import { useNavigate } from "react-router-dom";
import "./landing.css";
import "./styles.css";

export function Landing() {
  const navigate = useNavigate();
  return (
    <div className="landing-container">
      <img
        onClick={() => navigate("/products")}
        className="banner"
        src="images\banner1.jpg"
        alt="banner"
      />
      <div onClick={() => navigate("/products")} className="image-card">
        <img className="landing-product" src="images\Nikon.jpeg" alt="cam" />
        <h2>Min 50% off</h2>
        <p>Mirrorless Cameras</p>
      </div>
      <div onClick={() => navigate("/products")} className="image-card">
        <img className="landing-product" src="images\canon.png" alt="cam" />
        <h2>Min 20% off</h2>
        <p>DSLR Cameras</p>
      </div>
      <img
        onClick={() => navigate("/products")}
        className="banner"
        src="images\banner2.jpg"
        alt="banner"
      />
      <div onClick={() => navigate("/products")} className="image-card">
        <img className="landing-product" src="images\djifpv.jpg" alt="cam" />
        <h2>New Launch</h2>
        <p>dji FPV</p>
      </div>
      <div onClick={() => navigate("/products")} className="image-card">
        <img className="landing-product" src="images\gopro.jpg" alt="cam" />
        <h2>Min 30% off</h2>
        <p>Action Cameras</p>
      </div>
    </div>
  );
}
