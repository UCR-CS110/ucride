import React, { useState } from "react";
import { Outlet } from "react-router-dom";

function Driver() {
    const [reviewCount, setReviewCount] = useState(1);

    return (
        <div>
            <>
            <Outlet context={{ reviewCount, setReviewCount }} />
            </>
        </div>
        
    )
}


export default Driver