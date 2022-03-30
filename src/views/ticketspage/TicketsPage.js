import AppContext from '../../context/AppContext';
import { useState, useContext, useEffect } from 'react';
import './TicketsPage.css';
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import Box from '@mui/material/Box';
import DashboardContent from '../../components/DashBoard'

export default function TicketsPage() {

  let {API_BASE_URL, setAllTickets } = useContext(AppContext)

  useEffect(() => {
    fetch(`${API_BASE_URL}/tickets`)
    .then(response => response.json())
    .then(data => setAllTickets(data))
    .catch(err => console.log('Error on useEffect getting all tickets: ', err))
  }, [])

  return (
    <div className="Tickets">
      <DashboardContent />
    </div>
  )
}