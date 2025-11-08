import './Map.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-extra-markers';
import 'leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css';
import DirectedLine from '../DirectedLine/DirectedLine';
import { mapFilter } from '../../utils/lists';
import { createMarker } from '../../utils/icon';
import { Trips } from '@my-travel-journal/common';

const CENTER_OF_MAP: [number, number] = [40.5, -40.0];

interface MapData {
  trips: Trips;
  colors: Record<string, string>;
  showJournies: boolean;
}

const Map: React.FC<MapData> = ({ trips, colors, showJournies }) => {
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

      {mapFilter(
        tripEntries,
        elem => true,
        ([tripId, { places, journeys }]) => (
          <div key={tripId}>
            {Object.entries(places).map(([placeId, place]) => {
              const icon = L.ExtraMarkers.icon({
                svg: true,
                innerHTML: createMarker(colors[tripId]),
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
                    <b>
                      {place.name
                        ? `${place.name} - ${place.city}`
                        : place.city}
                    </b>
                    {place.description ? (
                      <div>
                        <br />
                        {place.description}
                      </div>
                    ) : null}
                  </Popup>
                </Marker>
              );
            })}

            {showJournies
              ? journeys.map(journey => {
                  const { latitude: la1, longitude: lo1 } =
                    places[journey.from].coordinates;
                  const { latitude: la2, longitude: lo2 } =
                    places[journey.to].coordinates;
                  return (
                    <DirectedLine
                      key={`trip_${journey.from}_${journey.to}`}
                      positions={[
                        [la1, lo1],
                        [la2, lo2],
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
                })
              : null}
          </div>
        ),
      )}
    </MapContainer>
  );
};

export default Map;
