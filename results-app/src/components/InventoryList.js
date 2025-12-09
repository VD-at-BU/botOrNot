// located at: src/components/InventoryList.js
import React from "react";
import InventoryItem from "./InventoryItem";

function InventoryList({ items, onAddToCart }) {
  
  // If there are no items to show, render a simple message
  // instead of an empty grid
  if (!items.length) {
    return <p className="inventory-empty">Inventory is empty</p>;
  }

  return (
    <div className="inventory-list">
	  
	  {/*Map each item object into an InventoryItem card
      The `key` helps React update the list*/}
      {items.map((item) => (
        <InventoryItem
          key={item.id}
          item={item}
		  // Add an item to the cart when its button is clicked
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

export default InventoryList;
