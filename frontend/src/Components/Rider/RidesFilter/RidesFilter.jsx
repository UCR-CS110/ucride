import { useState, useMemo } from "react";
import { Car, ArrowRight, Calendar, Clock, Search } from "lucide-react";
import MyRides from "../MyRides/MyRides";
import RideCard from "../RideCard/RideCard";
import "./RidesFilter.css";

const mockRides = [
  {
    _id: "60d21b4667d0d8992e610c85",
    driverId: {
      _id: "60d21b4667d0d8992e610c81",
      fName: "Alice",
      lName: "Johnson",
      profilePictureUrl: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      avgRating: 4.8,
    },
    departureLocation: "Riverside, CA",
    destination: "UC Riverside",
    departureTime: "2026-05-20T08:30:00.000Z",
    remainingSeats: 3,
    seatPrice: 5.0,
    status: "open",
  },
  {
    _id: "60d21b4667d0d8992e610c86",
    driverId: {
      _id: "60d21b4667d0d8992e610c82",
      fName: "Bob",
      lName: "Smith",
      profilePictureUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
      avgRating: 4.2,
    },
    departureLocation: "Irvine, CA",
    destination: "UC Riverside",
    departureTime: "2026-05-21T09:00:00.000Z",
    remainingSeats: 2,
    seatPrice: 8.0,
    status: "open",
  },
  {
    _id: "60d21b4667d0d8992e610c87",
    driverId: {
      _id: "60d21b4667d0d8992e610c83",
      fName: "Charlie",
      lName: "Davis",
      profilePictureUrl: "https://i.pravatar.cc/150?u=a04258114e29026702d",
      avgRating: 4.9,
    },
    departureLocation: "Moreno Valley, CA",
    destination: "UC Riverside",
    departureTime: "2026-05-22T10:00:00.000Z",
    remainingSeats: 1,
    seatPrice: 10.0,
    status: "open",
  },
  {
    _id: "60d21b4667d0d8992e610c88",
    driverId: {
      _id: "60d21b4667d0d8992e610c84",
      fName: "Diana",
      lName: "Prince",
      profilePictureUrl: "https://i.pravatar.cc/150?u=a04258114e29026703d",
      avgRating: 5.0,
    },
    departureLocation: "UC Riverside",
    destination: "Los Angeles, CA",
    departureTime: "2026-05-20T07:00:00.000Z",
    remainingSeats: 4,
    seatPrice: 5.0,
    status: "open",
  },
];

const SORT_OPTIONS = [
  { value: "time_asc",   label: "Earliest Departure" },
  { value: "price_asc",  label: "Lowest Price" },
  { value: "price_desc", label: "Highest Price" },
  { value: "rating_desc",label: "Top Rated" },
  { value: "seats_desc", label: "Most Seats" },
];

export default function RidesFilter({ view = "FindRides" }) {
  const [minRating, setMinRating] = useState(0);
  const [maxCost, setMaxCost] = useState(50);
  const [sortBy, setSortBy] = useState("time_asc");
  const [requestedIds, setRequestedIds] = useState(new Set());
  const [searchDep, setSearchDep] = useState("");
  const [searchDest, setSearchDest] = useState("");

  const filteredRides = useMemo(() => {
    let rides = mockRides.filter(
      (r) =>
        r.status === "open" &&
        (r.driverId.avgRating || 0) >= minRating &&
        r.seatPrice <= maxCost &&
        r.departureLocation.toLowerCase().includes(searchDep.toLowerCase()) &&
        r.destination.toLowerCase().includes(searchDest.toLowerCase())
    );

    return [...rides].sort((a, b) => {
      if (sortBy === "time_asc")    return new Date(a.departureTime) - new Date(b.departureTime);
      if (sortBy === "price_asc")   return a.seatPrice - b.seatPrice;
      if (sortBy === "price_desc")  return b.seatPrice - a.seatPrice;
      if (sortBy === "rating_desc") return b.driverId.avgRating - a.driverId.avgRating;
      if (sortBy === "seats_desc")  return b.remainingSeats - a.remainingSeats;
      return 0;
    });
  }, [minRating, maxCost, sortBy, searchDep, searchDest]);

  const handleRequest = (id) => {
    setRequestedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="rides-container">
      {view === "FindRides" && (
        <>
          <div className="filter-panel">
            <div className="filter-header">
              <h3 className="filter-title"><Search size={16} strokeWidth={2} /> Find Rides</h3>
              <span className="result-badge">
                {filteredRides.length} ride{filteredRides.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="search-row">
              <div className="field-group">
                <label className="field-label">From</label>
                <input className="text-input" type="text" placeholder="Departing from..."
                  value={searchDep} onChange={(e) => setSearchDep(e.target.value)} />
              </div>
              <div className="field-group">
                <label className="field-label">To</label>
                <input className="text-input" type="text" placeholder="Arriving at..."
                  value={searchDest} onChange={(e) => setSearchDest(e.target.value)} />
              </div>
            </div>

            <div className="sliders-row">
              <div className="field-group">
                <label className="field-label">
                  Min Rating <strong>{minRating.toFixed(1)} ★</strong>
                </label>
                <input type="range" min="0" max="5" step="0.1" value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))} />
              </div>
              <div className="field-group">
                <label className="field-label">
                  Max Price <strong>${maxCost}</strong>
                </label>
                <input type="range" min="0" max="100" step="1" value={maxCost}
                  onChange={(e) => setMaxCost(Number(e.target.value))} />
              </div>
              <div className="field-group">
                <label className="field-label">Sort By</label>
                <select className="text-input" value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}>
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rides-list">
            {filteredRides.length > 0 ? (
              filteredRides.map((ride) => (
                <RideCard
                  key={ride._id}
                  ride={ride}
                  onRequest={handleRequest}
                  requested={requestedIds.has(ride._id)}
                />
              ))
            ) : (
              <div className="empty-state">
                <Car className="empty-icon" />
                <p>No rides match your filters. Try adjusting them!</p>
              </div>
            )}
          </div>
        </>
      )}

      {view === "MyRides" && (
        <MyRides rides={mockRides} requestedIds={requestedIds} />
      )}
    </div>
  );
}