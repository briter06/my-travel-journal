import './Map.css';
import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

// Fix default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const CENTER_OF_MAP: [number, number] = [40.5, -40.0]

const Map: React.FC = () => {
  const sanFrancisco: [number, number] = [37.7749, -122.4194];
  const losAngeles: [number, number] = [34.0522, -118.2437];

  const path: [number, number][] = [sanFrancisco, losAngeles];

  return (
    <MapContainer
      center={CENTER_OF_MAP}
      zoom={2.5}
      id="map-container"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
      
      {/* Markers */}
      <Marker position={sanFrancisco}>
        <Popup>San Francisco</Popup>
      </Marker>
      <Marker position={losAngeles}>
        <Popup>Los Angeles</Popup>
      </Marker>

      {/* Polyline */}
      <Polyline positions={path} color="red" />
    </MapContainer>
  );
};

export default Map;
