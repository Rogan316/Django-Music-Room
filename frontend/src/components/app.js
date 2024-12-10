import React, { Component } from 'react';
import { createRoot } from 'react-dom/client'; // Correct import
import HomePage from './HomePage'; // Ensure this path is correct


export default class App extends Component {
    render() {
        return (
            <div className="center" >
                <HomePage />
            </div>
        )
    }
}

// Get the container element with ID 'app' from your index.html
const appDiv = document.getElementById("app");
if (appDiv) {
    const root = createRoot(appDiv); // Correct usage of createRoot
    root.render(<App />); // Render the App component
} else {
    console.error("No element with id 'app' found.");
}
