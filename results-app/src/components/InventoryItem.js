// located at: src/components/InventoryItem.js
import React from 'react';
import { Link } from 'react-router-dom';

function InventoryItem({ item, onAddToCart }) {
  // Core fields for each inventory record and the product image filename
  const { sku, name, qty, price, image } = item;
  
  // Reuse this flag to avoid repeating the qty === 0 check in JSX
  const outOfStock = qty === 0;

  return (
    <div className="inventory-item">
	  {/* Optional product icon that appears in the top-right corner
      when the user hovers over the inventory card */}
      {image && (
        <img
          src={process.env.PUBLIC_URL + '/images/' + image}
          alt={name}
          className="inventory-item-icon"
        />
      )}


	  {/* Entire text block is clickable and routes to the detail page
      for the selected SKU, where the user can see the description
      and a larger product image */}
		 
      <Link to={`/product/${sku}`} className="inventory-item-link">
        <div className="inventory-item-main">
          <p className="inventory-item-sku">SKU: {sku}</p>
          <p className="inventory-item-name">Name: {name}</p>
          <p className="inventory-item-qty">
            Quantity:{' '}
			{/* Highlight zero-stock items in red to make them easier to spot */}
            <span className={outOfStock ? 'low-stock' : ''}>{qty}</span>
          </p>
          <p className="inventory-item-price">
            Price: ${price.toFixed(2)}
          </p>
        </div>
      </Link>
	  
	  {/* Primary call-to-action on the card: add one unit of this product
      to the cart and reduce the visible inventory for this SKU */}
      <button
        className="inventory-item-add"
        disabled={outOfStock}
        onClick={() => onAddToCart(item)}
      >
        {outOfStock ? 'Out of stock' : 'Add to cart'}
      </button>
    </div>
  );
}

export default InventoryItem;

