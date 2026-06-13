import { useState } from "react";
import "./App.css";

import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Layout from "./pages/Layout.jsx";
import Driver from "./pages/Driver/Driver.jsx";
import DriverMyRides from "./Components/Driver/DriverMyRides/DriverMyRides.jsx";
import CreateNewRide from "./pages/CreateNewRide/CreateNewRide.jsx";
import RequestReview from "./pages/RequestReview/RequestReview.jsx";
import Admin from "./pages/Admin/Admin.jsx";
import Rider from "./pages/Rider/Rider.jsx";
import Signin from "./pages/Signin/Signin.jsx";
import Messages from "./pages/Messages/Messages.jsx";
import Register from "./pages/Register/Register.jsx";
import Home from "./pages/Home/Home.jsx";
import ProfileSettingPage from "./pages/ProfileSetting/ProfileSetting.jsx";
import ProfilePage from "./pages/Profile/Profile.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute.jsx";

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="home" element={<Home />} />
              <Route
                path="driver"
                element={
                  <ProtectedRoute>
                    <Driver />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DriverMyRides />} />
                <Route path="requestReview" element={<RequestReview />} />
              </Route>
              <Route
                path="createNewRide"
                element={
                  <ProtectedRoute allowedRoles={["verified_driver", "admin"]}>
                    <CreateNewRide />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="rider"
                element={
                  <ProtectedRoute>
                    <Rider />
                  </ProtectedRoute>
                }
              />
              <Route
                path="messages"
                element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                }
              />

              <Route
                path="profileSetting"
                element={
                  <ProtectedRoute>
                    <ProfileSettingPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile/:userId"
                element={<ProfilePage />}
              />
           
             
              <Route path="signin" element={<Signin />} />
              <Route path="register" element={<Register />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
