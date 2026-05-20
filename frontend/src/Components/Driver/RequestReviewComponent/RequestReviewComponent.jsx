import React from "react";
import { useOutletContext } from "react-router-dom";
import "./RequestReviewComponent.css"

function RequestReviewComponent() {
    const { reviewCount, setReviewCount } = useOutletContext();

    const handleReview = () => {
        if (reviewCount > 0) {
            setReviewCount(reviewCount - 1);
        }
    };

    return (
        <div>
            <h1>Request Review Page</h1>

            <button onClick={handleReview}>
                Mark as Reviewed
            </button>
        </div>
    );
}

export default RequestReviewComponent;