// located at: src/components/Header.js
import React from 'react';
import logo from '../logo.svg';

function Header() {
  return (
    // Top-level header area for the application
    <div className="app-header">
	  {/* Brand logo for the application */}
      <img
        src={logo}
        className="app-logo"
        alt="Green Basket Market logo"
      />
      <div className="app-header-text">
        <h1 className="app-title">Green Basket Market</h1>
        <p className="app-subtitle">Inventory Management Application</p>
      </div>
    </div>
  );
}

export default Header;
