// components/LocationPicker.tsx
"use client";

import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Popup,
} from "react-leaflet";
import { LatLngExpression, LatLng } from "leaflet";

interface LocationPickerProps {
  initialPosition: LatLngExpression;
  onLocationSelect: (latlng: { lat: number; lng: number }) => void;
}

// A helper component to update marker on map click
function MapClickHandler({
  setPosition,
}: {
  setPosition: (latlng: LatLng) => void;
}) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });
  return null;
}

export default function LocationPicker({
  initialPosition,
  onLocationSelect,
}: LocationPickerProps) {
  const [position, setPosition] = useState<LatLngExpression>(initialPosition);

  // Convert LatLngExpression to LatLng for the callback
  const getLatLng = (pos: LatLngExpression): { lat: number; lng: number } => {
    if (Array.isArray(pos)) {
      return { lat: pos[0], lng: pos[1] };
    }
    return pos as { lat: number; lng: number };
  };

  return (
    <div className="space-y-4">
      <MapContainer
        center={initialPosition}
        zoom={10}
        scrollWheelZoom={true}
        className="h-[400px] w-full rounded-md"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>Selected Location</Popup>
        </Marker>
        <MapClickHandler setPosition={setPosition} />
      </MapContainer>
      <button
        onClick={() => onLocationSelect(getLatLng(position))}
        className="w-full bg-blue-600 text-white p-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
      >
        Confirm Location
      </button>
    </div>
  );
}