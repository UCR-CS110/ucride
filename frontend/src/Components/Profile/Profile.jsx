import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

  if (!user) return <h2>Loading...</h2>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <img className={styles.profilePic} src={profileImg} />

          <div className={styles.nameBlock}>
            <h1>
              {user.fName} {user.lName}
            </h1>
            <p>{user.role}</p>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.stats}>
            <div className={styles.statCard}>
              ⭐ {user.stats?.avgRating?.toFixed(1) || "0.0"}
            </div>

            <div className={styles.statCard}>
              🚗 {user.stats?.ridesGiven || 0}
            </div>

            <div className={styles.statCard}>
              💬 {user.stats?.reviewCount || 0}
            </div>
          </div>

          {user.vehicle && (
            <div className={styles.vehicleCard}>
              <strong>{user.vehicle.vehicleMake} {user.vehicle.vehicleModel}</strong>
              <p><strong>License Plate: </strong>{user.vehicle.licensePlate}</p>
              <p><strong>Vehicle Color: </strong>{user.vehicle.vehicleColor}</p>
            </div>
          )}

          <div className={styles.sectionTitle}>Reviews</div>

          {user.reviews?.length ? (
            user.reviews.map((r) => (
              <div key={r._id} className={styles.review}>
                <strong>
                  {r.reviewerId?.fName} {r.reviewerId?.lName}
                </strong>
                <p>⭐ {r.rating}/5</p>
                <p>{r.content}</p>
              </div>
            ))
          ) : (
            <div>No reviews yet</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;