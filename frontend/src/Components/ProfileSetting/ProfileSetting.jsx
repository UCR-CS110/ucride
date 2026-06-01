import { useState } from "react";
import styles from "./ProfileSetting.module.css";
import { useEffect } from "react";
import api from "../../utils/api";

function ProfileSetting() {
  const [activeTab, setActiveTab] = useState("profile");
  const [preview, setPreview] = useState(null);
  const DEFAULT_IMAGE ="https://cdn-icons-png.flaticon.com/512/149/149071.png";

  
  const [formData, setFormData] = useState({
    fName: "",
    lName: "",
    email: "",
    profilePicture: DEFAULT_IMAGE,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [driverData, setDriverData] = useState({
    vehicleMake: "",
    vehicleModel: "",
    vehicleColor: "",
    licensePlate: "",
  });

  
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    const formDataUpload = new FormData();
    formDataUpload.append("image", file);

    try {
      const res = await api.put(
        "/users/profile-picture",
        formDataUpload
      );

      const newPic = res.data.data.profilePicture;

      setFormData((prev) => ({
        ...prev,
        profilePicture: newPic,
      }));

 
      if (setUser) {
        setUser((prev) => ({
          ...prev,
          profilePicture: newPic,
        }));
      }

      window.location.reload(); 
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/profile");

        setFormData((prev) => ({
          ...prev,
          ...res.data.data,
          profilePicture:
            res.data.data.profilePicture || DEFAULT_IMAGE,
        }));

        setDriverData({
          vehicleMake: res.data.data.vehicle?.vehicleMake || "",
          vehicleModel: res.data.data.vehicle?.vehicleModel || "",
          vehicleColor: res.data.data.vehicle?.vehicleColor || "",
          licensePlate: res.data.data.vehicle?.licensePlate || "",
        });

      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, []);

  const handleSave = async () => {
    try {
      await api.put("/users/profile", formData);
      alert("Profile updated");
    } catch (err) {
      console.log(err);
    }
  };

  const handlePasswordChange = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      await api.put("/users/change-password", passwordData);

      alert("Password updated successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.log(err);
      alert("Password change failed");
    }
  };

  const handleDriverSave = async () => {
    try {
      const cleanedVehicle = Object.fromEntries(
        Object.entries(driverData).filter(([_, v]) => v !== "")
      );

      await api.put("/users/profile", {
        vehicle: cleanedVehicle,
      });

      alert("Driver info saved");
    } catch (err) {
      console.log(err);
    }
  };

  

  return (
    <div className={styles.container}>
      <h1>Profile Settings</h1>

      <div className={styles.content}>
     
        <div className={styles.sidebar}>
          <button
            className={`${styles.btn} ${
              activeTab === "profile" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>

          <button
            className={`${styles.btn} ${
              activeTab === "security" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("security")}
          >
            Password Change
          </button>

          <button
            className={`${styles.btn} ${
              activeTab === "driver" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("driver")}
          >
            Driver Settings
          </button>
        </div>

     
        <div className={styles.panel}>
          {activeTab === "profile" && (
            <>
              <h2>Profile Information</h2>

             
              <div className={styles.profilePicBox}>
                <img className={styles.profilePic}
                  src={
                    formData.profilePicture
                      ? encodeURI(formData.profilePicture)
                      : DEFAULT_IMAGE
                  }
                  alt="profile"
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              <input
                name="fName"
                value={formData.fName}
                onChange={(e) =>
                  setFormData({ ...formData, fName: e.target.value })
                }
              />

              <input
                name="lName"
                value={formData.lName}
                onChange={(e) =>
                  setFormData({ ...formData, lName: e.target.value })
                }
              />
              <input
                name="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <button onClick={handleSave} className={styles.saveBtn}>
                Save
              </button>
            </>
          )}

          {activeTab === "security" && (
            <>
              <h2>Password Change</h2>

              <input
                type="password"
                placeholder="Current Password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
              />

              <input
                type="password"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
              />

              <button onClick={handlePasswordChange} className={styles.saveBtn}>
                Update Password
              </button>
            </>
          )}

          {activeTab === "driver" && (
            <>
              <h2>Driver Settings</h2>

              <input
                placeholder="Vehicle Make"
                value={driverData.vehicleMake}
                onChange={(e) =>
                  setDriverData({ ...driverData, vehicleMake: e.target.value })
                }
              />

              <input
                placeholder="Vehicle Model"
                value={driverData.vehicleModel}
                onChange={(e) =>
                  setDriverData({ ...driverData, vehicleModel: e.target.value })
                }
              />

              <input
                placeholder="Vehicle Color"
                value={driverData.vehicleColor}
                onChange={(e) =>
                  setDriverData({ ...driverData, vehicleColor: e.target.value })
                }
              />

              <input
                placeholder="License Plate"
                value={driverData.licensePlate}
                onChange={(e) =>
                  setDriverData({ ...driverData, licensePlate: e.target.value })
                }
              />
            
              <button onClick={handleDriverSave} className={styles.saveBtn}>
                Save Vehicle Info
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileSetting;