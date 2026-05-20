import React from 'react'
import { Search, Car } from 'lucide-react'
import './RiderNav.css'

function RiderNav({view, updateViewMode}) {

  const handleFindRidesClick = () => {
    updateViewMode('FindRides');
  }

  const handleMyRidesClick = () => {
    updateViewMode('MyRides');
  }

  return (
    <div className='rider-nav-container'>
      <button 
        className={`rider-button ${view === 'FindRides' ? 'active' : ''}`} 
        onClick={handleFindRidesClick}
      >
        <Search width={20}/>
        <span>Find Rides</span>
      </button>
      <button
        className={`rider-button ${view === 'MyRides' ? 'active' : ''}`} 
        onClick={handleMyRidesClick}
      >
        <Car width={24} />
        <span>My Rides</span>
      </button>
    </div>
  )
}

export default RiderNav
