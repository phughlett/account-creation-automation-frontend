import { useState, useContext } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AppContext from '../context/AppContext';

var data = [];


function systemTotals(allTickets, systemInfo) {

  data = [];

  for(let i = 0; i < systemInfo.length; ++i){
    let currSys = systemInfo[i];
    let Requested = 0;
    let Completed = 0;

    allTickets.forEach((ticket) => {

      if (ticket.systemid === currSys.id) {
        if (ticket.iao && ticket.info_owner && ticket.supervisor && ticket.sec_man) ++Completed;
        else ++Requested
      }

    })

    let systemObject = {};
    systemObject.name = currSys.system_name
    systemObject.Requested = Requested
    systemObject.Completed = Completed

    data.push(systemObject)

  }
  return data;
}



export default function Example(){


  let { systemInfo, allTickets } = useContext(AppContext)
  systemTotals(allTickets, systemInfo)


  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis type="number"domain={[0, allTickets.length-1]}/>
        <Tooltip />
        <Legend />
        <Bar dataKey="Requested" fill="#8884d8" />
        <Bar dataKey="Completed" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );

}
