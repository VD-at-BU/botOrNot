// located at: src/components/CartSummary.js
import React from 'react';


/*
  CartSummary domponent displays all cart-related information in the right-hand panel:
    • Total number of cart items across all SKUs
    • Total price of all cart contents
    • A list of cart rows, each showing:
         – Item name
         – Item SKU
         – Quantity currently in the cart
         – Line total (quantity multiplied by unit price)
         – Controls for decreasing and increasing quantity or removing the item from cart
*/

function CartSummary({cartItems, totalItems, totalPrice, onDecreaseItem, onRemoveItem, onIncreaseItem}) {
  
  return (
    <aside className="cart-summary">
      <h3 className="cart-summary-title">Cart Summary</h3>

      <div className="cart-summary-totals">
        <div>
          Items in cart: <strong>{totalItems}</strong>
        </div>
        <div>
          Total price:{' '}
          <strong>${totalPrice.toFixed(2)}</strong>
        </div>
      </div>

      {/* When no items are present, show a message */}
      {cartItems.length === 0 ? (
        <p className="cart-summary-empty">Your cart is empty.</p>
      ) : (
        <ul className="cart-summary-list">
		  {/* Render each cart row as a separate list item */}
          {cartItems.map((item) => (
            <li key={item.sku} className="cart-summary-row">
			  {/* Top left block: name, SKU, quantity, and line total */}
              <div className="cart-summary-row-main">
			    {/* Display product name */}
                <div className="cart-summary-row-name">{item.name}</div>
                {/* Display SKU and quantity */}
				<div className="cart-summary-row-meta">
                  SKU: {item.sku} &nbsp;|&nbsp; Qty: {item.quantity}
                </div>
				{/* Row total: quantity * unit price */}
                <div className="cart-summary-row-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
			  {/* Top Right block: user controls for adjusting quantity */}
              <div className="cart-summary-row-actions">
                {/* Decrease quantity by one */}
				<button
                  type="button"
                  className="cart-action cart-action-secondary"
                  onClick={() => onDecreaseItem(item.sku)}
                >
                  −
                </button>
				{/* Remove all these items from the cart */}
                <button
                  type="button"
                  className="cart-action cart-action-danger"
                  onClick={() => onRemoveItem(item.sku)}
                >
                  Remove
                </button>
				{/* Increase quantity by one */}
			    <button
				  type="button"
				  className="cart-qty-button"
				  onClick={() => onIncreaseItem(item.sku)}
			    >
				  +
			    </button>		
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

export default CartSummary;
