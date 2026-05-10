import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import {Routes, Route, BrowserRouter, Navigate} from "react-router-dom"
import Layout from "./pages/Layout.jsx";
import Driver from "./pages/Driver.jsx";
import Admin from "./pages/Admin";
import Rider from "./pages/Rider";
import Signin from "./pages/Signin";
import Messages from "./pages/Messages";
import Register from "./pages/Register";
import Home from "./pages/Home";


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="driver" element={<Driver />} />
            <Route path="admin" element={<Admin />} />
            <Route path="rider" element={<Rider />} />
            <Route path="signin" element={<Signin />} />
            <Route path="messages" element={<Messages />} />
            <Route path="register" element={<Register />} />
          </Route>
        </Routes>
      </BrowserRouter>

      
    </>
  )
}

export default App
