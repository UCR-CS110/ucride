import React, { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { ArrowRight, Clock, Users, Banknote, ClipboardList, Plus } from "lucide-react";
import api from "../../../utils/api";
import { useAuth } from "../../../context/useAuth";
import styles from "./DriverMyRides.module.css";
import clsx from "clsx";

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

function RideCard({ ride, onEdit, onDelete, onStatusChange }) {
  return (
    <div className={clsx(styles['ride-card'], styles[`ride-card--${ride.status}`])}>
      <div className={styles['ride-card_route']}>
        <div className={styles['ride-card_location']}>
          <span className={styles['ride-card_place']}>{ride.departureLocation?.name?.split(',')[0]}</span>
        </div>
        <div className={styles['ride-card_arrow']}><ArrowRight size={16} /></div>
        <div className={styles['ride-card_location']}>
          <span className={styles['ride-card_place']}>{ride.destination?.name?.split(',')[0]}</span>
        </div>
      </div>

      <div className={styles['ride-card_meta']}>
        <div className={styles['ride-card_meta-item']}>
          <span className={styles['ride-card_meta-icon']}><Clock size={16} /></span>
          <span>{formatDepartureTime(ride.departureTime)}</span>
        </div>
        <div className={styles['ride-card_meta-item']}>
          <span className={styles['ride-card_meta-icon']}><Users size={16} /></span>
          <span>{ride.remainingSeats} seat{ride.remainingSeats !== 1 ? "s" : ""} left</span>
        </div>
        <div className={styles['ride-card_meta-item']}>
          <span className={styles['ride-card_meta-icon']}><Banknote size={16} /></span>
          <span>${ride.seatPrice.toFixed(2)} / seat</span>
        </div>
      </div>

      <div className={styles['ride-card_footer']}>
        <select 
          className={clsx(styles['ride-card_status'], styles[`ride-card_status--${ride.status}`])}
          value={ride.status}
          onChange={(e) => onStatusChange(ride._id, e.target.value)}
          style={{ border: 'none', outline: 'none', cursor: 'pointer' }}
        >
          {Object.entries(STATUS_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
        <div className={styles['ride-card_actions']}>
          <button className={clsx(styles['ride-card_btn'], styles['ride-card_btn--edit'])} onClick={() => onEdit(ride._id, ride.seatPrice)}>Edit Price</button>
          <button className={clsx(styles['ride-card_btn'], styles['ride-card_btn--delete'])} onClick={() => onDelete(ride._id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function DriverMyRides() {
  const { reviewCount } = useOutletContext();
  const { user } = useAuth();
  const canPostRides = user?.role === 'verified_driver' || user?.role === 'admin';
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRides = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const response = await api.get('/rides', {
          params: { driverId: user._id }
        });
        setRides(response.data.data);
      } catch (error) {
        console.error("Failed to fetch my rides:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyRides();
  }, [user]);

  const handleEdit = async (id, currentPrice) => {
    const newPrice = window.prompt("Enter new seat price:", currentPrice);
    if (newPrice !== null && !isNaN(Number(newPrice))) {
      try {
        await api.put(`/rides/${id}`, { seatPrice: Number(newPrice) });
        setRides(prev => prev.map(r => r._id === id ? { ...r, seatPrice: Number(newPrice) } : r));
      } catch (error) {
        console.error("Failed to update ride:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ride?")) return;
    try {
      await api.delete(`/rides/${id}`);
      setRides(prev => prev.filter(r => r._id !== id));
    } catch (error) {
      console.error("Failed to delete ride:", error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/rides/${id}/status`, { status: newStatus });
      setRides(prev => prev.map(r => r._id === id ? { ...r, status: newStatus } : r));
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const openRides = rides.filter((r) => r.status === "open").length;

  return (
    <div className={styles['my-rides-page']}>
      <div className={styles['my-rides-header']}>
        <div className={styles['my-rides-header_text']}>
          <h1 className={styles['my-rides-header_title']}>My Rides</h1>
          <p className={styles['my-rides-header_subtitle']}>
            Manage your offerings and requests
          </p>
        </div>
        {canPostRides ? (
          <Link to="/createNewRide">
            <button className={styles['post-ride-btn']}><Plus size={16} /> Post New Ride</button>
          </Link>
        ) : (
          <span className={styles['unverified-notice']}>Get driver verification to post rides</span>
        )}
      </div>

      <div className={styles['my-rides-stats']}>
        <div className={styles['stat-card']}>
          <span className={styles['stat-card_value']}>{rides.length}</span>
          <span className={styles['stat-card_label']}>Total Rides</span>
        </div>
        <div className={styles['stat-card']}>
          <span className={styles['stat-card_value']}>{openRides}</span>
          <span className={styles['stat-card_label']}>Open</span>
        </div>
        <div className={clsx(styles['stat-card'], styles['stat-card--alert'])}>
          <span className={styles['stat-card_value']}>{reviewCount}</span>
          <span className={styles['stat-card_label']}>Pending Reviews</span>
        </div>
      </div>

      {reviewCount > 0 && (
        <div className={styles['review-banner']}>
          <div className={styles['review-banner_text']}>
            <span className={styles['review-banner_icon']} style={{ display: 'inline-flex', alignItems: 'center' }}><ClipboardList size={24} /></span>
            <span>
              You have <strong>{reviewCount}</strong> ride request
              {reviewCount !== 1 ? "s" : ""} waiting for your review.
            </span>
          </div>
          <Link to="/driver/requestReview">
            <button className={styles['review-banner_btn']}>Review Requests</button>
          </Link>
        </div>
      )}

      <div className={styles['rides-section']}>
        <h2 className={styles['rides-section_title']}>Your Posted Rides</h2>
        {loading ? (
          <div className={styles['rides-empty']}>Loading your rides...</div>
        ) : rides.length === 0 ? (
          <div className={styles['rides-empty']}>
            <p>You haven't posted any rides yet.</p>
            {canPostRides && (
              <Link to="/createNewRide">
                <button className={styles['post-ride-btn']}>Post Your First Ride</button>
              </Link>
            )}
          </div>
        ) : (
          <div className={styles['rides-grid']}>
            {rides.map((ride) => (
              <RideCard 
                key={ride._id} 
                ride={ride} 
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DriverMyRides;