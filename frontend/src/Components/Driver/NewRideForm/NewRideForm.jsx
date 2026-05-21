import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./NewRideForm.css";

const INITIAL_FORM = {
  date: "",
  time: "",
  departureLocation: "",
  destination: "",
  remainingSeats: "",
  seatPrice: "",
};

function NewRideForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  function validate(values) {
    const errs = {};
    if (!values.date) errs.date = "Please select a date.";
    else if (new Date(values.date) < new Date().setHours(0, 0, 0, 0))
      errs.date = "Date must be today or in the future.";
    if (!values.time) errs.time = "Please select a time.";
    if (!values.departureLocation.trim())
      errs.departureLocation = "Departure location is required.";
    if (!values.destination.trim())
      errs.destination = "Destination is required.";
    if (values.departureLocation.trim() === values.destination.trim() &&
      values.departureLocation.trim() !== "")
      errs.destination = "Destination must differ from departure.";
    if (!values.remainingSeats || Number(values.remainingSeats) < 1)
      errs.remainingSeats = "At least 1 seat is required.";
    if (values.seatPrice === "" || Number(values.seatPrice) < 0)
      errs.seatPrice = "Price must be 0 or greater.";
    return errs;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);

    const payload = {
      departureLocation: form.departureLocation.trim(),
      destination: form.destination.trim(),
      departureTime: new Date(`${form.date}T${form.time}`).toISOString(),
      remainingSeats: Number(form.remainingSeats),
      seatPrice: Number(form.seatPrice),
      status: "open",
    };

    try {
      const res = await fetch("/postNewRide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Server error");
      navigate("/driver");
    } catch {
      // For demo purposes, just navigate back
      navigate("/driver");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="new-ride-page">
      <div className="new-ride-card">
        {/* Back */}
        <div className="new-ride-card_back">
          <Link to="/driver">
            <button className="back-btn">
              <span className="back-btn_arrow"><ArrowLeft size={16} /></span>
              Back
            </button>
          </Link>
        </div>

        <h1 className="new-ride-card_title">Post a New Ride</h1>
        <p className="new-ride-card_subtitle">
          Fill in the details below to offer seats to fellow Highlanders.
        </p>

        <form onSubmit={handleSubmit} noValidate className="ride-form">
          {/* Date & Time */}
          <div className="ride-form_row">
            <div className={`ride-form_field ${errors.date ? "ride-form_field--error" : ""}`}>
              <label htmlFor="date">Departure Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
              {errors.date && <span className="ride-form_error">{errors.date}</span>}
            </div>
            <div className={`ride-form_field ${errors.time ? "ride-form_field--error" : ""}`}>
              <label htmlFor="time">Departure Time</label>
              <input
                type="time"
                id="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                required
              />
              {errors.time && <span className="ride-form_error">{errors.time}</span>}
            </div>
          </div>

          {/* From */}
          <div className={`ride-form_field ${errors.departureLocation ? "ride-form_field--error" : ""}`}>
            <label htmlFor="departureLocation">From</label>
            <input
              type="text"
              id="departureLocation"
              name="departureLocation"
              value={form.departureLocation}
              onChange={handleChange}
              placeholder="e.g. UC Riverside"
              required
            />
            {errors.departureLocation && (
              <span className="ride-form_error">{errors.departureLocation}</span>
            )}
          </div>

          {/* To */}
          <div className={`ride-form_field ${errors.destination ? "ride-form_field--error" : ""}`}>
            <label htmlFor="destination">To</label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={form.destination}
              onChange={handleChange}
              placeholder="e.g. Los Angeles, CA"
              required
            />
            {errors.destination && (
              <span className="ride-form_error">{errors.destination}</span>
            )}
          </div>

          {/* Seats & Price */}
          <div className="ride-form_row">
            <div className={`ride-form_field ${errors.remainingSeats ? "ride-form_field--error" : ""}`}>
              <label htmlFor="remainingSeats">Available Seats</label>
              <input
                type="number"
                id="remainingSeats"
                name="remainingSeats"
                value={form.remainingSeats}
                onChange={handleChange}
                placeholder="1"
                min="1"
                required
              />
              {errors.remainingSeats && (
                <span className="ride-form_error">{errors.remainingSeats}</span>
              )}
            </div>
            <div className={`ride-form_field ${errors.seatPrice ? "ride-form_field--error" : ""}`}>
              <label htmlFor="seatPrice">Price per Seat ($)</label>
              <input
                type="number"
                id="seatPrice"
                name="seatPrice"
                value={form.seatPrice}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
              {errors.seatPrice && (
                <span className="ride-form_error">{errors.seatPrice}</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="ride-form_submit"
            disabled={submitting}
          >
            {submitting ? "Posting…" : "Post Ride"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewRideForm;