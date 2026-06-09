import { useState } from 'react';
import { Calendar, Clock, ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import RideMap from './RideMap';
import styles from './RideCard.module.css';
import clsx from 'clsx';

const DEFAULT_IMAGE = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

function SeatDots({ remaining, total = 4 }) {
  return (
    <span className={styles['seat-dots']}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={clsx(styles.dot, i < remaining && styles['dot--filled'])} />
      ))}
      <span className={styles['seat-label']}>{remaining} left</span>
    </span>
  );
}

function RideCard({ ride, onRequest, requested }) {
  const [expanded, setExpanded] = useState(false);

  const d = new Date(ride.departureTime);
  const date = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const from = ride.departureLocation;
  const to   = ride.destination;

  return (
    <div className={styles['rider-ride-card']}>
      <div className={styles['card-body']}>
        <div className={styles['driver-col']}>
          <Link to={`/profile/${ride.driverId?._id}`} className={styles['driver-link']}>
            <img
              src={
                ride.driverId?.profilePicture?.trim()
                  ? encodeURI(ride.driverId.profilePicture)
                  : DEFAULT_IMAGE
              }
              alt={ride.driverId?.fName || "Driver"}
              className={styles['profile-pic']}
            />
            <div className={styles['driver-name']}>
              <span className={styles['driver-fname']}>{ride.driverId?.fName}</span>
              <span className={styles['driver-lname']}>{ride.driverId?.lName}</span>
            </div>
          </Link>
          <div className={styles['driver-rating']}>
            <span className={styles['rating-value']}>
              {ride.driverId?.avgRating != null ? ride.driverId.avgRating.toFixed(1) : "N/A"} ★
            </span>
          </div>
        </div>

        <div className={styles['card-divider']} />

        <div className={styles['rider-ride-details']}>
          <div className={styles['route-row']}>
            <span className={clsx(styles['location-badge'], styles['location-badge--from'])}>{from?.name?.split(',')[0]}</span>
            <ArrowRight className={styles['arrow-icon']} size={18} />
            <span className={clsx(styles['location-badge'], styles['location-badge--to'])}>{to?.name?.split(',')[0]}</span>
          </div>

          <div className={styles['meta-row']}>
            <span className={styles['meta-item']}>
              <Calendar size={14} color="var(--blue-bright)" strokeWidth={2} />
              {date}
            </span>
            <span className={styles['meta-item']}>
              <Clock size={14} color="var(--blue-bright)" strokeWidth={2} />
              {time}
            </span>
          </div>

          <SeatDots remaining={ride.remainingSeats} total={4} />
        </div>

        <div className={styles['price-col']}>
          <div className={styles['price-display']}>
            <span className={styles['price-amount']}>${ride.seatPrice.toFixed(0)}</span>
            <span className={styles['price-label']}>per seat</span>
          </div>
          <button
            className={clsx(styles['request-btn'], requested && styles['request-btn--done'])}
            onClick={() => onRequest(ride._id)}
            disabled={requested}
          >
            {requested ? "✓ Requested" : "Request"}
          </button>
        </div>
      </div>

      {from?.lat && to?.lat && (
        <>
          <button
            className={styles['map-toggle']}
            onClick={() => setExpanded((e) => !e)}
          >
            <ChevronDown
              className={clsx(styles['toggle-icon'], expanded && styles['toggle-icon--open'])}
              size={15}
            />
            {expanded ? 'Hide Route' : 'View Route'}
          </button>

          {expanded && (
            <div className={styles['map-section']}>
              <RideMap from={from} to={to} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default RideCard;
