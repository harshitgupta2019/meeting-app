import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DisplayAvailableRooms.css'; // Import the CSS file

function DisplayAvailableRooms() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Fetch available rooms data from your backend
    axios.get('http://localhost:3001/api/rooms')
      .then((response) => {
        setRooms(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="available-rooms-container">
      <h2>Available Meeting Rooms with time Slots</h2>
      <ul className="room-list">
        {rooms.map((room) => (
          <li key={room.id} className="room-item">
            <h3>{room.name}</h3>
            {room.availableTimeSlots.length > 0 ? (
              <ul className="time-slot-list">
                {room.availableTimeSlots.map((timeSlot) => (
                  <li key={timeSlot} className="time-slot-item">
                    {timeSlot}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No available time slots for this room</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DisplayAvailableRooms;
