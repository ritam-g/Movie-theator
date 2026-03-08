/**
 * Main entry point for the React application
 * This file bootstraps the React app and sets up the necessary providers
 */
import React from "react";
import ReactDOM from "react-dom/client";
// BrowserRouter enables client-side routing with URL history
import { BrowserRouter } from "react-router-dom";
// Provider makes the Redux store available to all components
import { Provider } from "react-redux";
import App from "./App";
// Import the configured Redux store
import { store } from "./redux/store";
// Import global CSS styles
import "./styles/global.css";

// Create root and render the React application
// React.StrictMode helps identify potential problems in the app
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
