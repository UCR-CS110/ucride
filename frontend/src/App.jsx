import { useState } from 'react'
import './App.css'

import {Routes, Route, BrowserRouter, Navigate} from "react-router-dom"
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
import { AuthProvider } from './context/AuthContext.jsx';

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="home" element={<Home />} />
              <Route path="driver" element={<Driver />}>
                <Route index element={<DriverMyRides />} />
                <Route path="requestReview" element={<RequestReview />} />
              </Route>
              <Route path="createNewRide" element={<CreateNewRide />} />
              <Route path="admin" element={<Admin />} />
              <Route path="rider" element={<Rider />} />
              <Route path="signin" element={<Signin />} />
              <Route path="messages" element={<Messages />} />
              <Route path="register" element={<Register />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
