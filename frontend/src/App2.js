import React, { useState } from "react";
import './App2.css';

function App2() {
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount(clickCount + 1);
    console.log(`Button clicked ${clickCount + 1} time(s).`);
  };

  return (
    <div className="App2">
      <header className="header">
        <h1>Simple Button Click App</h1>
      </header>

      <div className="main-content">
        <button onClick={handleClick} className="click-button">Click Me!</button>
        <p>Button has been clicked {clickCount} time(s).</p> {/* Show the click count */}
      </div>

      <footer>
        <p>© 2024 Simple App | <a href="https://example.com" target="_blank" rel="noopener noreferrer">Privacy Policy</a></p>
      </footer>
    </div>
  );
}

export default App2;
