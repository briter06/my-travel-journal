import './Map.css';
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import DirectedLine from './DirectedLine';

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
  const position1: [number, number] = [37.7749, -122.4194];
  const position2: [number, number] = [4.7110, -74.0721];

  const path: [number, number][] = [position1, position2];

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
      <Marker position={position1}>
        <Popup>San Francisco</Popup>
      </Marker>
      <Marker position={position2}>
        <Popup>Bogota</Popup>
      </Marker>

      {/* Polyline */}
      <DirectedLine positions={path} />
    </MapContainer>
  );
};

export default Map;
