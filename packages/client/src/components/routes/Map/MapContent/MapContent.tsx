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
import { Locations, Trips } from '@my-travel-journal/common';

const CENTER_OF_MAP: [number, number] = [40.5, -40.0];

interface MapData {
  trips: Trips;
  locations: Locations;
  colors: Record<string, string>;
  showJournies: boolean;
}

const MapContent: React.FC<MapData> = ({
  trips,
  locations,
  colors,
  showJournies,
}) => {
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

      {Object.entries(trips).map(([tripId, { locationIds, journeys }]) => {
        const icon = L.ExtraMarkers.icon({
          svg: true,
          innerHTML: createMarker(colors[tripId]),
        });
        return (
          <div key={tripId}>
            {locationIds.map(locationId => {
              const location = locations[locationId];
              return (
                <Marker
                  key={locationId}
                  position={[
                    parseFloat(location.latitude),
                    parseFloat(location.longitude),
                  ]}
                  icon={icon}
                >
                  <Popup>
                    <b>
                      {location.name
                        ? `${location.name} - ${location.locality}`
                        : location.locality}
                    </b>
                  </Popup>
                </Marker>
              );
            })}
            {showJournies
              ? journeys.map(journey => {
                  if (journey.to != null) {
                    const { latitude: la1, longitude: lo1 } =
                      locations[journey.from];
                    const { latitude: la2, longitude: lo2 } =
                      locations[journey.to];
                    return (
                      <DirectedLine
                        key={`trip_${journey.from}_${journey.to}`}
                        positions={[
                          [parseFloat(la1), parseFloat(lo1)],
                          [parseFloat(la2), parseFloat(lo2)],
                        ]}
                        color={colors[tripId]}
                        popup={`<b>${
                          locations[journey.from].locality
                        } <i class="bi-caret-right-fill"></i> ${
                          locations[journey.to].locality
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
