import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import {Routes, Route, BrowserRouter, Navigate} from "react-router-dom"
import Layout from "./pages/Layout";
import Driver from "./pages/Driver/Driver";
import Admin from "./pages/Admin/Admin";
import Rider from "./pages/Rider/Rider";
import Signin from "./pages/Signin/Signin";
import Messages from "./pages/Messages/Messages";
import Register from "./pages/Register/Register";
import Profile from "./pages/Profile/Profile";
import Alert from "./pages/Alert/Alert";
import CreateNewRide from "./pages/CreateNewRide/CreateNewRide";
import Home from "./pages/Home/Home";
import RequestReview from "./pages/RequestReview/RequestReview";
import DriverMyRides from "./Components/DriverMyRides/DriverMyRides";


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="driver" element={<Driver />}>
              <Route index element={<DriverMyRides />} />
              <Route path="requestReview" element={<RequestReview />} />
          </Route>
            <Route path="admin" element={<Admin />} />
            <Route path="rider" element={<Rider />} />
            <Route path="signin" element={<Signin />} />
            <Route path="messages" element={<Messages />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<Profile />} />
            <Route path="alert" element={<Alert />} />
            <Route path="createNewRide" element={<CreateNewRide />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
