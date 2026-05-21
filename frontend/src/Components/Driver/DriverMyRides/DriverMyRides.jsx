import React, { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { ArrowDown, Clock, Users, Banknote, ClipboardList, Plus } from "lucide-react";
import "./DriverMyRides.css";

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
      _id: "60d21b4667d0d8992e610c81",
      fName: "Alice",
      lName: "Johnson",
      profilePictureUrl: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      avgRating: 4.8,
    },
    departureLocation: "UC Riverside",
    destination: "Los Angeles, CA",
    departureTime: "2026-05-22T14:00:00.000Z",
    remainingSeats: 1,
    seatPrice: 12.0,
    status: "full",
  },
  {
    _id: "60d21b4667d0d8992e610c87",
    driverId: {
      _id: "60d21b4667d0d8992e610c81",
      fName: "Alice",
      lName: "Johnson",
      profilePictureUrl: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      avgRating: 4.8,
    },
    departureLocation: "UC Riverside",
    destination: "San Diego, CA",
    departureTime: "2026-05-25T09:00:00.000Z",
    remainingSeats: 4,
    seatPrice: 15.0,
    status: "open",
  },
];

const STATUS_LABELS = {
  open: "Open",
  full: "Full",
  inprogress: "In Progress",
  completed: "Completed",
};

function formatDepartureTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function RideCard({ ride }) {
  return (
    <div className={`ride-card ride-card--${ride.status}`}>
      <div className="ride-card_route">
        <div className="ride-card_location">
          <span className="ride-card_dot ride-card_dot--from" />
          <span className="ride-card_place">{ride.departureLocation}</span>
        </div>
        <div className="ride-card_arrow"><ArrowDown size={16} /></div>
        <div className="ride-card_location">
          <span className="ride-card_dot ride-card_dot--to" />
          <span className="ride-card_place">{ride.destination}</span>
        </div>
      </div>

      <div className="ride-card_meta">
        <div className="ride-card_meta-item">
          <span className="ride-card_meta-icon"><Clock size={16} /></span>
          <span>{formatDepartureTime(ride.departureTime)}</span>
        </div>
        <div className="ride-card_meta-item">
          <span className="ride-card_meta-icon"><Users size={16} /></span>
          <span>{ride.remainingSeats} seat{ride.remainingSeats !== 1 ? "s" : ""} left</span>
        </div>
        <div className="ride-card_meta-item">
          <span className="ride-card_meta-icon"><Banknote size={16} /></span>
          <span>${ride.seatPrice.toFixed(2)} / seat</span>
        </div>
      </div>

      <div className="ride-card_footer">
        <span className={`ride-card_status ride-card_status--${ride.status}`}>
          {STATUS_LABELS[ride.status] ?? ride.status}
        </span>
        <div className="ride-card_actions">
          <button className="ride-card_btn ride-card_btn--edit">Edit</button>
          <button className="ride-card_btn ride-card_btn--delete">Delete</button>
        </div>
      </div>
    </div>
  );
}

function DriverMyRides() {
  const { reviewCount } = useOutletContext();
  const [rides] = useState(mockRides);

  const openRides = rides.filter((r) => r.status === "open").length;

  return (
    <div className="my-rides-page">
      {/* Header */}
      <div className="my-rides-header">
        <div className="my-rides-header_text">
          <h1 className="my-rides-header_title">My Rides</h1>
          <p className="my-rides-header_subtitle">
            Manage your offerings and requests
          </p>
        </div>
        <Link to="/createNewRide">
          <button className="post-ride-btn"><Plus size={16} /> Post New Ride</button>
        </Link>
      </div>

      {/* Stats row */}
      <div className="my-rides-stats">
        <div className="stat-card">
          <span className="stat-card_value">{rides.length}</span>
          <span className="stat-card_label">Total Rides</span>
        </div>
        <div className="stat-card">
          <span className="stat-card_value">{openRides}</span>
          <span className="stat-card_label">Open</span>
        </div>
        <div className="stat-card stat-card--alert">
          <span className="stat-card_value">{reviewCount}</span>
          <span className="stat-card_label">Pending Reviews</span>
        </div>
      </div>

      {/* Review request banner */}
      {reviewCount > 0 && (
        <div className="review-banner">
          <div className="review-banner_text">
            <span className="review-banner_icon" style={{ display: 'inline-flex', alignItems: 'center' }}><ClipboardList size={24} /></span>
            <span>
              You have <strong>{reviewCount}</strong> ride request
              {reviewCount !== 1 ? "s" : ""} waiting for your review.
            </span>
          </div>
          <Link to="/driver/requestReview">
            <button className="review-banner_btn">Review Requests</button>
          </Link>
        </div>
      )}

      {/* Rides list */}
      <div className="rides-section">
        <h2 className="rides-section_title">Your Posted Rides</h2>
        {rides.length === 0 ? (
          <div className="rides-empty">
            <p>You haven't posted any rides yet.</p>
            <Link to="/createNewRide">
              <button className="post-ride-btn">Post Your First Ride</button>
            </Link>
          </div>
        ) : (
          <div className="rides-grid">
            {rides.map((ride) => (
              <RideCard key={ride._id} ride={ride} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DriverMyRides;