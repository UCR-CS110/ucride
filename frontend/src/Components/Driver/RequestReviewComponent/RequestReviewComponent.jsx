import React, { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Star, ArrowRight, Clock, Banknote, ArrowLeft, Check, PartyPopper } from "lucide-react";
import "./RequestReviewComponent.css";

const mockRequests = [
  {
    _id: "70a11c5778e1e9003f720d01",
    rideId: {
      _id: "60d21b4667d0d8992e610c85",
      departureLocation: "Riverside, CA",
      destination: "UC Riverside",
      departureTime: "2026-05-20T08:30:00.000Z",
      seatPrice: 5.0,
    },
    riderId: {
      _id: "60d21b4667d0d8992e610c90",
      fName: "Marcus",
      lName: "Rivera",
      profilePictureUrl: "https://i.pravatar.cc/150?u=marcus",
      avgRating: 4.6,
    },
    status: "pending",
    createdAt: "2026-05-18T10:14:00.000Z",
  },
  {
    _id: "70a11c5778e1e9003f720d02",
    rideId: {
      _id: "60d21b4667d0d8992e610c87",
      departureLocation: "UC Riverside",
      destination: "San Diego, CA",
      departureTime: "2026-05-25T09:00:00.000Z",
      seatPrice: 15.0,
    },
    riderId: {
      _id: "60d21b4667d0d8992e610c91",
      fName: "Priya",
      lName: "Nair",
      profilePictureUrl: "https://i.pravatar.cc/150?u=priya",
      avgRating: 5.0,
    },
    status: "pending",
    createdAt: "2026-05-19T16:45:00.000Z",
  },
  {
    _id: "70a11c5778e1e9003f720d03",
    rideId: {
      _id: "60d21b4667d0d8992e610c85",
      departureLocation: "Riverside, CA",
      destination: "UC Riverside",
      departureTime: "2026-05-20T08:30:00.000Z",
      seatPrice: 5.0,
    },
    riderId: {
      _id: "60d21b4667d0d8992e610c92",
      fName: "Jordan",
      lName: "Kim",
      profilePictureUrl: "https://i.pravatar.cc/150?u=jordan",
      avgRating: 4.2,
    },
    status: "pending",
    createdAt: "2026-05-19T19:03:00.000Z",
  },
];

function formatTime(isoString) {
  return new Date(isoString).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function StarRating({ value }) {
  return (
    <span className="star-rating" aria-label={`${value} stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= Math.round(value) ? "star star--filled" : "star"}>
          <Star size={16} fill={s <= Math.round(value) ? "currentColor" : "none"} />
        </span>
      ))}
      <span className="star-rating_value">{value.toFixed(1)}</span>
    </span>
  );
}

function RequestCard({ request, onAccept, onDecline }) {
  const { riderId, rideId } = request;

  return (
    <div className="request-card">
      {/* Rider Info */}
      <div className="request-card_rider">
        <img
          src={riderId.profilePictureUrl}
          alt={`${riderId.fName} ${riderId.lName}`}
          className="request-card_avatar"
        />
        <div className="request-card_rider-info">
          <span className="request-card_rider-name">
            {riderId.fName} {riderId.lName}
          </span>
          <StarRating value={riderId.avgRating} />
        </div>
        <span className="request-card_badge">Pending</span>
      </div>

      {/* Ride Info */}
      <div className="request-card_ride">
        <div className="request-card_route">
          <span className="request-card_dot request-card_dot--from" />
          <span className="request-card_place">{rideId.departureLocation}</span>
          <span className="request-card_arrow" style={{ display: 'inline-flex', alignItems: 'center' }}><ArrowRight size={16} /></span>
          <span className="request-card_dot request-card_dot--to" />
          <span className="request-card_place">{rideId.destination}</span>
        </div>
        <div className="request-card_meta">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={16} /> {formatTime(rideId.departureTime)}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Banknote size={16} /> ${rideId.seatPrice.toFixed(2)} / seat</span>
        </div>
      </div>

      {/* Requested at */}
      <p className="request-card_requested-at">
        Requested {formatTime(request.createdAt)}
      </p>

      {/* Actions */}
      <div className="request-card_actions">
        <button
          className="request-card_btn request-card_btn--accept"
          onClick={() => onAccept(request._id)}
        >
          Accept
        </button>
        <button
          className="request-card_btn request-card_btn--decline"
          onClick={() => onDecline(request._id)}
        >
          Decline
        </button>
      </div>
    </div>
  );
}

function RequestReviewComponent() {
  const { setReviewCount } = useOutletContext();
  const [requests, setRequests] = useState(mockRequests);
  const [resolved, setResolved] = useState([]);

  function resolveRequest(id, newStatus) {
    setRequests((prev) => {
      const updated = prev.filter((r) => r._id !== id);
      setReviewCount(updated.length);
      return updated;
    });
    setResolved((prev) => [...prev, { id, status: newStatus }]);
  }

  const handleAccept = (id) => resolveRequest(id, "accepted");
  const handleDecline = (id) => resolveRequest(id, "declined");

  return (
    <div className="review-page">
      {/* Header */}
      <div className="review-page_header">
        <Link to="/driver">
          <button className="back-btn">
            <span className="back-btn_arrow"><ArrowLeft size={16} /></span>
            Back to My Rides
          </button>
        </Link>
        <div>
          <h1 className="review-page_title">Ride Requests</h1>
          <p className="review-page_subtitle">
            {requests.length > 0
              ? `${requests.length} request${requests.length !== 1 ? "s" : ""} awaiting your decision`
              : "All caught up!"}
          </p>
        </div>
      </div>

      {/* Resolved toasts */}
      {resolved.length > 0 && (
        <div className="resolved-summary">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Check size={16} /> {resolved.filter((r) => r.status === "accepted").length} accepted
            &nbsp;·&nbsp;
            {resolved.filter((r) => r.status === "declined").length} declined
          </span>
        </div>
      )}

      {/* Request list */}
      {requests.length === 0 ? (
        <div className="review-page_empty">
          <p className="review-page_empty-icon" style={{ display: 'flex', justifyContent: 'center' }}><PartyPopper size={48} /></p>
          <p>No pending requests — you're all caught up!</p>
          <Link to="/driver">
            <button className="post-ride-btn">Back to Dashboard</button>
          </Link>
        </div>
      ) : (
        <div className="requests-list">
          {requests.map((req) => (
            <RequestCard
              key={req._id}
              request={req}
              onAccept={handleAccept}
              onDecline={handleDecline}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default RequestReviewComponent;