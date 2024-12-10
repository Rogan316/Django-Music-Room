import React from 'react';
import { createRoot } from 'react-dom/client'; // Correct import for React 18+
import App from './components/app'; // Ensure the path is correct

// Get the root container element from the HTML file
const container = document.getElementById('app');
const root = createRoot(container); // Create a root for rendering

// Render the main App component
root.render(<App />);
