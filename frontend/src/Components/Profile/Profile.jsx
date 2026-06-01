import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";
import styles from "./Profile.module.css";

function Profile() {
  const { userId } = useParams();

  const [user, setUser] = useState(null);

  const DEFAULT_IMAGE ="https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const profileImg = user?.profilePicture && user.profilePicture.trim() ? encodeURI(user.profilePicture) : DEFAULT_IMAGE;

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

  if (!user) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className={styles.container}>
        <div className={styles.card}>

            <div className={styles.header}>
            <img className={styles.profilePic} src={profileImg} />

            <div className={styles.nameBlock}>
                <h1>{user.fName} {user.lName}</h1>
                <p>{user.role}</p>
            </div>
            </div>

            <div className={styles.body}>

            <div className={styles.stats}>
                <div className={styles.statCard}>
                <div className={styles.statValue}>
                    ⭐ {user.avgRating?.toFixed(1) || "0.0"}
                </div>
                <div className={styles.statLabel}>Rating</div>
                </div>

                <div className={styles.statCard}>
                <div className={styles.statValue}>
                    🚗 {user.ridesGiven || 0}
                </div>
                <div className={styles.statLabel}>Rides</div>
                </div>

                <div className={styles.statCard}>
                <div className={styles.statValue}>
                    💬 {user.reviewCount || 0}
                </div>
                <div className={styles.statLabel}>Reviews</div>
                </div>
            </div>

            {user.vehicle && (
            <>
                <div className={styles.sectionTitle}>Vehicle Information</div>

                <div className={styles.vehicleCard}>
                <div className={styles.vehicleHeader}>
                    <div className={styles.vehicleIcon}>🚗</div>
                    <div className={styles.vehicleTitle}>
                    {user.vehicle.vehicleMake} {user.vehicle.vehicleModel}
                    </div>
                </div>

                <div className={styles.vehicleGrid}>
                    <div className={styles.vehicleItem}>
                    <span className={styles.vehicleLabel}>Color</span>
                    <span className={styles.vehicleValue}>
                        {user.vehicle.vehicleColor}
                    </span>
                    </div>

                    <div className={styles.vehicleItem}>
                    <span className={styles.vehicleLabel}>License Plate</span>
                    <span className={styles.vehicleValue}>
                        {user.vehicle.licensePlate}
                    </span>
                    </div>
                </div>
                </div>
            </>
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
                <div className={styles.empty}>No reviews yet</div>
            )}

            </div>
        </div>
    </div>
  );
}

export default Profile;