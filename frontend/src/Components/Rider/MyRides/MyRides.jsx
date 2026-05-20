import React from "react";
import '../RidesFilter/RidesFilter.css';
import { Car, ArrowRight } from 'lucide-react';

function MyRides({ rides, requestedIds }) {
  const myRides = rides.filter((r) => requestedIds.has(r._id));

  return (
    <div className="my-rides">
      <h3 className="section-title">My Requested Rides</h3>
      {myRides.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon"><Car size={48} /></span>
          <p>No rides requested yet. Find a ride and request it!</p>
        </div>
      ) : (
        <div className="rides-list">
          {myRides.map((ride) => {
            const d = new Date(ride.departureTime);
            return (
              <div key={ride._id} className="my-ride-card">
                <div className="my-ride-info">
                  <div className="my-ride-route">
                    {ride.departureLocation} <ArrowRight className="arrow-icon" size={18} color="var(--blue-bright)" strokeWidth={2.5} /> {ride.destination}
                  </div>
                  <div className="my-ride-time">
                    {d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} at{" "}
                    {d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <div className="my-ride-right">
                  <span className="my-ride-price">${ride.seatPrice.toFixed(2)}</span>
                  <span className="requested-badge">Requested</span>
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