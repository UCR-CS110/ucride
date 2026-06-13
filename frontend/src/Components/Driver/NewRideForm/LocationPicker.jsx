import { useState, useRef, useEffect } from 'react';
import Map, { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';
import styles from './LocationPicker.module.css';

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
// Bias results toward Riverside, CA
const PROXIMITY = '-117.3281,33.9731';

export default function LocationPicker({ label, value, onChange, error }) {
  const [query, setQuery] = useState(value?.name || '');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    setQuery(value?.name || '');
  }, [value?.name]);

  function handleInput(e) {
    const q = e.target.value;
    setQuery(q);
    onChange(null);

    clearTimeout(debounceRef.current);
    if (q.length < 2) { setSuggestions([]); return; }

    debounceRef.current = setTimeout(async () => {
      try {
        const url =
          `https://api.mapbox.com/geocoding/v5/mapbox.places/` +
          `${encodeURIComponent(q)}.json` +
          `?access_token=${TOKEN}&limit=5&country=us&proximity=${PROXIMITY}`;
        const res = await fetch(url);
        const data = await res.json();
        setSuggestions(data.features || []);
        setOpen(true);
      } catch {
        setSuggestions([]);
      }
    }, 300);
  }

  function handleSelect(feature) {
    const [lng, lat] = feature.center;
    onChange({ name: feature.place_name, lat, lng });
    setQuery(feature.place_name);
    setSuggestions([]);
    setOpen(false);
  }

  return (
    <div className={styles['location-picker']}>
      <label className={styles['picker-label']}>
        <MapPin size={14} /> {label}
      </label>

      <div className={styles['input-wrapper']}>
        <input
          className={styles['picker-input']}
          value={query}
          onChange={handleInput}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={`Search for ${label.toLowerCase()}…`}
          autoComplete="off"
        />
        {open && suggestions.length > 0 && (
          <ul className={styles['suggestions']}>
            {suggestions.map((f) => (
              <li
                key={f.id}
                className={styles['suggestion-item']}
                onMouseDown={() => handleSelect(f)}
              >
                {f.place_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <span className={styles['picker-error']}>{error}</span>}

      {value?.lat && (
        <div className={styles['mini-map']}>
          <Map
            mapboxAccessToken={TOKEN}
            initialViewState={{ longitude: value.lng, latitude: value.lat, zoom: 13 }}
            className={styles['map-fill']}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            interactive={false}
          >
            <Marker longitude={value.lng} latitude={value.lat} color="#0876ac" />
          </Map>
        </div>
      )}
    </div>
  );
}
