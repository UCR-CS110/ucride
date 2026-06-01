import React, { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Star, ArrowRight, Clock, Banknote, ArrowLeft, Check, PartyPopper } from "lucide-react";
import api from "../../../utils/api";
import styles from "./RequestReviewComponent.module.css";
import clsx from "clsx";


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
    <span className={styles['star-rating']} aria-label={`${value} stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={clsx(styles.star, s <= Math.round(value) && styles['star--filled'])}>
          <Star size={16} fill={s <= Math.round(value) ? "currentColor" : "none"} />
        </span>
      ))}
      <span className={styles['star-rating_value']}>{value.toFixed(1)}</span>
    </span>
  );
}

function RequestCard({ request, onAccept, onDecline }) {
  const { riderId, rideId } = request;
  const DEFAULT_IMAGE = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  const profileImg = riderId?.profilePicture?.trim() ? encodeURI(riderId.profilePicture): DEFAULT_IMAGE;

  if (!riderId || !rideId) return null;

  return (
    <div className={styles['request-card']}>
      
      <div className={styles['request-card_rider']}>
        <Link to={`/profile/${riderId._id}`}>
          <img
            src={profileImg}
            alt={`${riderId.fName} ${riderId.lName}`}
            className={styles['request-card_avatar']}
          />
        </Link>
        
        <div className={styles['request-card_rider-info']}>
          <span className={styles['request-card_rider-name']}>
            <Link to={`/profile/${riderId._id}`}>
              {riderId.fName} {riderId.lName}
            </Link>
          </span>

          <StarRating value={riderId.avgRating || 5.0} />
        </div>
        <span className={styles['request-card_badge']}>Pending</span>
      </div>
      
      <div className={styles['request-card_ride']}>
        <div className={styles['request-card_route']}>
          <span className={clsx(styles['request-card_dot'], styles['request-card_dot--from'])} />
          <span className={styles['request-card_place']}>{rideId.departureLocation}</span>
          <span className={styles['request-card_arrow']} style={{ display: 'inline-flex', alignItems: 'center' }}><ArrowRight size={16} /></span>
          <span className={clsx(styles['request-card_dot'], styles['request-card_dot--to'])} />
          <span className={styles['request-card_place']}>{rideId.destination}</span>
        </div>
        <div className={styles['request-card_meta']}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={16} /> {formatTime(rideId.departureTime)}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Banknote size={16} /> ${rideId.seatPrice?.toFixed(2)} / seat</span>
        </div>
      </div>

      
      <p className={styles['request-card_requested-at']}>
        Requested {formatTime(request.createdAt)}
      </p>

      
      <div className={styles['request-card_actions']}>
        <button
          className={clsx(styles['request-card_btn'], styles['request-card_btn--accept'])}
          onClick={() => onAccept(request._id)}
        >
          Accept
        </button>
        <button
          className={clsx(styles['request-card_btn'], styles['request-card_btn--decline'])}
          onClick={() => onDecline(request._id)}
        >
          Decline
        </button>
      </div>
    </div>
  );
}

function RequestReviewComponent() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolved, setResolved] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get('/rides/requests');
        const pending = response.data.data.filter(
          r => r.status?.toLowerCase() === "pending"
        );
        setRequests(pending);
      } catch (error) {
        console.error("Failed to fetch requests", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  async function resolveRequest(id, newStatus) {
    try {
      await api.put(`/rides/requests/${id}/status`, { status: newStatus });

      setRequests((prev) =>
        prev.filter((r) => r._id !== id)
      );

      setResolved((prev) => [
        ...prev,
        { id, status: newStatus }
      ]);

    } catch (error) {
      console.error(`Failed to ${newStatus} request:`, error);
    }
  }

  const handleAccept = (id) => resolveRequest(id, "accepted");
  const handleDecline = (id) => resolveRequest(id, "declined");

  return (
    <div className={styles['review-page']}>
      
      <div className={styles['review-page_header']}>
        <Link to="/driver">
          <button className={styles['back-btn']}>
            <span className={styles['back-btn_arrow']}><ArrowLeft size={16} /></span>
            Back to My Rides
          </button>
        </Link>
        <div>
          <h1 className={styles['review-page_title']}>Ride Requests</h1>
          <p className={styles['review-page_subtitle']}>
            {loading ? "Loading requests..." : requests.length > 0
              ? `${requests.length} request${requests.length !== 1 ? "s" : ""} awaiting your decision`
              : "All caught up!"}
          </p>
        </div>
      </div>

      
      {resolved.length > 0 && (
        <div className={styles['resolved-summary']}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Check size={16} /> {resolved.filter((r) => r.status === "accepted").length} accepted
            &nbsp;·&nbsp;
            {resolved.filter((r) => r.status === "declined").length} declined
          </span>
        </div>
      )}

      
      {!loading && requests.length === 0 ? (
        <div className={styles['review-page_empty']}>
          <p className={styles['review-page_empty-icon']} style={{ display: 'flex', justifyContent: 'center' }}><PartyPopper size={48} /></p>
          <p>No pending requests.</p>
          <Link to="/driver">
            <button className={styles['post-ride-btn']}>Back to Dashboard</button>
          </Link>
        </div>
      ) : (
        <div className={styles['requests-list']}>
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