import React from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import '../RidesFilter/RidesFilter.css'

function SeatDots({ remaining, total = 4 }) {
  return (
    <span className="seat-dots">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={`dot${i < remaining ? " dot--filled" : ""}`} />
      ))}
      <span className="seat-label">{remaining} left</span>
    </span>
  );
}

function RideCard({ ride, onRequest, requested }) {
  const d = new Date(ride.departureTime);
  const date = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="ride-card">
      <div className="driver-col">
        <img
          src={ride.driverId.profilePictureUrl}
          alt={ride.driverId.fName}
          className="profile-pic"
        />
        <div className="driver-name">
          <span className="driver-fname">{ride.driverId.fName}</span>
          <span className="driver-lname">{ride.driverId.lName}</span>
        </div>
        <div className="driver-rating">
          <span className="rating-value">{ride.driverId.avgRating.toFixed(1)} ★</span>
        </div>
      </div>

      <div className="card-divider" />

      {/* Route and details */}
      <div className="ride-details">
        <div className="route-row">
          <span className="location-badge location-badge--from">{ride.departureLocation}</span>
          <ArrowRight className="arrow-icon" size={18} color="var(--blue-bright)" strokeWidth={2.5} />
          <span className="location-badge location-badge--to">{ride.destination}</span>
        </div>

        <div className="meta-row">

          <span className="meta-item">
            <Calendar size={14} color="var(--blue-bright)" strokeWidth={2} />
            {date}
          </span>
          <span className="meta-item">
            <Clock size={14} color="var(--blue-bright)" strokeWidth={2} />
            {time}
          </span>
        </div>

        <SeatDots remaining={ride.remainingSeats} total={4} />
      </div>

      {/* Price and CTA */}
      <div className="price-col">
        <div className="price-display">
          <span className="price-amount">${ride.seatPrice.toFixed(0)}</span>
          <span className="price-label">per seat</span>
        </div>
        <button
          className={`request-btn${requested ? " request-btn--done" : ""}`}
          onClick={() => onRequest(ride._id)}
          disabled={requested}
        >
          {requested ? "✓ Requested" : "Request"}
        </button>
      </div>
    </div>
  );
}

export default RideCard
