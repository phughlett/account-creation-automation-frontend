import AppContext from '../../context/AppContext';
import { useEffect, useState, useContext } from 'react';
import './Frontpage.css';
import {  useNavigate } from "react-router-dom";
//Split the name up intolast first middle int

export default function Frontpage() {

  let navigate = useNavigate();

  const [systemsNeeded, setSystemsNeeded] = useState([])
  const [userName, setUserName] = useState('')
  const [officeSymbol, setOfficeSymbol] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [dutyTitle, setDutyTitle] = useState('')
  const [grade, setGrade] = useState('')
  const [userStatus, setUserStatus] = useState('')
  const [statusMil, setStatusMIl] = useState('')
  const [statusCiv, setStatusCiv] = useState('')
  const [statusKrt, setStatusKtr] = useState('')
  const [trainingDate, setTrainingDate] = useState('')
  const [supervisor, setSupervisor] = useState('')
  const [supervisorOrg, setSupervisorOrg] = useState('')
  const [supervisorEmail, setSupervisorEmail] = useState('')
  const [supervisorPhone, setSupervisorPhone] = useState('')



  let { fillForm } = useContext(AppContext)



  let formObject = { userName, officeSymbol, phoneNumber, dutyTitle, grade, userEmail, userStatus, statusMil, statusCiv, statusKrt, trainingDate, supervisor, supervisorOrg, supervisorEmail, supervisorPhone };



  function onSubmitHandler(e) {
    e.preventDefault()

    for(let i = 0; i < systemsNeeded.length; ++i){
      fillForm(systemsNeeded[i], formObject)
    }
    navigate('/upload')




  }


  function changeSystem(e){

    if(e.target.checked){

      systemsNeeded.push(e.target.value)
      setSystemsNeeded([...systemsNeeded])
    }else{
      let systemsNeededCopy = systemsNeeded.filter(system => system !== e.target.value)
      setSystemsNeeded(systemsNeededCopy)
    }

  }



  return (



    <div className='FrontPage'>

      <p>Systems Needed</p>
      <div className="Systems">
        <label>| System 1</label>
        <input value='System 1' type='checkbox' onChange={e => changeSystem(e)}></input>
        <label>| System 2</label>
        <input value='System 2' type='checkbox' onChange={e => changeSystem(e)}></input>
        <label>| System 3</label>
        <input value='System 3' type='checkbox' onChange={e => changeSystem(e)}></input>
        <label>| System 4</label>
        <input value='System 4' type='checkbox' onChange={e => changeSystem(e)}></input>
        <label>| System 5</label>
        <input value='System 5' type='checkbox' onChange={e => changeSystem(e)}></input>
        <label>|</label>
      </div>
      <br />



      <form>

        <div id='UserInfo'>
          <label for='Military'> Designation of Person: </label>
          <input type="radio" name="status" value="true" id='military' required onChange={e => setStatusMIl(e.target.value)} />
          <label for='Military'> Military </label>
          <input type="radio" name="status" value="true" id='civilian' required onChange={e => setStatusCiv(e.target.value)} />
          <label for='Civilian'> Civilian </label>
          <input type="radio" name="status" value="true" id='contractor' required onChange={e => setStatusKtr(e.target.value)} />
          <label for='Contractor'> Contractor </label>
        </div>



        <div id='UserInfo'>
          <label for="name"> Name </label>
          <input type="text"  placeholder="Last, First, Middle Initial" required onChange={e => setUserName(e.target.value)} />

          <label for="name"> Office Symbol </label>
          <input type="text" required  onChange={e => setOfficeSymbol(e.target.value)} />


          <label for="name"> Phone Number </label>
          <input type="text" required  onChange={e => setPhoneNumber(e.target.value)} />

          <label for="name"> Offical Email </label>
          <input type="text" required  onChange={e => setUserEmail(e.target.value)} />

          <label for="name"> Job Title </label>
          <input type="text" required onChange={e => setDutyTitle(e.target.value)} />

          <label for="grade"> Grade/Rank </label>
          <select id="grade" onChange={e => setGrade(e.target.value)}>
            <option value='E-1'>E-1</option>
            <option value='E-2'>E-2</option>
            <option value='E-3'>E-3</option>
            <option value='E-4'>E-4</option>
            <option value='E-5'>E-5</option>
            <option value='E-6'>E-6</option>
            <option value='E-7'>E-7</option>
            <option value='E-8'>E-8</option>
            <option value='E-9'>E-9</option>
            <option value='O-1'>O-1</option>
            <option value='O-2'>O-2</option>
            <option value='O-3'>O-3</option>
            <option value='O-4'>O-4</option>
            <option value='O-5'>O-5</option>
            <option value='O-6'>O-6</option>
            <option value='O-7'>O-7</option>
            <option value='O-8'>O-8</option>
            <option value='O-9'>O-9</option>
            <option value='O-10'>O-10</option>
            <option value='GS-1'>GS-1</option>
            <option value='GS-2'>GS-2</option>
            <option value='GS-3'>GS-3</option>
            <option value='GS-4'>GS-4</option>
            <option value='GS-5'>GS-5</option>
            <option value='GS-6'>GS-6</option>
            <option value='GS-7'>GS-7</option>
            <option value='GS-8'>GS-8</option>
            <option value='GS-9'>GS-9</option>
            <option value='GS-10'>GS-10</option>
            <option value='GS-11'>GS-11</option>
            <option value='GS-12'>GS-12</option>
            <option value='GS-13'>GS-13</option>
            <option value='GS-14'>GS-14</option>
            <option value='GS-15'>GS-15</option>
            <option value='Contractor'>Contractor</option>
          </select>

          <label for="name" > IA Training Date </label>
          <input type="date" required placeholder="(YYYYMMDD)" onChange={e => setTrainingDate(e.target.value)} />
          <br />
        </div>

        <div id="SupervisorInfo">

          <label for="name"> Supervisor Name </label>
          <input type="text" required placeholder="Last, First, Middle Initial" onChange={e => setSupervisor(e.target.value)} />

          <label for="name"> Supervisor Org </label>
          <input type="text"  required onChange={e => setSupervisorOrg(e.target.value)} />

          <label for="name"> Supervisor Email </label>
          <input type="text" required onChange={e => setSupervisorEmail(e.target.value)} />

          <label for="name"> Supervisor Phone Number </label>
          <input type="text" required onChange={e => setSupervisorPhone(e.target.value)} />
          <br />
        </div>

        <button className='button' type="submit" onClick={e => onSubmitHandler(e)}> Submit </button>
      </form>

    </div>
  )
}