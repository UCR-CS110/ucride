import { useState, useEffect } from "react";
import styles from './MyRides.module.css';
import clsx from 'clsx';
import { Car, ArrowRight } from 'lucide-react';
import api from "../../../utils/api";

function MyRides() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get('/requests');
        setRequests(response.data.data);
      } catch (error) {
        console.error("Failed to fetch requested rides:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className={styles['my-rides']}>
      <h3 className={styles['section-title']}>My Requested Rides</h3>
      {loading ? (
        <div className={styles['empty-state']}>Loading your requests...</div>
      ) : requests.length === 0 ? (
        <div className={styles['empty-state']}>
          <span className={styles['empty-icon']}><Car size={48} /></span>
          <p>No rides requested yet. Find a ride and request it!</p>
        </div>
      ) : (
        <div className={styles['rides-list']}>
          {requests.map((req) => {
            const ride = req.rideId;
            if (!ride) return null;
            const d = new Date(ride.departureTime);
            return (
              <div key={req._id} className={styles['my-ride-card']}>
                <div className={styles['my-ride-info']}>
                  <div className={styles['my-ride-route']}>
                    {ride.departureLocation} <ArrowRight className={styles['arrow-icon']} size={18} /> {ride.destination}
                  </div>
                  <div className={styles['my-ride-time']}>
                    {d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} at{" "}
                    {d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <div className={styles['my-ride-right']}>
                  <span className={styles['my-ride-price']}>${ride.seatPrice?.toFixed(2)}</span>
                  <span className={clsx(styles['requested-badge'], styles[`status-${req.status}`])}>
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyRides;