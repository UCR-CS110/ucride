import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "../../../utils/api";
import styles from "./NewRideForm.module.css";
import clsx from "clsx";

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
    if (
      values.departureLocation.trim() === values.destination.trim() &&
      values.departureLocation.trim() !== ""
    )
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
      await api.post("/rides", payload);
      navigate("/driver");
    } catch (error) {
      console.error("Failed to post ride", error);
      navigate("/driver");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles["new-ride-page"]}>
      <div className={styles["new-ride-card"]}>
        <div className={styles["new-ride-card_back"]}>
          <Link to="/driver">
            <button className={styles["back-btn"]}>
              <span className={styles["back-btn_arrow"]}>
                <ArrowLeft size={16} />
              </span>
              Back
            </button>
          </Link>
        </div>

        <h1 className={styles["new-ride-card_title"]}>Post a New Ride</h1>
        <p className={styles["new-ride-card_subtitle"]}>
          Fill in the details below to offer seats.
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className={styles["ride-form"]}
        >
          <div className={styles["ride-form_row"]}>
            <div
              className={clsx(
                styles["ride-form_field"],
                errors.date && styles["ride-form_field--error"],
              )}
            >
              <label htmlFor="date">Departure Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
              {errors.date && (
                <span className={styles["ride-form_error"]}>{errors.date}</span>
              )}
            </div>
            <div
              className={clsx(
                styles["ride-form_field"],
                errors.time && styles["ride-form_field--error"],
              )}
            >
              <label htmlFor="time">Departure Time</label>
              <input
                type="time"
                id="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                required
              />
              {errors.time && (
                <span className={styles["ride-form_error"]}>{errors.time}</span>
              )}
            </div>
          </div>

          <div
            className={clsx(
              styles["ride-form_field"],
              errors.departureLocation && styles["ride-form_field--error"],
            )}
          >
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
              <span className={styles["ride-form_error"]}>
                {errors.departureLocation}
              </span>
            )}
          </div>

          <div
            className={clsx(
              styles["ride-form_field"],
              errors.destination && styles["ride-form_field--error"],
            )}
          >
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
              <span className={styles["ride-form_error"]}>
                {errors.destination}
              </span>
            )}
          </div>
          
          <div className={styles["ride-form_row"]}>
            <div
              className={clsx(
                styles["ride-form_field"],
                errors.remainingSeats && styles["ride-form_field--error"],
              )}
            >
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
                <span className={styles["ride-form_error"]}>
                  {errors.remainingSeats}
                </span>
              )}
            </div>
            <div
              className={clsx(
                styles["ride-form_field"],
                errors.seatPrice && styles["ride-form_field--error"],
              )}
            >
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
                <span className={styles["ride-form_error"]}>
                  {errors.seatPrice}
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className={styles["ride-form_submit"]}
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
