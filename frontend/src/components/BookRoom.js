import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BookRoom.css'; // Import the CSS file

function BookRoom() {
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [bookingStatus, setBookingStatus] = useState('');

  useEffect(() => {
    // Fetch available rooms data from your backend
    axios.get('https://meeting-app-gold.vercel.app/api/rooms')
      .then((response) => {
        setRooms(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleRoomChange = (e) => {
    setRoom(e.target.value);
  };

  const handleTimeSlotChange = (e) => {
    setTimeSlot(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate booking with the backend
    axios.post('https://meeting-app-gold.vercel.app/api/validate-booking', { room, timeSlot })
      .then((response) => {
        if (response.data.isValid) {
          // If validation passes, proceed to create the booking
          axios.post('https://meeting-app-gold.vercel.app/api/bookings', { room, timeSlot })
            .then(() => {
              // Handle successful booking
              setBookingStatus('Booking successful');
              setErrorMessage('');
              // Update the room's available time slots
              updateAvailableTimeSlots(room, timeSlot);
            })
            .catch((error) => {
              setBookingStatus('');
              setErrorMessage('Booking conflict: This room is already booked for the selected time slot.');
              console.error(error);
            });
        } else {
          // If validation fails, display an error message
          setBookingStatus('');
          setErrorMessage('Booking conflict: This room is already booked for the selected time slot.');
        }
      })
      .catch((error) => {
        setBookingStatus('');
        setErrorMessage('Booking conflict: This slot is not available.');
        console.error(error);
      });
  };

  const updateAvailableTimeSlots = (selectedRoom, selectedTimeSlot) => {
    // Update the available time slots for the selected room
    setRooms((prevRooms) =>
      prevRooms.map((roomItem) => {
        if (roomItem.name === selectedRoom) {
          return {
            ...roomItem,
            availableTimeSlots: roomItem.availableTimeSlots.filter(
              (slot) => slot !== selectedTimeSlot
            ),
          };
        }
        return roomItem;
      })
    );
  };

  return (
    <div className="book-room-container">
      <h2 className="book-room-heading">Book a Meeting Room</h2>
      <form onSubmit={handleSubmit} className="book-room-form">
        <label className="input-label">
          Room:
          <select value={room} onChange={handleRoomChange} className="input-field">
            <option value="">Select a room</option>
            {rooms.map((roomItem) => (
              <option key={roomItem.id} value={roomItem.name}>
                {roomItem.name}
              </option>
            ))}
          </select>
        </label>
        <label className="input-label">
          Time Slot:
          <input
            type="text"
            value={timeSlot}
            onChange={handleTimeSlotChange}
            placeholder="Enter time slot (e.g., 9:00-9:30)"
            className="input-field"
          />
        </label>
        <button type="submit" className="submit-button">
          Book Room
        </button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {bookingStatus && <p className="booking-status">{bookingStatus}</p>}
      </form>
      <div className="available-rooms">
        <h3>Available Rooms and Time Slots:</h3>
        <ul className="room-list">
          {rooms.map((roomItem) => (
            <li key={roomItem.id} className="room-item">
              <h4>{roomItem.name}</h4>
              <ul className="time-slot-list">
                {roomItem.availableTimeSlots.map((slot) => (
                  <li key={slot} className="time-slot-item">
                    {slot}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BookRoom;
