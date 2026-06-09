import { useState, useEffect } from 'react';
import Map, { Marker, Source, Layer } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from './RideMap.module.css';

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const routeLayer = {
  id: 'route',
  type: 'line',
  paint: {
    'line-color': '#1295D8',
    'line-width': 4,
    'line-cap': 'round',
    'line-join': 'round',
  },
};

export default function RideMap({ from, to }) {
  const [route, setRoute] = useState(null);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const url =
          `https://api.mapbox.com/directions/v5/mapbox/driving/` +
          `${from.lng},${from.lat};${to.lng},${to.lat}` +
          `?geometries=geojson&access_token=${TOKEN}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes?.[0]) setRoute(data.routes[0].geometry);
      } catch {
        // show markers without route on failure
      }
    };
    fetchRoute();
  }, [from.lat, from.lng, to.lat, to.lng]);

  const bounds = [
    [Math.min(from.lng, to.lng) - 0.01, Math.min(from.lat, to.lat) - 0.01],
    [Math.max(from.lng, to.lng) + 0.01, Math.max(from.lat, to.lat) + 0.01],
  ];

  return (
    <div className={styles['ride-map']}>
      <Map
        mapboxAccessToken={TOKEN}
        initialViewState={{ bounds, fitBoundsOptions: { padding: 30 } }}
        className={styles['map-fill']}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        {route && (
          <Source type="geojson" data={{ type: 'Feature', geometry: route }}>
            <Layer {...routeLayer} />
          </Source>
        )}
        <Marker longitude={from.lng} latitude={from.lat} color="#0876ac" />
        <Marker longitude={to.lng} latitude={to.lat} color="#FFB81C" />
      </Map>
      <div className={styles['map-legend']}>
        <span className={styles['legend-from']}>● {from.name.split(',')[0]}</span>
        <span className={styles['legend-to']}>● {to.name.split(',')[0]}</span>
      </div>
    </div>
  );
}
