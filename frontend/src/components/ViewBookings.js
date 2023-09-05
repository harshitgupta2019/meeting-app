import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewBookings.css'; // Import the CSS file

function ViewBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/user-bookings')
      .then((response) => {
        setBookings(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="view-bookings-container"> 
      <h2>Your Bookings</h2>
      <ul className="booking-list"> 
        {bookings.map((booking) => (
          <li key={booking.id} className="booking-item"> 
            <p>Booking ID: {booking.id}</p>
            <p>Room: {booking.room}</p>
            <p>Time Slot: {booking.timeSlot}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewBookings;
