import AppContext from '../../context/AppContext';
import { useState, useContext, useEffect } from 'react';
import './TicketsPage.css';
import { Routes, Route, useNavigate, Link } from "react-router-dom";

export default function TicketsPage() {
  const [email, setEmail] = useState('');

  let { getUserTickets, downloadUserTickets, navigate, userTickets } = useContext(AppContext)

  async function onSubmit(e) {
    e.preventDefault();

    getUserTickets(email).then(()=>navigate('/upload'))

  }

  useEffect(() => {
    downloadUserTickets()
  }, [userTickets])


  return (
    <div className="Tickets">
      <label>User Email</label>
      <input type="search" id="email" name="email" onChange={e => setEmail(e.target.value)}></input>
      <button className="tickets-button" onClick={e => onSubmit(e)}>Search</button>
    </div>
  )
}