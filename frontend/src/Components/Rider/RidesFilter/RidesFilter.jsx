import { useState, useMemo, useEffect } from "react";
import { Car, Search } from "lucide-react";
import MyRides from "../MyRides/MyRides";
import RideCard from "../RideCard/RideCard";
import api from "../../../utils/api";
import styles from "./RidesFilter.module.css";
import clsx from "clsx";

const SORT_OPTIONS = [
  { value: "time_asc",   label: "Earliest Departure" },
  { value: "price_asc",  label: "Lowest Price" },
  { value: "price_desc", label: "Highest Price" },
  { value: "rating_desc",label: "Top Rated" },
  { value: "seats_desc", label: "Most Seats" },
];

export default function RidesFilter({ view = "FindRides" }) {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [maxCost, setMaxCost] = useState(50);
  const [sortBy, setSortBy] = useState("time_asc");
  const [requestedIds, setRequestedIds] = useState(new Set());
  const [searchDep, setSearchDep] = useState("");
  const [searchDest, setSearchDest] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [requestError, setRequestError] = useState("");

  useEffect(() => {
    const fetchRides = async () => {
      setLoading(true);
      setFetchError("");
      try {
        const params = { price: maxCost };
        if (searchDep) params.departureLocation = searchDep;
        if (searchDest) params.destination = searchDest;
        if (searchDate) params.date = searchDate;
        const response = await api.get("/rides", { params });
        setRides(response.data.data);
      } catch (error) {
        setFetchError(error.response?.data?.message || "Failed to load rides.");
      } finally {
        setLoading(false);
      }
    };

    if (view === "FindRides") {
      fetchRides();
    }
  }, [view, searchDep, searchDest, searchDate, maxCost]);

  const filteredRides = useMemo(() => {
    let filtered = rides.filter(
      (r) =>
        r.status === "open" &&
        (r.driverId?.avgRating || 0) >= minRating
    );

    return [...filtered].sort((a, b) => {
      if (sortBy === "time_asc")    return new Date(a.departureTime) - new Date(b.departureTime);
      if (sortBy === "price_asc")   return a.seatPrice - b.seatPrice;
      if (sortBy === "price_desc")  return b.seatPrice - a.seatPrice;
      if (sortBy === "rating_desc") return (b.driverId?.avgRating || 0) - (a.driverId?.avgRating || 0);
      if (sortBy === "seats_desc")  return b.remainingSeats - a.remainingSeats;
      return 0;
    });
  }, [rides, minRating, sortBy]);

  const handleRequest = async (id) => {
    setRequestError("");

    try {
      await api.post(`/rides/${id}/request`);

      setRequestedIds((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });

    } catch (error) {
      const message = error.response?.data?.message;

      if (message === "Already requested this ride") {
        setRequestedIds((prev) => {
          const next = new Set(prev);
          next.add(id); 
          return next;
        });

        alert("You already requested this ride");
        return;
      }

      setRequestError(message || "Failed to request ride.");
    }
  };

  return (
    <div className={styles['rides-container']}>
      {view === "FindRides" && (
        <>
          <div className={styles['filter-panel']}>
            <div className={styles['filter-header']}>
              <h3 className={styles['filter-title']}><Search size={16} strokeWidth={2} /> Find Rides</h3>
              <span className={styles['result-badge']}>
                {filteredRides.length} ride{filteredRides.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className={styles['search-row']}>
              <div className={styles['field-group']}>
                <label className={styles['field-label']}>From</label>
                <input className={styles['text-input']} type="text" placeholder="Departing from..."
                  value={searchDep} onChange={(e) => setSearchDep(e.target.value)} />
              </div>
              <div className={styles['field-group']}>
                <label className={styles['field-label']}>To</label>
                <input className={styles['text-input']} type="text" placeholder="Arriving at..."
                  value={searchDest} onChange={(e) => setSearchDest(e.target.value)} />
              </div>
              <div className={styles['field-group']}>
                <label className={styles['field-label']}>Date</label>
                <input className={styles['text-input']} type="date"
                  value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
              </div>
            </div>

            {fetchError && (
              <div className={styles['error-banner']}>{fetchError}</div>
            )}
            {requestError && (
              <div className={styles['error-banner']}>{requestError}</div>
            )}

            <div className={styles['sliders-row']}>
              <div className={styles['field-group']}>
                <label className={styles['field-label']}>
                  Min Rating <strong>{minRating.toFixed(1)} ★</strong>
                </label>
                <input type="range" min="0" max="5" step="0.1" value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))} />
              </div>
              <div className={styles['field-group']}>
                <label className={styles['field-label']}>
                  Max Price <strong>${maxCost}</strong>
                </label>
                <input type="range" min="0" max="100" step="1" value={maxCost}
                  onChange={(e) => setMaxCost(Number(e.target.value))} />
              </div>
              <div className={styles['field-group']}>
                <label className={styles['field-label']}>Sort By</label>
                <select className={styles['text-input']} value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}>
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={styles['rides-list']}>
            {loading ? (
              <div className={styles['empty-state']}>
                <p>Loading rides...</p>
              </div>
            ) : filteredRides.length > 0 ? (
              filteredRides.map((ride) => (
                <RideCard
                  key={ride._id}
                  ride={ride}
                  onRequest={handleRequest}
                  requested={requestedIds.has(ride._id)}
                />
              ))
            ) : (
              <div className={styles['empty-state']}>
                <Car className={styles['empty-icon']} />
                <p>No rides match your filters. Try adjusting them!</p>
              </div>
            )}
          </div>
        </>
      )}

      {view === "MyRides" && (
        <MyRides rides={rides} requestedIds={requestedIds} />
      )}
    </div>
  );
}