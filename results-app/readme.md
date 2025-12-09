What this code does: implements the enhanced Inventory Management Application for the 
Green Basket Market local grocery store using React.  This version adds 'dynamic routing' 
and 'dedicated detail pages' for each product, while preserving the original layout, 
cart logic, and visual style.

The home page (Inventory) shows the store name, logo, and a dynamically rendered list of 
products  from a JSON file. Each card displays SKU, Name, Quantity, and Price.  Each product 
card is now clickable and navigates to a detail page using React Router. The cart summary 
on the right tracks items added to the cart, and inventory quantities adjust in real time 
as items are added or removed.

The product detail page shows:
* Product name and description  
* A dedicated product image (larger than on the home page)  
* SKU, quantity available, and price  
* A “Home” link returning the user to the Inventory page  

Tech: React (Create React App), JavaScript, React Router, JSON, HTML5, and CSS3.

How to run:
1) cd "C:\Programs\nvm-workspace\CS601_HW6_danylov"
2) npm install
3) npm install react-router-dom@6
4) npm start
5) Default browser opens automatically at: http://localhost:3000
6) To test in another browser, manually open http://localhost:3000 in Edge, Firefox, or Chrome

Validation: validator.w3.org (HTML), jsonlint.com (JSON), and jigsaw.w3.org/css-validator (CSS)

Tested in: Edge, Firefox, and Chrome.

Notes:
* Inventory data lives in `./public/models/inventory.json` and contains 10 products.  
  This version adds two new fields required:  
  * `"description"` — a short text description of the item
  * `"image"` — the filename of the product image stored in `/public/images/`

* The 'InventoryItem' component remains reusable and receives its data via props;  
  it renders `SKU`, `Name`, `Quantity`, and `Price` exactly as before,  
  but now wraps its main content in a React Router `<Link>` to enable navigation  
  to the `/product/:sku` detail page.

* The 'ProductDetail' component is new for this version.  
  It accepts props, uses `useParams()` to read the SKU from the URL,  
  finds the matching product in the inventory array,  
  and displays the full product information (including description and larger image).

* The 'InventoryList' component continues to use list rendering (`map`)  
  to display each product card using the `InventoryItem` component.

* The 'CartSummary' component is unchanged from the previous version:  
  * total number of items in the cart (summing quantities),  
  * total price (formatted to two decimals),  
  * a per-item row with decrease / increase / remove buttons.  
  Adding or removing items adjusts the visible inventory for the current user session.

* 'Routing' is implemented using React Router (version 6 syntax):  
  * `/` renders the Inventory page with product cards and the cart summary  
  * `/product/:sku` renders the Product Detail page  
  * `*` displays a simple fallback for unknown URLs  

* Styling is centralized in `App.css` for React components and `index.css` 
for global defaults  (body, root, anchor tags).  Additional CSS classes were added 
for the product detail page.



# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
