
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapVisualization: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // For demo purposes, using a placeholder token - in production, this should be securely stored
    // and loaded from environment variables or a backend service
    const token = mapboxToken || 'pk.placeholder';

    // Initialize map only if we have a token
    if (token && token !== 'pk.placeholder') {
      mapboxgl.accessToken = token;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [0, 20],
        zoom: 1
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl());
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken]);

  // Function to handle token input
  const handleTokenSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem('mapboxToken') as HTMLInputElement;
    
    if (input && input.value) {
      setMapboxToken(input.value);
      localStorage.setItem('mapbox-token', input.value);
    }
  };

  // Placeholder UI if no token is provided
  if (!mapboxToken) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-4 bg-muted/20 rounded-lg border-dashed border-2 border-muted">
        <p className="text-sm text-muted-foreground mb-4 text-center">
          Please enter your Mapbox token to display the map visualization
        </p>
        <form onSubmit={handleTokenSubmit} className="w-full max-w-sm">
          <div className="flex">
            <input
              type="text"
              name="mapboxToken"
              placeholder="Enter your Mapbox token"
              className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-r-md hover:bg-primary/90"
            >
              Apply
            </button>
          </div>
          <p className="text-xs mt-2 text-muted-foreground">
            Get your token at <a href="https://mapbox.com" target="_blank" rel="noreferrer" className="underline">mapbox.com</a>
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="relative h-64">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute bottom-1 right-1 text-xs text-muted-foreground bg-background/80 px-1 rounded">
        © Mapbox © OpenStreetMap
      </div>
    </div>
  );
};

export default MapVisualization;
