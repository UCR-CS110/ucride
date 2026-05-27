import React, { useState } from "react";
import { Outlet } from "react-router-dom";

function Driver() {
    const [reviewCount, setReviewCount] = useState(1);

    return (
        <>
            <Outlet context={{ reviewCount, setReviewCount }} /> // this needs to be updated
        </>        
    )
}


export default Driver