import React, { useState } from "react";
import RiderNav from '../../Components/Rider/RiderNav/RiderNav';
import RidesFilter from '../../Components/Rider/RidesFilter/RidesFilter';
import RiderSearchFilter from '../../Components/Rider/RiderSearchFilter/RiderSearchFilter';
import styles from './Rider.module.css';

function Rider() {
    const [viewMode, setViewMode] = useState('FindRides');

    return (
        <div className={styles['rider-page']}>
            <RiderNav view={viewMode} updateViewMode={setViewMode} />
            <div className={styles['rider-content']}>
                {viewMode === 'FindRides' && <RiderSearchFilter />}
                <RidesFilter view={viewMode} />
            </div>
        </div>
    );
}

export default Rider;
