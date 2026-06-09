import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star, Car, MessageSquare } from "lucide-react";
import api from "../../utils/api";
import styles from "./Profile.module.css";

function Profile({ overrideUserId }) {
  const params = useParams();
  const userId = overrideUserId || params.userId;

  const [user, setUser] = useState(null);

  const DEFAULT_IMAGE =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const profileImg =
    user?.profilePicture && user.profilePicture.trim()
      ? encodeURI(user.profilePicture)
      : DEFAULT_IMAGE;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/users/${userId}`);
        setUser(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
  }, [userId]);

  if (!user) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <img className={styles.profilePic} src={profileImg} alt={`${user.fName} ${user.lName}`} />
          <div className={styles.nameBlock}>
            <h1>{user.fName} {user.lName}</h1>
            <p>{user.role?.replace(/_/g, ' ')}</p>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.stats}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>
                <Star size={16} className={styles.statIcon} />
                {user.stats?.avgRating?.toFixed(1) || "0.0"}
              </div>
              <div className={styles.statLabel}>Avg Rating</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>
                <Car size={16} className={styles.statIcon} />
                {user.stats?.ridesGiven || 0}
              </div>
              <div className={styles.statLabel}>Rides Given</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>
                <MessageSquare size={16} className={styles.statIcon} />
                {user.stats?.reviewCount || 0}
              </div>
              <div className={styles.statLabel}>Reviews</div>
            </div>
          </div>

          {user.vehicle && (
            <div className={styles.vehicleCard}>
              <div className={styles.vehicleHeader}>
                <Car size={20} className={styles.vehicleIcon} />
                <span className={styles.vehicleTitle}>
                  {user.vehicle.vehicleMake} {user.vehicle.vehicleModel}
                </span>
              </div>
              <div className={styles.vehicleGrid}>
                <div className={styles.vehicleItem}>
                  <span className={styles.vehicleLabel}>License Plate</span>
                  <span className={styles.vehicleValue}>{user.vehicle.licensePlate}</span>
                </div>
                <div className={styles.vehicleItem}>
                  <span className={styles.vehicleLabel}>Color</span>
                  <span className={styles.vehicleValue}>{user.vehicle.vehicleColor}</span>
                </div>
              </div>
            </div>
          )}

          <div className={styles.sectionTitle}>Reviews</div>

          {user.reviews?.length ? (
            user.reviews.map((r) => (
              <div key={r._id} className={styles.review}>
                <strong>{r.reviewerId?.fName} {r.reviewerId?.lName}</strong>
                <p className={styles.reviewRating}>
                  <Star size={13} /> {r.rating}/5
                </p>
                <p>{r.content}</p>
              </div>
            ))
          ) : (
            <div className={styles.empty}>No reviews yet</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;