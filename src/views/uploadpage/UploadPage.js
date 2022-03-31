import React from 'react'
import './UploadPage.css';
import { useState, useContext, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import { DropzoneArea } from 'material-ui-dropzone'
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { StylesProvider } from "@material-ui/core/styles";
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import Badge from '@mui/material/Badge';
import { createTheme } from '@mui/material/styles';



export default function UploadPage() {

  const [files, setFiles] = useState([])
  const [roles, setRoles] = useState([])

  let { createTicket, navigate, updateTicket, setUserTickets } = useContext(AppContext)

  useEffect(() => {
    setUserTickets([])
  }, [])

  function handleChange(e) {
    e.preventDefault()

    if (!roles.length) {

      return "Must Select Role"
    } else {

      setFiles(files)

    }

  };


  async function onSubmitHandler(e) {
    e.preventDefault()

    if (roles.includes('User')) {
      files.forEach(file => createTicket(file))
    } else if (roles.includes('Supervisor')) {
      files.forEach(file => updateTicket(file, roles))
    } else if (roles.includes('Information Owner')) {
      files.forEach(file => updateTicket(file, roles))
    } else if (roles.includes('IAO')) {
      files.forEach(file => updateTicket(file, roles))
    } else if (roles.includes('Security Manager', roles)) {
      files.forEach(file => updateTicket(file, roles))
    }
    setTimeout(function () {
      return navigate("/tickets");
    }, 1000);

  }

  function changeRole(e) {

    if (e.target.checked) {

      roles.push(e.target.value)
      setRoles([...roles])
    } else {
      let rolesCopy = roles.filter(role => role !== e.target.value)
      setRoles(rolesCopy)
    }


  }

  return (


    <StylesProvider injectFirst>

      <header className='upload-header'>
        <IconButton onClick={e => navigate('/')} color="inherit">
          <Badge color="secondary">
            <HomeIcon />
          </Badge>
        </IconButton>
      </header>
      <div className='UploadPage'>

        <p>Signing as...</p>
        <div className="Roles">
          <label>| User (Block 11)</label>
          <input value='User' type='checkbox' onChange={e => changeRole(e)}></input>
          <label>| Supervisor (Block 18)</label>
          <input value='Supervisor' type='checkbox' onChange={e => changeRole(e)}></input>
          <label>| Information Owner (Block 21)</label>
          <input value='Information Owner' type='checkbox' onChange={e => changeRole(e)}></input>
          <label>| IAO (Block 22)</label>
          <input value='IAO' type='checkbox' onChange={e => changeRole(e)}></input>
          <label>| Security Manager (Block 31)</label>
          <input value='Security Manager' type='checkbox' onChange={e => changeRole(e)}></input>
          <label>|</label>
        </div>
        <br />

        <DropzoneArea className='upload-dropzone' filesLimit={5} onChange={e => setFiles(e)} />
        <button className='button' onClick={e => onSubmitHandler(e)} > Submit </button>

      </div>
    </StylesProvider>
  )
}

