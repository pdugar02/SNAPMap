import React, { useEffect, useRef, useState } from "react";
import './App.css';  // Assume you have appropriate styles

function App() {
  const mapRef = useRef(null);  // Reference to the map container
  const [latitude, setLatitude] = useState(52.5159);  // Default latitude
  const [longitude, setLongitude] = useState(13.3777);  // Default longitude
  const [numPoints, setNumPoints] = useState(0);  // Number of markers based on response
  const [coordinatesList, setCoordinatesList] = useState([]);  // List of lat/lng from the backend
  const mapInstance = useRef(null);  // Reference to the map instance
  const platform = useRef(null);  // Reference to the HERE platform
  const [zipCode, setZipCode] = useState("");  // ZIP code input field

  useEffect(() => {
    if (!platform.current) {
      platform.current = new window.H.service.Platform({
        apikey: "jNg5nWiUmlAxaaN5LlpL3Eei6xm3_a2bTay2TRmiI2k",  
      });

      const defaultLayers = platform.current.createDefaultLayers();

      // Initialize the map
      mapInstance.current = new window.H.Map(
        mapRef.current,
        defaultLayers.vector.normal.map,
        {
          center: { lat: latitude, lng: longitude },
          zoom: 14,
          pixelRatio: window.devicePixelRatio || 1,
        }
      );

      const behavior = new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(mapInstance.current));
      const ui = window.H.ui.UI.createDefault(mapInstance.current, defaultLayers);
      window.addEventListener("resize", () => mapInstance.current.getViewPort().resize());
    }
  }, []);

  useEffect(() => {
    if (coordinatesList.length > 0) {
      updateMapMarkers(coordinatesList);
    } else {
      console.log("No coordinates to update on the map.");
    }
  }, [coordinatesList]);

  const updateMapMarkers = (newCoordinatesList) => {
    if (mapInstance.current) {
      // Clear existing markers
      mapInstance.current.removeObjects(mapInstance.current.getObjects());

      if (newCoordinatesList.length > 0) {
        newCoordinatesList.forEach(coord => {
          if (coord.Latitude && coord.Longitude) {
            console.log(coord)
            // Create a marker for each valid latitude and longitude
            const marker = new window.H.map.Marker({ lat: coord.Latitude, lng: coord.Longitude });
            mapInstance.current.addObject(marker);
          }
        });

        // Calculate the average latitude and longitude to set the map center
        const avgLat = newCoordinatesList.reduce((acc, val) => acc + val.Latitude, 0) / newCoordinatesList.length;
        const avgLng = newCoordinatesList.reduce((acc, val) => acc + val.Longitude, 0) / newCoordinatesList.length;

        // Set the map center and zoom level
        mapInstance.current.setCenter({ lat: avgLat, lng: avgLng });
        mapInstance.current.setZoom(14);
      } else {
        console.error("No valid coordinates to display.");
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();  // Prevent form from refreshing the page

    if (zipCode.trim()) {
      console.log(`Sending request with ZIP code: ${zipCode}`);

      // Pointing to the Flask backend
      fetch(`/api/stores?zip_code=${zipCode}`)
        .then(response => {
          console.log(`Received response with status: ${response.status}`);
          return response.json();
        })
        .then(data => {
          console.log("Received data:", data);
          if (data.length > 0) {
            console.log(`Number of locations found: ${data.length}`);
            setCoordinatesList(data);  // Set the coordinates in state
            setNumPoints(data.length);  // Update the number of points
          } else {
            console.log("No data found for this ZIP code.");
            alert("No data found for this ZIP code.");
          }
        })
        .catch(error => {
          console.error("Error fetching data:", error);
        });
    } else {
      console.log("No ZIP code entered");
    }
  };

  useEffect(() => {
    if (coordinatesList.length > 0) {
      console.log("coordinatesList has been updated:", coordinatesList);
      updateMapMarkers(coordinatesList); // Update markers whenever coordinatesList changes
    }
  }, [coordinatesList]);

  return (
    <div className="App">
      <nav className="navbar">
        <div className="brand">SNAPMap</div>
        <ul className="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">Find Stores</a></li>
          <li><a href="#">About</a></li>
        </ul>
      </nav>

      <header className="header">
        <h1>SNAP/EBT Shopping Made Easy</h1>
      </header>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter Zip Code"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          className="zip-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      <div className="main-content">
        <div ref={mapRef} className="mapContainer">
          {/* The map will appear here */}
        </div>
      </div>

      <footer>
        <p>© 2024 SNAP Store Finder | <a href="#">Privacy Policy</a></p>
      </footer>
    </div>
  );
}

export default App;
