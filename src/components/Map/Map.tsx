import "./Map.css";
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-extra-markers";
import "leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css";
import DirectedLine from "../DirectedLine/DirectedLine";
import { Data } from "../../types/Data";
import { mapFilter } from "../../utils/lists";
import { createMarker } from "../../utils/icon";

const CENTER_OF_MAP: [number, number] = [40.5, -40.0];

interface MapData {
  data: Data;
}

const Map: React.FC<MapData> = ({ data }) => {
  const travelEntries = Object.entries(data);

  return (
    <MapContainer center={CENTER_OF_MAP} zoom={2.5} id="map-container">
      {/* <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      /> */}

      {/* https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png */}
      <TileLayer
        url="https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />

      {mapFilter(
        travelEntries,
        (elem) => true,
        ([travelId, { places, trips, color }]) => (
          <div key={travelId}>
            {Object.entries(places).map(([placeId, place]) => {
              const icon = (L as any).ExtraMarkers.icon({
                svg: true,
                innerHTML: createMarker(color),
              });
              return (
                <Marker
                  key={placeId}
                  position={[
                    place.coordinates.latitude,
                    place.coordinates.longitude,
                  ]}
                  icon={icon}
                >
                  <Popup>
                    <b>{place.name}</b>
                    <br />
                    <br />
                    {place.description}
                  </Popup>
                </Marker>
              );
            })}

            {trips.map((trip) => {
              const { latitude: la1, longitude: lo1 } =
                places[trip.from].coordinates;
              const { latitude: la2, longitude: lo2 } =
                places[trip.to].coordinates;
              return (
                <DirectedLine
                  key={`trip_${trip.from}_${trip.to}`}
                  positions={[
                    [la1, lo1],
                    [la2, lo2],
                  ]}
                  color={color}
                  popup={new Date(trip.date).toLocaleString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                />
              );
            })}
          </div>
        )
      )}
    </MapContainer>
  );
};

export default Map;
