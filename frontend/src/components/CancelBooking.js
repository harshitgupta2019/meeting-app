import React, { useState } from 'react';
import axios from 'axios';
import './CancelBooking.css'; // Import the CSS file

function CancelBooking() {
  const [bookingId, setBookingId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Clear previous messages
    setErrorMessage('');
    setSuccessMessage('');

    // Cancel the booking
    axios.delete(`http://localhost:3001/api/bookings/${bookingId}`)
      .then((res) => {
        setSuccessMessage('Booking canceled successfully.');
        console.log(res);
      })
      .catch((error) => {
        setErrorMessage('Error canceling booking. Please check the booking ID and try again.');
        console.error(error);
      });
  };

  return (
    <div className="cancel-booking-container"> 
      <h2>Cancel Booking</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Booking ID:
          <input
            type="text"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            className="input-field" 
          />
        </label>
        <button type="submit" className="submit-button">Cancel Booking</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
}

export default CancelBooking;
