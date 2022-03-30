import logo from './logo.svg';
import './App.css';
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import AppContext from './context/AppContext';
import { PDFDocument } from 'pdf-lib'
import Homepage from './views/homepage/Homepage'
import Frontpage from './views/frontpage/Frontpage'
import UploadPage from './views/uploadpage/UploadPage'
import TicketsPage from './views/ticketspage/TicketsPage'

function App() {

  const API_BASE_URL = 'http://localhost:8080'
  const FRONTEND_BASE_URL = 'http://localhost:3000'
  const navigate = useNavigate();

  const [pdfFileBuffer, setPdfFileBuffer] = useState();
  const [file, setFile] = useState();
  const [userTickets, setUserTickets] = useState([]);
  const [allTickets, setAllTickets] = useState([]);
  const [activeTickets, setActiveTickets] = useState([]);
  const [systemInfo, setSystemInfo] = useState([])


  useEffect(() => {
    fetch(`${API_BASE_URL}/tickets`)
    .then(response => response.json())
    .then(data => setAllTickets(data))
    .catch(err => console.log('Error on useEffect getting all tickets: ', err))

    fetch(`${API_BASE_URL}/systems`)
    .then(response => response.json())
    .then(data => setSystemInfo(data))
    .catch(err => console.log('Error on useEffect getting all tickets: ', err))
  }, [])

  //download.js v3.0, by dandavis; 2008-2014. [CCBY2] see http://danml.com/download.html for tests/usage
  // v1 landed a FF+Chrome compat way of downloading strings to local un-named files, upgraded to use a hidden frame and optional mime
  // v2 added named files via a[download], msSaveBlob, IE (10+) support, and window.URL support for larger+faster saves than dataURLs
  // v3 added dataURL and Blob Input, bind-toggle arity, and legacy dataURL fallback was improved with force-download mime and base64 support
  // data can be a string, Blob, File, or dataURL
  function download(data, strFileName, strMimeType) {

    var self = window, // this script is only for browsers anyway...
      u = "application/octet-stream", // this default mime also triggers iframe downloads
      m = strMimeType || u,
      x = data,
      D = document,
      a = D.createElement("a"),
      z = function (a) { return String(a); },


      B = self.Blob || self.MozBlob || self.WebKitBlob || z,
      BB = self.MSBlobBuilder || self.WebKitBlobBuilder || self.BlobBuilder,
      fn = strFileName || "download",
      blob,
      b,
      ua,
      fr;

    //if(typeof B.bind === 'function' ){ B=B.bind(self); }

    if (String(this) === "true") { //reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
      x = [x, m];
      m = x[0];
      x = x[1];
    }



    //go ahead and download dataURLs right away
    if (String(x).match(/^data\:[\w+\-]+\/[\w+\-]+[,;]/)) {
      return navigator.msSaveBlob ?  // IE10 can't do a[download], only Blobs:
        navigator.msSaveBlob(d2b(x), fn) :
        saver(x); // everyone else can save dataURLs un-processed
    }//end if dataURL passed?

    try {

      blob = x instanceof B ?
        x :
        new B([x], { type: m });
    } catch (y) {
      if (BB) {
        b = new BB();
        b.append([x]);
        blob = b.getBlob(m); // the blob
      }

    }



    function d2b(u) {
      var p = u.split(/[:;,]/),
        t = p[1],
        dec = p[2] == "base64" ? atob : decodeURIComponent,
        bin = dec(p.pop()),
        mx = bin.length,
        i = 0,
        uia = new Uint8Array(mx);

      for (i; i < mx; ++i) uia[i] = bin.charCodeAt(i);

      return new B([uia], { type: t });
    }

    function saver(url, winMode) {


      if ('download' in a) { //html5 A[download]
        a.href = url;
        a.setAttribute("download", fn);
        a.innerHTML = "downloading...";
        D.body.appendChild(a);
        setTimeout(function () {
          a.click();
          D.body.removeChild(a);
          if (winMode === true) { setTimeout(function () { self.URL.revokeObjectURL(a.href); }, 250); }
        }, 66);
        return true;
      }

      //do iframe dataURL download (old ch+FF):
      var f = D.createElement("iframe");
      D.body.appendChild(f);
      if (!winMode) { // force a mime that will download:
        url = "data:" + url.replace(/^data:([\w\/\-\+]+)/, u);
      }


      f.src = url;
      setTimeout(function () { D.body.removeChild(f); }, 333);

    }//end saver


    if (navigator.msSaveBlob) { // IE10+ : (has Blob, but not a[download] or URL)
      return navigator.msSaveBlob(blob, fn);
    }

    if (self.URL) { // simple fast and modern way using Blob and URL:
      saver(self.URL.createObjectURL(blob), true);
    } else {
      // handle non-Blob()+non-URL browsers:
      if (typeof blob === "string" || blob.constructor === z) {
        try {
          return saver("data:" + m + ";base64," + self.btoa(blob));
        } catch (y) {
          return saver("data:" + m + "," + encodeURIComponent(blob));
        }
      }

      // Blob but not URL:
      fr = new FileReader();
      fr.onload = function (e) {
        saver(this.result);
      };
      fr.readAsDataURL(blob);
    }
    return true;
  } /* end download() */



  async function fillForm(systemName, userInfo) {

    console.log('Systemname: ', systemName)
    console.log('userInfo', userInfo)

    let systemRoles = systemInfo.filter(system => system.system_name === systemName)
    systemRoles = systemRoles[0]
    console.log(systemRoles)
    let fileBytes;



    let formpdfbytes = await fetch('http://localhost:8080/').then(res => res.arrayBuffer())


    let pdfDoc = await PDFDocument.load(formpdfbytes)

    let form = pdfDoc.getForm();
    console.log('form', form)

    console.log('form.getfields: ', form.getFields())
    let fields = form.getFields();

    // fields.forEach(field => {
    //   let name = field.getName();
    //   console.log('field name', name)
    //   console.log('field', field)
    // })


    let date = new Date()
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let fullDate = `${year}${month}${day}`;




    let checkInitial = form.getCheckBox('INITIAL')
    let checkModification = form.getCheckBox('MODIFICATION')
    let checkDeactivate = form.getCheckBox('DEACTIVATE')
    // form.getCheckBox('USER ID')
    let textUserId = form.getTextField('USER ID')
    let textDate = form.getTextField('DATE YYYYMMDD')
    let textSystemName = form.getTextField('SYSTEM NAME')
    let textLocation = form.getTextField('LOCATION')
    let textName = form.getTextField('1 NAME')
    let textOrganization = form.getTextField('2 ORGANIZATION')
    let textOfficeSymbol = form.getTextField('3 OFFICE SYMBOLDEPARTMENT')
    let textPhone = form.getTextField('4 PHONE')
    let textAddress = form.getTextField('5 OFFICIAL EMAIL ADDRESS')
    let textTitleGrade = form.getTextField('6 JOB TITLE AND GRADERANK')
    let textMailAddress = form.getTextField('7 OFFICIAL MAILING ADDRESS')
    let checkUsCitizen = form.getCheckBox('US')
    let checkForeign = form.getCheckBox('FN')
    let checkOther = form.getCheckBox('OTHER')
    let checkMilitary = form.getCheckBox('MILITARY')
    let checkContractor = form.getCheckBox('CONTRACTOR')
    let checkCivilian = form.getCheckBox('CIVILIAN')
    let checkCyberAwareness = form.getCheckBox('I have completed Annual Information Awareness Training')
    let textTrainingDate = form.getTextField('IA TRAINING DATE YYYYMMDD')
    let textSignDate = form.getTextField('12 DATE YYYYMMDD')
    let textJustification = form.getTextField('13 JUSTIFICATION FOR ACCESS')
    let checkAuthorizedRole = form.getCheckBox('AUTHORIZED')
    let checkPrivilegeRole = form.getCheckBox('PRIVILEGED')
    let checkUnclassified = form.getCheckBox('UNCLASSIFIED')
    let checkClassified = form.getCheckBox('CLASSIFIED CHECKBOX')
    let textClassified = form.getTextField('CLASSIFIED')
    let checkOtherClearance = form.getCheckBox('OTHER_2')
    let checkNeedtoKnow = form.getCheckBox('16')
    let textSupervisorName = form.getTextField('17 SUPERVISORS NAME Print Name')
    let textExpirationDate = form.getTextField('19 DATE YYYYMMDD')
    let textSupervisorOrganization = form.getTextField('20 SUPERVISORS ORGANIZATIONDEPARTMENT')
    let textSupervisorEmail = form.getTextField('20a SUPERVISORS EMAIL ADDRESS')
    let textSupervisorPhoneNumber = form.getTextField('20b PHONE NUMBER')
    let textInformationOwnerPhoneNumber = form.getTextField('21a PHONE NUMBER')
    let textInformationOwnerSignDate = form.getTextField('21b DATE YYYYMMDD')
    let textIaoDepartment = form.getTextField('23 ORGANIZATIONDEPARTMENT')
    let textIaoPhoneNumber = form.getTextField('24 PHONE NUMBER')
    let textIaoSignDate = form.getTextField('25DATE YYYYMMDD')
    // let textUserName = form.getTextField('26 NAME')
    let textOptionalInfo = form.getTextField('27 OPTIONAL INFORMATION')
    let textInvestigationType = form.getTextField('28 TYPE OF INVESTIGATION')
    let textInvestigationDate = form.getTextField('28a DATE YYYYMMDD')
    let textClearanceLevel = form.getTextField('28b CLEARANCE LEVEL')
    let textSecurityManagerName = form.getTextField('29 VERIFIED BY Printed Name')
    let textSecurityManagerPhoneNum = form.getTextField('30 SECURITY MANAGER TELEPHONE NUMBER')
    let textSecurityManagerSignDate = form.getTextField('32 DATE YYYYMMDD')


    console.log('textname', textName)



    checkInitial.check()
    textDate.setText(fullDate)
    textSystemName.setText(systemName)
    textSystemName.enableReadOnly();
    textLocation.setText('The Pentagon, Washington, DC')
    textName.setText(`${userInfo.lastName}, ${userInfo.firstName}, ${userInfo.middleInitial}`)
    textOrganization.setText('SUPRA CODERS')
    textOfficeSymbol.setText(userInfo.officeSymbol)
    textPhone.setText(userInfo.phoneNumber)
    textAddress.setText(userInfo.userEmail)
    textTitleGrade.setText(`${userInfo.dutyTitle}  ${userInfo.grade}`)
    textMailAddress.setText('The Pentagon, Washington, DC')
    checkUsCitizen.check()

    if (userInfo.statusMil) checkMilitary.check();
    if (userInfo.statusCiv) checkCivilian.check();
    if (userInfo.statusKtr) checkContractor.check();

    checkCyberAwareness.check()
    textTrainingDate.setText(userInfo.trainingDate)
    textSignDate.setText(fullDate)
    textJustification.setText('Needed for offical duties')
    checkAuthorizedRole.check()
    checkClassified.check()
    textClassified.setText('Classified')
    checkNeedtoKnow.check()
    textSupervisorName.setText(userInfo.supervisor)
    textSupervisorOrganization.setText(userInfo.supervisorOrg)
    textSupervisorEmail.setText(userInfo.supervisorEmail)
    textSupervisorPhoneNumber.setText(userInfo.supervisorPhone)
    textInformationOwnerPhoneNumber.setText(systemRoles.info_owner_phonenum)
    textIaoDepartment.setText(systemRoles.iao_name)
    textIaoPhoneNumber.setText(systemRoles.iao_phonenum)
    // textUserName.setText('Mario A Plumber')
    textInvestigationType.setText('Single Scope')
    textClearanceLevel.setText('Classified')
    textSecurityManagerName.setText(systemRoles.sec_man_name)
    textSecurityManagerPhoneNum.setText(systemRoles.sec_man_phonenum)


    pdfDoc.setTitle(`${userInfo.firstName}`)
    pdfDoc.setAuthor(`${userInfo.lastName}`)
    pdfDoc.setSubject(`${userInfo.userEmail}`)
    pdfDoc.setCreator(systemName)




    // fields.forEach(field => {
    //   field.enableReadOnly()
    // })

    console.log(pdfDoc)

    let fileName = `${userInfo.lastName}, ${userInfo.firstName}-${systemName}-${fullDate}-2875.pdf`

    const pdfBytes = await pdfDoc.save()
    download(pdfBytes, fileName, "application/pdf");
  }


  async function createTicket(file) {

    const reader = new FileReader()

    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')
    reader.onload = () => {

      // Do whatever you want with the file contents
      let result = reader.result
      console.log('result', result)

      PDFDocument.load(result).then((pdfDoc) => {

        let form = pdfDoc.getForm();//might need to use this to see if what is signed to update the tracker

        console.log(form)

        // let fields = form.getFields()
        // fields.forEach(field => {
        //   let name = field.getName();
        //   console.log('field name', name)
        //   console.log('field', field)
        // })


        let supervisorSignature = form.getField('Signature1')
        let userSignature = form.getField('Signature2')
        let infoOwnerSignature = form.getField('Signature3')
        let iaoSignature = form.getField('Signature4')
        let secManagerSignature = form.getField('Signature5')


        // console.log()

        console.log('supervisor: ',supervisorSignature)
        console.log('user: ',userSignature)
        console.log('info owner: ',infoOwnerSignature)
        console.log('iao: ',iaoSignature)
        console.log('secman: ',secManagerSignature)




        let system = pdfDoc.getCreator()
        let systemNum = system.at(system.length - 1)
        let intNum = parseInt(systemNum)


        let firstname = pdfDoc.getTitle()
        let lastname = pdfDoc.getAuthor()
        let email = pdfDoc.getSubject()
        let systemid = intNum
        let formname = file.name

        let body = new FormData();

        body.append(`file`, file)
        body.append('firstname', firstname)
        body.append('lastname', lastname)
        body.append('email', email)
        body.append('systemid', systemid)
        body.append('formname', formname)


        fetch(`${API_BASE_URL}/tickets/create`, {
          method: 'POST',
          body
        })
          .then(data => console.log(data))
          .catch(err => console.log('err: ', err))


      })

    }

    reader.readAsArrayBuffer(file)

  }

  async function updateTicket(file, roleSigned) {

    console.log(roleSigned)

    const reader = new FileReader()

    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')
    reader.onload = () => {

      // Do whatever you want with the file contents
      let result = reader.result
      PDFDocument.load(result).then((pdfDoc) => {

        let system = pdfDoc.getCreator()
        let systemNum = system.at(system.length - 1)
        let intNum = parseInt(systemNum)


        let firstname = pdfDoc.getTitle()
        let lastname = pdfDoc.getAuthor()
        let email = pdfDoc.getSubject()
        let systemid = intNum
        let formname = file.name

        let body = new FormData();

        body.append(`file`, file)
        body.append('firstname', firstname)
        body.append('lastname', lastname)
        body.append('email', email)
        body.append('systemid', systemid)
        body.append('formname', formname)
        body.append('supervisor', roleSigned.includes('Supervisor'))
        body.append('iao', roleSigned.includes('IAO'))
        body.append('sec_man', roleSigned.includes('Security Manager'))
        body.append('info_owner', roleSigned.includes('Information Owner'))

        fetch(`${API_BASE_URL}/tickets/update`, {
          method: 'PATCH',
          body
        })
          .then(data => console.log(data))
          .catch(err => console.log('err: ', err))


      })

    }

    reader.readAsArrayBuffer(file)

  }


  function PlaceHolderPage() {

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <button onClick={e => getUserTickets('google@aol.com')}>Get User Tickets</button>
          <button onClick={e => downloadUserTickets()}>Download UserTickets</button>
          <button onClick={e => fillForm()}>Fill Form</button>
          <form>
            <input type="file" name="file" multiple onChange={e => setFile(e.target.files)} />
            <input type="submit" onClick={e => createTicket(e)} value="Upload" />
          </form>
        </header>
      </div>
    );
  }

 function getUserTickets(email) {
    // e.preventDefault()
    let emailURI = encodeURIComponent(email)

    return fetch(`${API_BASE_URL}/users/tickets/${emailURI}`)
      .then(response => response.json())
      .then(data => setUserTickets(data))
      .catch(err => console.err(err))

  }

  async function downloadUserTickets() {

    for (let i = 0; i < userTickets.length; ++i) {

      let fileName = userTickets[i].form_filepath;
      let currTicket = userTickets[i]


      let formpdfbytes = await fetch(`http://localhost:8080/tickets/${userTickets[i].id}`).then(res => res.arrayBuffer())
      let pdfDoc = await PDFDocument.load(formpdfbytes)
      const pdfBytes = await pdfDoc.save()

        download(pdfBytes, `${userTickets[i].formname}`, "application/pdf")

    }
  }

  let contextObj = {

    fillForm,
    getUserTickets,
    downloadUserTickets,
    navigate,
    updateTicket,
    createTicket,
    userTickets,
    setUserTickets,
    allTickets,
    setAllTickets,
    API_BASE_URL,
    download,
    activeTickets,
    systemInfo

  }





  return (




    <AppContext.Provider value={contextObj}>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/frontpage' element={<Frontpage />} />
        <Route path='/upload' element={<UploadPage />} />
        <Route path='/tickets' element={<TicketsPage />} />
      </Routes>
    </AppContext.Provider>

  )

}

export default App;



