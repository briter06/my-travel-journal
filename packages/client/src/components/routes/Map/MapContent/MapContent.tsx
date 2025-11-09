import './MapContent.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-extra-markers';
import 'leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css';
import DirectedLine from '../DirectedLine/DirectedLine';
import { createMarker } from '../../../../utils/icon';
import { Places, Trips } from '@my-travel-journal/common';

const CENTER_OF_MAP: [number, number] = [40.5, -40.0];

interface MapData {
  trips: Trips;
  places: Places;
  colors: Record<string, string>;
  showJournies: boolean;
}

const MapContent: React.FC<MapData> = ({
  trips,
  places,
  colors,
  showJournies,
}) => {
  const tripEntries = Object.entries(trips);

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

      {tripEntries.map(([tripId, { placeIds, journeys }]) => {
        const icon = L.ExtraMarkers.icon({
          svg: true,
          innerHTML: createMarker(colors[tripId]),
        });
        return (
          <div key={tripId}>
            {placeIds.map((placeId: number) => {
              const place = places[placeId];
              return (
                <Marker
                  key={placeId}
                  position={[
                    parseInt(place.latitude, 10),
                    parseInt(place.longitude, 10),
                  ]}
                  icon={icon}
                >
                  <Popup>
                    <b>
                      {place.name
                        ? `${place.name} - ${place.city}`
                        : place.city}
                    </b>
                  </Popup>
                </Marker>
              );
            })}
            {showJournies
              ? journeys.map(journey => {
                  if (journey.to != null) {
                    const { latitude: la1, longitude: lo1 } =
                      places[journey.from];
                    const { latitude: la2, longitude: lo2 } =
                      places[journey.to];
                    return (
                      <DirectedLine
                        key={`trip_${journey.from}_${journey.to}`}
                        positions={[
                          [parseInt(la1, 10), parseInt(lo1, 10)],
                          [parseInt(la2, 10), parseInt(lo2, 10)],
                        ]}
                        color={colors[tripId]}
                        popup={`<b>${
                          places[journey.from].city
                        } <i class="bi-caret-right-fill"></i> ${
                          places[journey.to].city
                        }</b> <br/> ${new Date(journey.date).toLocaleString(
                          undefined,
                          {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          },
                        )}`}
                      />
                    );
                  }
                  return null;
                })
              : null}
          </div>
        );
      })}
    </MapContainer>
  );
};

export default MapContent;
