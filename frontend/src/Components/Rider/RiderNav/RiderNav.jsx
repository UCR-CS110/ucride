import React from 'react'
import { Search, Car } from 'lucide-react'
import styles from './RiderNav.module.css'
import clsx from 'clsx'

function RiderNav({view, updateViewMode}) {

  const handleFindRidesClick = () => {
    updateViewMode('FindRides');
  }

  const handleMyRidesClick = () => {
    updateViewMode('MyRides');
  }

  return (
    <div className={styles['rider-nav-container']}>
      <button 
        className={clsx(styles['rider-button'], view === 'FindRides' && styles.active)} 
        onClick={handleFindRidesClick}
      >
        <Search width={20}/>
        <span>Find Rides</span>
      </button>
      <button
        className={clsx(styles['rider-button'], view === 'MyRides' && styles.active)} 
        onClick={handleMyRidesClick}
      >
        <Car width={24} />
        <span>My Rides</span>
      </button>
    </div>
  )
}

export default RiderNav
