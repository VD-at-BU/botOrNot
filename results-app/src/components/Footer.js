// located at: src/components/Footer.js
import React from 'react';

function Footer() {
	
  // Compute the current year once when the component renders
  // to keep the footer up to date without hard-coding a year
  const year = new Date().getFullYear();

  /* Navigation links for informational pages */
  return (
    <footer className="App-footer">
      <p>© {year} Green Basket Market</p>
      <p className="App-footer-links">
        About Us &nbsp;|&nbsp; Contact &nbsp;|&nbsp; Privacy Policy
      </p>
    </footer>
  );
}

export default Footer;
