import React, { useState } from 'react';
import './Navbar.css'; // Import your CSS file

const Navbar = () => {
  

  return (
    <nav className="navbar">
        <div className="navbar-logo">
          <a href="/">Meeting App</a>
        </div>
      <div className="navbar-container">
        <input type='checkbox' class="toggle-menu"/>
        <div className="hamburger"></div>
        <ul className="navbar-links">
          <li><a href="/">Available Rooms</a></li>
          <li><a href="/book">Book a Room</a></li>
          <li><a href="/view">View Bookings</a></li>
          <li><a href="/edit">Edit Booking</a></li>
          <li><a href="/cancel">Cancel Booking</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
