import React, { useState } from 'react';
import './RiderSearchFilter.css';

function RiderSearchFilter() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [day, setDay] = useState('');

  const handleSearch = () => {
    console.log("Searching for rides:", { pickup, dropoff, day });
  };

  return (
    <div className="rides-search-filter">
      <div className="search-inputs">
        <div className="input-group">
          <label htmlFor="pickup">PickUp Location</label>
          <input
            type="text"
            id="pickup"
            placeholder="Where from?"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="dropoff">DropOff Location</label>
          <input
            type="text"
            id="dropoff"
            placeholder="Where to?"
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="day">Day(s)</label>
          <select
            id="day"
            value={day}
            onChange={(e) => setDay(e.target.value)}
          >
            <option value="">Any Day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
        </div>
      </div>

      <button className="search-button" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
}

export default RiderSearchFilter;
