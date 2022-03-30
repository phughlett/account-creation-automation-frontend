import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import AppContext from '../context/AppContext';
import { useState, useContext, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib'

// Generate Order Data


function createData(id, lastname, firstname, email, systemid, supervisor, iao, sec_man, info_owner) {


  return { id, lastname, firstname, email, systemid, supervisor, iao, sec_man, info_owner };
}
let rows = [];

function createRows(allTickets) {

  rows = [];

  for (let i = 0; i < allTickets.length; ++i) {

    let currRow = allTickets[i]
    // console.log(currRow)
    rows.push(createData(currRow.id, currRow.lastname, currRow.firstname, currRow.email, currRow.systemid, currRow.supervisor, currRow.iao, currRow.sec_man, currRow.info_owner))

  }



  return rows;

}



function preventDefault(event) {
  event.preventDefault();
}



export default function Orders() {

  let { allTickets, setAllTickets, API_BASE_URL, download } = useContext(AppContext)


  async function getTicket(id) {


    fetch(`${API_BASE_URL}/tickets/${id}`)
      .then((response) => response.arrayBuffer())
      .then(data => {

        PDFDocument.load(data)

          .then((pdfDoc) => {

            pdfDoc.save()

              .then(pdfBytes => {

                let ticket = allTickets.filter((ticket) => ticket.id === id)

                download(pdfBytes, `${ticket[0].formname}`, "application/pdf")
              })
          })
      })
      .catch(err => console.log(`Error w/ get ticket id ${id}`, err))

  }

  createRows(allTickets);

  return (
    <React.Fragment>
      <Title>Current Tickets</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Last Name</TableCell>
            <TableCell>First Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>System</TableCell>
            <TableCell>Supervisor</TableCell>
            <TableCell>Information Owner </TableCell>
            <TableCell>IAO</TableCell>
            <TableCell>Security Manager</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} onClick={e => getTicket(row.id)}>
              <TableCell>{row.lastname}</TableCell>
              <TableCell>{row.firstname}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.systemid}</TableCell>
              <TableCell>{row.supervisor ? <>Signed</> : <>Needs Signature</>}</TableCell>
              <TableCell>{row.info_owner ? <>Signed</> : <>Needs Signature</>}</TableCell>
              <TableCell>{row.iao ? <>Signed</> : <>Needs Signature</>}</TableCell>
              <TableCell>{row.sec_man ? <>Signed</> : <>Needs Signature</>}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
