import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import styles from "./Admin.module.css";
import {
  LayoutDashboard,
  Users,
  Car,
  Star,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import clsx from "clsx";

function Admin() {
  const [activeTab, setActiveTab] = useState("analytics");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rides, setRides] = useState([]);

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (tab) => {
    setLoading(true);
    setError("");
    try {
      if (tab === "analytics") {
        const res = await api.get("/admin/analytics");
        setAnalytics(res.data.data);
      } else if (tab === "users") {
        const res = await api.get("/admin/users");
        setUsers(res.data.data);
      } else if (tab === "reviews") {
        const res = await api.get("/admin/reviews");
        setReviews(res.data.data);
      } else if (tab === "rides") {
        const res = await api.get("/admin/rides");
        setRides(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDriver = async (userId, currentRole) => {
    try {
      const makeDriver = currentRole !== "verified_driver";
      await api.put(`/admin/users/${userId}/verify`, { makeDriver });
      fetchData("users");
    } catch (err) {
      alert("Failed to update driver status");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      fetchData("users");
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const handleModerateReview = async (reviewId, currentStatus) => {
    try {
      await api.put(`/admin/reviews/${reviewId}/moderate`, {
        isHidden: !currentStatus,
      });
      fetchData("reviews");
    } catch (err) {
      alert("Failed to update review visibility");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await api.delete(`/admin/reviews/${reviewId}`);
      fetchData("reviews");
    } catch (err) {
      alert("Failed to delete review");
    }
  };

  const renderAnalytics = () => {
    if (!analytics) return <p>Loading analytics...</p>;
    return (
      <div>
        <div className={styles["analytics-grid"]}>
          <div className={styles["stat-card"]}>
            <Users
              size={32}
              color="var(--blue-deep)"
              style={{ marginBottom: "10px" }}
            />
            <h3>Total Users</h3>
            <p>{analytics.totalUsers}</p>
          </div>
          <div className={styles["stat-card"]}>
            <Car
              size={32}
              color="var(--blue-deep)"
              style={{ marginBottom: "10px" }}
            />
            <h3>Total Rides</h3>
            <p>{analytics.totalRides}</p>
          </div>
        </div>
        <div className={styles["analytics-lists"]}>
          <div className={styles["list-card"]}>
            <h3>Top Routes</h3>
            <ul>
              {analytics.topRoutes.map((route, index) => (
                <li key={index}>
                  <span>{route.route}</span>
                  <strong>{route.count} rides</strong>
                </li>
              ))}
              {analytics.topRoutes.length === 0 && (
                <li>No route data available.</li>
              )}
            </ul>
          </div>
          <div className={styles["list-card"]}>
            <h3>Top Drivers</h3>
            <ul>
              {analytics.topDrivers.map((driver) => (
                <li key={driver._id}>
                  <span>
                    {driver.fName} {driver.lName}
                  </span>
                  <strong
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    <Star size={14} fill="black" color="black" />
                    {driver.avgRating?.toFixed(1) || "0.0"}
                  </strong>
                </li>
              ))}
              {analytics.topDrivers.length === 0 && (
                <li>No driver data available.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderUsers = () => {
    return (
      <div className={styles["data-table-container"]}>
        <table className={styles["admin-table"]}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  {user.fName} {user.lName}
                </td>
                <td>{user.email}</td>
                <td>
                  <span style={{ textTransform: "capitalize" }}>
                    {user.role}
                  </span>
                </td>
                <td>
                  {user.role !== "admin" && (
                    <span
                      className={clsx(
                        styles["status-badge"],
                        user.role === "verified_driver"
                          ? styles["status-verified"]
                          : styles["status-unverified"],
                      )}
                    >
                      {user.role === "verified_driver" ? "Verified Driver" : "Standard User"}
                    </span>
                  )}
                </td>
                <td>
                  {user.avgRating ? (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      <Star size={14} fill="black" color="black" />
                      {user.avgRating.toFixed(1)}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "center",
                    }}
                  >
                    {user.role !== "admin" && (
                      <button
                        className={clsx(
                          styles["action-btn"],
                          user.role === "verified_driver"
                            ? styles["btn-unverify"]
                            : styles["btn-verify"],
                        )}
                        onClick={() =>
                          handleVerifyDriver(user._id, user.role)
                        }
                        title={
                          user.role === "verified_driver"
                            ? "Revoke Driver Status"
                            : "Promote to Verified Driver"
                        }
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {user.role === "verified_driver" ? (
                          <XCircle size={16} />
                        ) : (
                          <CheckCircle size={16} />
                        )}
                      </button>
                    )}
                    <button
                      className={clsx(
                        styles["action-btn"],
                        styles["btn-delete"],
                      )}
                      onClick={() => handleDeleteUser(user._id)}
                      title="Delete User"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && !loading && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const renderReviews = () => {
    return (
      <div className={styles["data-table-container"]}>
        <table className={styles["admin-table"]}>
          <thead>
            <tr>
              <th>Reviewer</th>
              <th>Reviewee</th>
              <th>Rating</th>
              <th>Content</th>
              <th>Visibility</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review._id}>
                <td>
                  {review.reviewerId
                    ? `${review.reviewerId.fName} ${review.reviewerId.lName}`
                    : "Unknown"}
                </td>
                <td>
                  {review.revieweeId
                    ? `${review.revieweeId.fName} ${review.revieweeId.lName}`
                    : "Unknown"}
                </td>
                <td>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    <Star size={14} fill="black" color="black" />
                    {review.rating}
                  </span>
                </td>
                <td>{review.content || "-"}</td>
                <td>
                  <span
                    className={clsx(
                      styles["status-badge"],
                      review.isHidden
                        ? styles["status-hidden"]
                        : styles["status-visible"],
                    )}
                  >
                    {review.isHidden ? "Hidden" : "Visible"}
                  </span>
                </td>
                <td>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "center",
                    }}
                  >
                    <button
                      className={clsx(
                        styles["action-btn"],
                        styles["btn-moderate"],
                      )}
                      onClick={() =>
                        handleModerateReview(review._id, review.isHidden)
                      }
                      title={review.isHidden ? "Unhide" : "Hide"}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {review.isHidden ? (
                        <Eye size={16} />
                      ) : (
                        <EyeOff size={16} />
                      )}
                    </button>
                    <button
                      className={clsx(
                        styles["action-btn"],
                        styles["btn-delete"],
                      )}
                      onClick={() => handleDeleteReview(review._id)}
                      title="Delete Review"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && !loading && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No reviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const renderRides = () => {
    return (
      <div className={styles["data-table-container"]}>
        <table className={styles["admin-table"]}>
          <thead>
            <tr>
              <th>Driver</th>
              <th>Route</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {rides.map((ride) => (
              <tr key={ride._id}>
                <td>
                  {ride.driverId
                    ? `${ride.driverId.fName} ${ride.driverId.lName}`
                    : "Unknown"}
                </td>
                <td>
                  {ride.departureLocation?.name?.split(',')[0]} → {ride.destination?.name?.split(',')[0]}
                </td>
                <td>{new Date(ride.departureTime).toLocaleString()}</td>
                <td>
                  <span
                    className={clsx(
                      styles["status-badge"],
                      styles[`status-${ride.status}`],
                    )}
                  >
                    {ride.status.toUpperCase()}
                  </span>
                </td>
                <td>${ride.seatPrice}</td>
              </tr>
            ))}
            {rides.length === 0 && !loading && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No rides found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className={styles["admin-container"]}>

      <div className={styles["admin-tabs"]}>
        <button
          className={clsx(
            styles["tab-btn"],
            activeTab === "analytics" && styles.active,
          )}
          onClick={() => setActiveTab("analytics")}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <LayoutDashboard size={20} /> Analytics
        </button>
        <button
          className={clsx(
            styles["tab-btn"],
            activeTab === "users" && styles.active,
          )}
          onClick={() => setActiveTab("users")}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Users size={20} /> Users
        </button>
        <button
          className={clsx(
            styles["tab-btn"],
            activeTab === "rides" && styles.active,
          )}
          onClick={() => setActiveTab("rides")}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Car size={20} /> Rides
        </button>
        <button
          className={clsx(
            styles["tab-btn"],
            activeTab === "reviews" && styles.active,
          )}
          onClick={() => setActiveTab("reviews")}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Star size={20} /> Reviews
        </button>
      </div>

      {error && (
        <div
          className={styles["error-message"]}
          style={{ color: "red", marginBottom: "1rem" }}
        >
          {error}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>
      )}

      {!loading && (
        <div className={styles["tab-content"]}>
          {activeTab === "analytics" && renderAnalytics()}
          {activeTab === "users" && renderUsers()}
          {activeTab === "rides" && renderRides()}
          {activeTab === "reviews" && renderReviews()}
        </div>
      )}
    </div>
  );
}

export default Admin;
