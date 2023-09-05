import React from 'react'
import {Routes,Route} from 'react-router-dom'
import DisplayAvailableRooms from './components/DisplayAvailableRooms';
import BookRoom from './components/BookRoom';
import ViewBookings from './components/ViewBookings';
import EditBooking from './components/EditBooking';
import CancelBooking from './components/CancelBooking';
const AllRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<DisplayAvailableRooms/>} />
        <Route path="/book" element={<BookRoom/>} />
        <Route path="/view" element={<ViewBookings/>} />
        <Route path="/edit" element={<EditBooking/>} />
        <Route path="/cancel" element={<CancelBooking/>} />
      </Routes>
  )
}

export default AllRoutes
