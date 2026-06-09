import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from './MyRides.module.css';
import clsx from 'clsx';
import { Car, ArrowRight, MessageSquare } from 'lucide-react';
import api from "../../../utils/api";
import { useAuth } from "../../../context/useAuth";

const STATUS_LABEL = {
  pending:    "Pending",
  accepted:   "Accepted",
  inprogress: "In Progress",
  declined:   "Declined",
};

function MyRides() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [rides, setRides] = useState([]);
  const [reviewRide, setReviewRide] = useState(null);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await api.get('/rides/my-rides');
        setRides(response.data.data);
      } catch (error) {
        console.error("Failed to fetch rides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  const activeRides = rides.filter(ride => ride.status !== "completed");
  const completedRides = rides.filter(ride => ride.status === "completed");

  return (
    <div className={styles['my-rides']}>
      {loading ? (
        <div className={styles['empty-state']}>Loading your rides...</div>
      ) : rides.length === 0 ? (
        <div className={styles['empty-state']}>
          <Car size={48} />
          <p>No rides found.</p>
        </div>
      ) : (
        <>
          {activeRides.length > 0 && (
            <>
              <h3>Active Rides</h3>
              <div className={styles['rides-list']}>
                {activeRides.map((ride) => {
                  const d = new Date(ride.departureTime);
                  const myRequest = ride.requests?.find(
                    r => r.userId?.toString() === user?._id?.toString()
                  );
                  return (
                    <div key={ride._id} className={styles['my-ride-card']}>
                      <div className={styles['my-ride-info']}>
                        <div className={styles['my-ride-route']}>
                          {ride.departureLocation?.name?.split(',')[0]} <ArrowRight className={styles['arrow-icon']} size={18} /> {ride.destination?.name?.split(',')[0]}
                        </div>
                        <div className={styles['my-ride-time']}>
                          {d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} at{" "}
                          {d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                      <div className={styles['my-ride-actions']}>
                        {myRequest && (
                          <span className={clsx(styles['requested-badge'], styles[`status-${myRequest.status}`])}>
                            {STATUS_LABEL[myRequest.status] ?? myRequest.status}
                          </span>
                        )}
                        {myRequest?.status === "accepted" && (
                          <Link to="/messages" state={{ rideId: ride._id }}>
                            <button className={styles['chat-btn']}>
                              <MessageSquare size={14} /> Group Chat
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {completedRides.length > 0 && (
            <>
              <h3>Completed Rides</h3>
              <div className={styles['rides-list']}>
                {completedRides.map((ride) => {
                  const d = new Date(ride.departureTime);
                  const myRequest = ride.requests?.find(
                    r => r.userId?.toString() === user?._id?.toString()
                  );
                  const wasAccepted = myRequest?.status === "accepted";
                  return (
                    <div key={ride._id} className={styles['my-ride-card']}>
                      <div className={styles['my-ride-info']}>
                        <div className={styles['my-ride-route']}>
                          {ride.departureLocation?.name?.split(',')[0]} <ArrowRight className={styles['arrow-icon']} size={18} /> {ride.destination?.name?.split(',')[0]}
                        </div>
                        <div className={styles['my-ride-time']}>
                          {d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} at{" "}
                          {d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                      <div className={styles['my-ride-actions']}>
                        {wasAccepted && (
                          <Link to="/messages" state={{ rideId: ride._id }}>
                            <button className={styles['chat-btn']}>
                              <MessageSquare size={14} /> Group Chat
                            </button>
                          </Link>
                        )}
                        {wasAccepted && (
                          <button
                            disabled={ride.reviewed}
                            onClick={() => setReviewRide(ride)}
                          >
                            {ride.reviewed ? "Reviewed" : "Leave Review"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}

      {reviewRide && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Review Driver</h3>

            <p>
              {reviewRide.driverId?.fName} {reviewRide.driverId?.lName}
            </p>

            <div>
              {[1,2,3,4,5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={star <= rating ? styles.starActive : styles.star}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your review..."
            />

            <div>
              <button
                onClick={async () => {
                  try {
                    await api.post("/reviews", {
                      rideId: reviewRide._id,
                      revieweeId: reviewRide.driverId?._id,
                      rating: Number(rating),
                      content: content?.trim()
                    });

                    setReviewRide(null);
                    setRating(5);
                    setContent("");
                  } catch (err) {
                    const msg = err.response?.data?.message;

                    if (msg?.includes("already reviewed")) {
                      alert("You already reviewed this driver for this ride.");
                      setReviewRide(null);
                      return;
                    }

                    console.error(err);
                    alert("Failed to submit review");
                  }
                }}
              >
                Submit
              </button>

              <button onClick={() => setReviewRide(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyRides;
