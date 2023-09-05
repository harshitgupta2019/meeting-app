import React, { useState } from 'react';
import axios from 'axios';
import './EditBooking.css'; // Import the CSS file

function EditBooking() {
  const [bookingId, setBookingId] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Clear previous messages
    setErrorMessage('');
    setSuccessMessage('');
    setBookingId(''); // Clear bookingId
    setNewTimeSlot(''); // Clear newTimeSlot

    // Update the booking with the new time slot
    axios.put(`https://meeting-app-gold.vercel.app/api/bookings/${bookingId}`, { newTimeSlot })
      .then((response) => {
        setSuccessMessage('Booking successfully updated.');
        console.log(response);
      })
      .catch((error) => {
        setErrorMessage('Error updating booking. Please check the booking ID, time slots and try again.');
        console.error(error);
      });
  };

  return (
    <div className="edit-booking-container"> 
      <h2>Edit Booking</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Booking ID:
          <input type="text" value={bookingId} onChange={(e) => setBookingId(e.target.value)} className="input-field" />
        </label>
        <label>
          New Time Slot:
          <input type="text" value={newTimeSlot} onChange={(e) => setNewTimeSlot(e.target.value)} className="input-field" />
        </label>
        <button type="submit" className="submit-button">Edit Booking</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
}

export default EditBooking;
