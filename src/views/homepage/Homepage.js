import AppContext from '../../context/AppContext';
import { useState, useContext } from 'react';
import './Homepage.css';
import { Routes, Route, useNavigate, Link } from "react-router-dom";

export default function Homepage() {



  return (

    <div className="Homepage">
      <h2>Welcome to the 2875 Ticketmaster</h2>
      <ul>
        <Link to="/frontpage"><button className="homepage-button">Create Ticket</button></Link>
        <Link to="/upload"><button className="homepage-button">Upload/Update Forms</button></Link>
        <Link to="/tickets"><button className="homepage-button">Get User's Forms</button></Link>
      </ul>
    </div>



  )
}