import React, { useState } from "react";
import RiderNav from '../../Components/Rider/RiderNav/RiderNav';
import RidesFilter from '../../Components/Rider/RidesFilter/RidesFilter';
import RiderSearchFilter from '../../Components/Rider/RiderSearchFilter/RiderSearchFilter';
import './Rider.css';

function Rider() {
    const [viewMode, setViewMode] = useState('FindRides'); // 'FindRides' || 'MyRides'

    return (
        <div className="rider-page">
            <RiderNav view={viewMode} updateViewMode={setViewMode} />
            <div className="rider-content">
                {viewMode === 'FindRides' && <RiderSearchFilter />}
                <RidesFilter view={viewMode} />
            </div>
        </div>
    );
}

export default Rider;
