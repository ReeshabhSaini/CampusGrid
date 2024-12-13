import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';
import "./styles/main.css"
import App from "./App";

// Create the root DOM element for the app
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the app
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
