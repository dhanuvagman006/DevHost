"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface MapSelectorProps {
  onSelect: (coords: { lat: number; lng: number }) => void;
  onClose: () => void;
}

const MapSelector: React.FC<MapSelectorProps> = ({ onSelect, onClose }) => {
  const [position, setPosition] = React.useState<{ lat: number; lng: number } | null>(null);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
      },
    });
    return null;
  };

  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
    });
  }, []);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[60.472, 8.4689]} // Default: Norway
        zoom={5}
        style={{ height: '100%', width: '100%', borderRadius: '12px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <MapClickHandler />
        {position && <Marker position={position} />}
      </MapContainer>

      <div className="absolute bottom-3 left-3 flex gap-2">
        <button
          onClick={() => onClose()}
          className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={() => position && onSelect(position)}
          disabled={!position}
          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          Confirm Location
        </button>
      </div>
    </div>
  );
};

export default MapSelector;
