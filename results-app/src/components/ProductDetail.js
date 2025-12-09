// located at: src/components/ProductDetail.js

// ProductDetail renders a dedicated page for a single inventory item.
// It uses the SKU from the URL to find the matching product and then
// shows name, description, image, SKU, quantity, and price, plus an
// "Add to cart" button (wasn't required, it is an extra credit item) 
// and a "Home" link.

import React from 'react';
import { useParams, Link } from 'react-router-dom';

function ProductDetail({ items, onAddToCart }) {
  // Read the SKU from the route parameter, for example, product/BLB-001
  const { sku } = useParams();

  // Locate the product in the inventory array using the SKU
  const product = items.find((item) => item.sku === sku);

  // If no product is found (for example, if user types an invalid URL),
  // show a simple error message.
  if (!product) {
    return (
      <main className="product-detail">
        <h2 className="product-detail-title">Product Is Not Found</h2>
        <p className="product-detail-description">
          We could not find the product: {sku}
        </p>
        <Link to="/" className="product-detail-home-button">
          Home
        </Link>
      </main>
    );
  }

  // Construct the fields we want to display on the detail page
  const { name, description, qty, price, image } = product;

  // Delegate to the top-level cart logic from App.js, so adding an item
  // from the detail page keeps inventory and cart state in sync with the
  // handlers already used on the Inventory view
  
  const handleAddToCartClick = () => {
    if (onAddToCart && qty > 0) {
      onAddToCart(product);
    }
  };

  return (
    <main className="product-detail">
      <h1 className="product-detail-title">{name}</h1>

      {/* Short descriptive text pulled from JSON */}
      <p className="product-detail-description">{description}</p>

      {/* Larger product image than on the inventory cards */}
      {image && (
        <img
          src={process.env.PUBLIC_URL + '/images/' + image}
          alt={name}
          className="product-detail-image"
        />
      )}

      {/* Key inventory details mirror the deliverable screenshot:
          SKU, Quantity, and Price */}
      <div className="product-detail-meta">
        <p>
          <strong>SKU:</strong> {sku}
        </p>
        <p>
          <strong>Quantity:</strong> {qty}
        </p>
        <p>
          <strong>Price:</strong> ${price.toFixed(2)}
        </p>
      </div>

	  {/* Buttons: Add to cart (if in stock) and Home.
      Keeping both buttons here makes the product page actionable
      without forcing the user to return to the Inventory grid */}
	   
      <div className="product-detail-buttons">
        <button
          type="button"
          className="product-detail-add-button"
          onClick={handleAddToCartClick}
          disabled={qty === 0}
        >
          {qty === 0 ? 'Out of stock' : 'Add to cart'}
        </button>

        <Link to="/" className="product-detail-home-button">
          Home
        </Link>
      </div>
    </main>
  );
}

export default ProductDetail;
