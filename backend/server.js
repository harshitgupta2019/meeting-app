const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors=require('cors');
const app = express();
const port = 3001; // You can change the port as needed

app.use(bodyParser.json());
app.use(cors());
// Read data from db.json
const dbFilePath = './db.json';

// Helper function to read data from db.json
const readDataFromDB = () => {
  try {
    const data = fs.readFileSync(dbFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading data from db.json:', err);
    return { rooms: [], bookings: [] };
  }
};

// Helper function to write data to db.json
const writeDataToDB = (data) => {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing data to db.json:', err);
  }
};
app.get('/',(req, res) => {
  res.send("Successful");
})
// Get a list of available meeting rooms
app.get('/api/rooms', (req, res) => {
  const data = readDataFromDB();
  res.json(data.rooms);
});

// Book a room
app.post('/api/bookings', (req, res) => {
  const { room, timeSlot } = req.body;
  const data = readDataFromDB();
  const selectedRoom = data.rooms.find((r) => r.name === room);

  if (!selectedRoom) {
    return res.status(400).json({ message: 'Invalid room selection' });
  }

  // Check if the time slot is available for the selected room
  if (!selectedRoom.availableTimeSlots.includes(timeSlot)) {
    return res.status(400).json({ message: 'Booking conflict: This time slot is unavailable' });
  }

  // Add the booking to the bookings array
  const newBooking = { id: data.bookings.length + 1, room, timeSlot };
  data.bookings.push(newBooking);
  
  // Remove the booked time slot from the available slots
  selectedRoom.availableTimeSlots = selectedRoom.availableTimeSlots.filter((slot) => slot !== timeSlot);
  writeDataToDB(data);
  return res.json({ message: 'Booking successful' });
});

// Add this route to your existing server.js file

// Validate a booking for a room and time slot
app.post('/api/validate-booking', (req, res) => {
  const { room, timeSlot } = req.body;
  const data = readDataFromDB();

  // Check if the room exists
  const selectedRoom = data.rooms.find((r) => r.name === room);
  console.log(room);
  if (!selectedRoom) {
    return res.status(400).json({ isValid: false, message: 'Invalid room selection' });
  }

  // Check if the time slot is available for the selected room
  if (!selectedRoom.availableTimeSlots.includes(timeSlot)) {
    return res.status(400).json({ isValid: false, message: 'Booking conflict: This time slot is unavailable' });
  }

  return res.json({ isValid: true });
});


app.get('/api/user-bookings', (req, res) => {

 
  const data = readDataFromDB();

  res.json(data.bookings);
});

// Add this route to your existing server.js file

// Edit a booking by ID
app.put('/api/bookings/:bookingId', (req, res) => {
  const { bookingId } = req.params;
  const { newTimeSlot } = req.body;
  const data = readDataFromDB();

  // Find the booking by ID
  const bookingIndex = data.bookings.findIndex((booking) => booking.id === parseInt(bookingId));

  if (bookingIndex === -1) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  // Check if the new time slot is already booked for the same room
  const conflictingBooking = data.bookings.find((booking) => {
    return (
      booking.room === data.bookings[bookingIndex].room &&
      booking.timeSlot === newTimeSlot
    );
  });

  if (conflictingBooking) {
    return res.status(400).json({ error: 'Time slot is already booked for this room' });
  }

  // Update the booking's time slot
  data.bookings[bookingIndex].timeSlot = newTimeSlot;

  // Save the updated data to db.json
  writeDataToDB(data);

  res.json({ message: 'Booking updated successfully' });
});

// Cancel a booking by ID
app.delete('/api/bookings/:bookingId', (req, res) => {
  const { bookingId } = req.params;
  const data = readDataFromDB();

  // Find the booking by ID
  const bookingIndex = data.bookings.findIndex((booking) => booking.id === parseInt(bookingId));

  if (bookingIndex === -1) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  // Get the booked room and time slot
  const bookedRoom = data.bookings[bookingIndex].room;
  const bookedTimeSlot = data.bookings[bookingIndex].timeSlot;

  // Remove the booking
  data.bookings.splice(bookingIndex, 1);

  // Find the room index
  const roomIndex = data.rooms.findIndex((room) => room.name === bookedRoom);

  if (roomIndex !== -1) {
    // Check if the canceled time slot is not already in availableTimeSlots
    if (!data.rooms[roomIndex].availableTimeSlots.includes(bookedTimeSlot)) {
      // Add the canceled time slot back to availableTimeSlots
      data.rooms[roomIndex].availableTimeSlots.push(bookedTimeSlot);
    }
  }

  // Save the updated data to db.json
  writeDataToDB(data);

  res.json({ message: 'Booking canceled successfully' });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
