import React, { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const mapRef = useRef(null); // Reference to the map container
  const [latitude, setLatitude] = useState(52.5159); // Default latitude (Berlin)
  const [longitude, setLongitude] = useState(13.3777); // Default longitude (Berlin)
  const mapInstance = useRef(null); // Reference to the map instance
  const platform = useRef(null); // Reference to the HERE platform

  // Example list of lat/lng coordinates (you can dynamically generate this based on a ZIP code)
  const coordinatesList = [
    { lat: 52.5159, lng: 13.3777 }, // Example point in Berlin
    { lat: 52.5160, lng: 13.3780 },
    { lat: 52.5161, lng: 13.3790 },
    { lat: 52.5162, lng: 13.3800 },
  ];

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

      // Add initial markers from the coordinates list
      coordinatesList.forEach(coord => {
        const marker = new window.H.map.Marker({ lat: coord.lat, lng: coord.lng });
        mapInstance.current.addObject(marker);
      });
    }
  }, []);

  // Update the map when latitude or longitude changes
  useEffect(() => {
    if (mapInstance.current) {
      // Remove all existing markers
      mapInstance.current.removeObjects(mapInstance.current.getObjects());

      // Add new markers for each point in the list
      coordinatesList.forEach(coord => {
        const marker = new window.H.map.Marker({ lat: coord.lat, lng: coord.lng });
        mapInstance.current.addObject(marker);
      });

      // Center the map to the new coordinates
      mapInstance.current.setCenter({ lat: latitude, lng: longitude });
      mapInstance.current.setZoom(14);

      // Ensure the map resizes properly
      mapInstance.current.getViewPort().resize();
    }
  }, [latitude, longitude]);

  // Handlers for updating latitude and longitude (optional for centering)
  const handleLatChange = (e) => setLatitude(parseFloat(e.target.value));
  const handleLngChange = (e) => setLongitude(parseFloat(e.target.value));

  return (
    <div className="App">
      <h1>Dynamic HERE Map with Multiple Markers in React</h1>
      <div className="form">
        <label>
          Latitude (for center):
          <input
            type="number"
            value={latitude}
            onChange={handleLatChange}
            placeholder="Enter Latitude"
          />
        </label>
        <label>
          Longitude (for center):
          <input
            type="number"
            value={longitude}
            onChange={handleLngChange}
            placeholder="Enter Longitude"
          />
        </label>
      </div>
      <div ref={mapRef} className="mapContainer" />
    </div>
  );
}

export default App;
