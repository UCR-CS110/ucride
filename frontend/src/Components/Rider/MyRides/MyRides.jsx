import { useState, useEffect } from "react";
import styles from './MyRides.module.css';
import clsx from 'clsx';
import { Car, ArrowRight } from 'lucide-react';
import api from "../../../utils/api";

function MyRides() {
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

  const activeRides = rides.filter(
    ride => ride.status !== "completed"
  );

  const completedRides = rides.filter(
    ride => ride.status === "completed"
  );

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
              {activeRides.map((ride) => (
                <div key={ride._id} className={styles['my-ride-card']}>
                  <div>{ride.departureLocation} → {ride.destination}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {completedRides.length > 0 && (
          <>
            <h3>Completed Rides</h3>
            <div className={styles['rides-list']}>
              {completedRides.map((ride) => (
                <div key={ride._id} className={styles['my-ride-card']}>
                  <div>{ride.departureLocation} → {ride.destination}</div>

                  <button
                    disabled={ride.reviewed}
                    onClick={() => setReviewRide(ride)}
                  >
                    {ride.reviewed ? "Reviewed" : "Leave Review"}
                  </button>
                </div>
              ))}
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
                  style={{
                    fontSize: "20px",
                    color: star <= rating ? "gold" : "#ccc",
                    background: "none",
                    border: "none"
                  }}
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