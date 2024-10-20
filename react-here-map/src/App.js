import React, { useEffect, useRef, useState } from "react";
import './App.css';

function App() {
  // For Map and Marker Generation
  const mapRef = useRef(null); // Reference to the map container
  const [latitude, setLatitude] = useState(52.5159); // Default latitude (Berlin)
  const [longitude, setLongitude] = useState(13.3777); // Default longitude (Berlin)
  const [numPoints, setNumPoints] = useState(10); // Number of markers to generate
  const [coordinatesList, setCoordinatesList] = useState([]); // List of random coordinates
  const mapInstance = useRef(null); // Reference to the map instance
  const platform = useRef(null); // Reference to the HERE platform

  // For ZIP code and Location Type Selection
  const [zipCode, setZipCode] = useState("");
  const [locationType, setLocationType] = useState("All");

  // The list of location types
  const locationTypes = [
    "Convenience Store",
    "Small Grocery Store",
    "Combination Grocery/Other",
    "Medium Grocery Store",
    "Supermarket",
    "Super Store",
    "Meat/Poultry Specialty",
    "Bakery Specialty",
    "Large Grocery Store",
    "Farmers' Market",
    "Fruits/Veg Specialty",
    "Seafood Specialty",
    "Delivery Route",
    "Food Buying Co-op",
    "Wholesaler",
    "Military Commissary",
  ];

  // Function to generate random nearby coordinates
  const generateRandomCoordinates = (centerLat, centerLng, numPoints) => {
    const randomCoordinates = [];
    const radius = 0.01; // Define how close the random points should be (smaller = closer)

    for (let i = 0; i < numPoints; i++) {
      const randomLatOffset = (Math.random() - 0.5) * radius; // Random offset for latitude
      const randomLngOffset = (Math.random() - 0.5) * radius; // Random offset for longitude
      randomCoordinates.push({
        lat: centerLat + randomLatOffset,
        lng: centerLng + randomLngOffset,
      });
    }

    return randomCoordinates;
  };

  // Initialize the HERE Maps platform and map
  useEffect(() => {
    if (!platform.current) {
      platform.current = new window.H.service.Platform({
        apikey: "jNg5nWiUmlAxaaN5LlpL3Eei6xm3_a2bTay2TRmiI2k", // Replace with your HERE API key
      });

      const defaultLayers = platform.current.createDefaultLayers();

      // Initialize the map
      mapInstance.current = new window.H.Map(
        mapRef.current,
        defaultLayers.vector.normal.map,
        {
          center: { lat: latitude, lng: longitude },
          zoom: 14,
          pixelRatio: window.devicePixelRatio || 1, // Ensure high resolution on high DPI screens
        }
      );

      // Enable map behavior and interactions (panning, zooming)
      const behavior = new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(mapInstance.current));

      // Add default UI components (zoom buttons)
      const ui = window.H.ui.UI.createDefault(mapInstance.current, defaultLayers);

      // Ensure the map resizes with the window
      window.addEventListener("resize", () => mapInstance.current.getViewPort().resize());
    }
  }, []);

  // Function to update the map markers
  const updateMapMarkers = (newCoordinatesList) => {
    if (mapInstance.current) {
      // Remove any previous markers
      mapInstance.current.removeObjects(mapInstance.current.getObjects());

      // Add markers for the new coordinates
      newCoordinatesList.forEach(coord => {
        const marker = new window.H.map.Marker({ lat: coord.lat, lng: coord.lng });
        mapInstance.current.addObject(marker);
      });

      // Center the map to the new inputted location
      mapInstance.current.setCenter({ lat: latitude, lng: longitude });
      mapInstance.current.setZoom(14);

      // Ensure the map resizes properly
      mapInstance.current.getViewPort().resize();
    }
  };

  // Update the markers whenever latitude/longitude or coordinatesList changes
  useEffect(() => {
    updateMapMarkers(coordinatesList);
  }, [coordinatesList]);

  // Generate random points based on latitude, longitude, and numPoints
  const generateMarkers = () => {
    const newCoords = generateRandomCoordinates(latitude, longitude, numPoints);
    setCoordinatesList(newCoords);
  };

  // Handlers for updating latitude, longitude, and numPoints
  const handleLatChange = (e) => {
    const newLat = parseFloat(e.target.value);
    setLatitude(newLat);
  };

  const handleLngChange = (e) => {
    const newLng = parseFloat(e.target.value);
    setLongitude(newLng);
  };

  const handleNumPointsChange = (e) => {
    const newNumPoints = parseInt(e.target.value, 10);
    setNumPoints(newNumPoints);
  };

  // Handle ZIP code and location type search
  const handleSearch = (e) => {
    e.preventDefault();
    if (zipCode.trim()) {
      console.log("Searching for map at zip code:", zipCode);
      console.log("Filtering by location type:", locationType);
      // Add code here to perform the search or integrate with a map API based on zipCode and locationType
    }
  };

  return (
    <div className="App">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="brand">SNAPMap</div>
        <ul className="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">Find Stores</a></li>
          <li><a href="#">About</a></li>
        </ul>
      </nav>

      {/* Header Section */}
      <header className="header">
        <h1>SNAP/EBT Shopping Made Easy</h1>
      </header>

      {/* Form for ZIP Code and Location Type */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter Zip Code"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          className="zip-input"
        />
        <select
          value={locationType}
          onChange={(e) => setLocationType(e.target.value)}
          className="location-filter"
        >
          <option value="All">All</option>
          {locationTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
        <button type="submit" className="search-button">Search</button>
      </form>

      {/* Form for Generating Markers */}
      <div className="form">
        <label>
          Latitude (center):
          <input
            type="number"
            value={latitude}
            onChange={handleLatChange}
            placeholder="Enter Latitude"
          />
        </label>
        <label>
          Longitude (center):
          <input
            type="number"
            value={longitude}
            onChange={handleLngChange}
            placeholder="Enter Longitude"
          />
        </label>
        <label>
          Number of Markers:
          <input
            type="number"
            value={numPoints}
            onChange={handleNumPointsChange}
            placeholder="Enter Number of Markers"
          />
        </label>
        <button onClick={generateMarkers}>Generate Markers</button>
      </div>

      {/* Main Content: Map and Information Cards */}
      <div className="main-content">
        <div ref={mapRef} className="mapContainer">
          {/* Map will appear here */}
        </div>

        {/* Card Section */}
        <div className="card">
          <h2>About SNAP</h2>
          <p>
            The Supplemental Nutrition Assistance Program (SNAP) helps low-income individuals and families access nutritious food. Use this tool to find stores that accept SNAP/EBT near you.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer>
        <p>© 2024 SNAP Store Finder | <a href="#">Privacy Policy</a></p>
      </footer>
    </div>
  );
}

export default App;
