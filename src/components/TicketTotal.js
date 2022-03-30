import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import AppContext from '../context/AppContext';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';
import { StylesProvider } from "@material-ui/core/styles";
import './TicketTotal.css'

function preventDefault(event) {
  event.preventDefault();
}

export default function TicketTotal() {

  let activeTickets = 0;
  const current = new Date();

  let month = current.getMonth()
  let shortMonth = current.toLocaleString('en-us', { month: 'short' });
  const date = `${current.getDate()} ${shortMonth} ${current.getFullYear()}`;
  let { allTickets } = useContext(AppContext)

  function ticketCheck() {
    for (let i = 0; i < allTickets.length; i++) {
      if (!allTickets[i].iao || !allTickets[i].sec_man || !allTickets[i].supervisor || !allTickets[i].info_owner) {
        activeTickets++;
      }
    }
  }


  ticketCheck()

  return (
    <StylesProvider injectFirst>
      <div className="ticket-box">
        <Title>Total Tickets</Title>
        <Typography component="p" variant='h2'>
          {activeTickets}
        </Typography>
        <Typography color="text.secondary" sx={{ flex: 1 }}>
          as of {date}
        </Typography>
      </div>
    </StylesProvider>

  );
}
