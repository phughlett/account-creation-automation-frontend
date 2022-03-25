import logo from './logo.svg';
import './App.css';
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import AppContext from './context/AppContext';
import { PDFDocument } from 'pdf-lib'


function App() {

  const API_BASE_URL = 'http://localhost:8080'
  const FRONTEND_BASE_URL = 'http://localhost:3000'
  const navigate = useNavigate();

  const [pdfFileBuffer, setPdfFileBuffer] = useState();
  const [file, setFile] = useState();

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



  async function fillForm(systemName) {
    systemName = 'NIPR'
    let fileBytes;

    // https://www.esd.whs.mil/Portals/54/Documents/DD/forms/dd/dd2875.pdf

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
    textDate.setText('20220325')
    textSystemName.setText(systemName)
    textSystemName.enableReadOnly();
    textLocation.setText('My Basement')
    textName.setText('Mario A Plumber')
    textOrganization.setText('SUPRA CODERS')
    textOfficeSymbol.setText('SC')
    textPhone.setText('867-5309')
    textAddress.setText(' 2700 Dollywood Parks Blvd, Pigeon Forge, TN 37863')
    textTitleGrade.setText('GEN/O11')
    textMailAddress.setText('Marioap@spaceforce.mil')
    checkUsCitizen.check()
    checkMilitary.check()
    checkCyberAwareness.check()
    textTrainingDate.setText('20220320')
    textSignDate.setText('20220325')
    textJustification.setText('Needed for duties')
    checkPrivilegeRole.check()
    checkClassified.check()
    textClassified.setText('The Classification is Classified')
    checkNeedtoKnow.check()
    textSupervisorName.setText('Bowser Turtle ')
    textExpirationDate.setText('20220325')
    textSupervisorOrganization.setText('EK')
    textSupervisorEmail.setText('BowserT@spaceforce.mil')
    textSupervisorPhoneNumber.setText('365-5996')
    textIaoDepartment.setText('WK')
    textIaoPhoneNumber.setText('785-1249')
    // textUserName.setText('Mario A Plumber')
    textInvestigationType.setText('The Best Kind')
    textInvestigationDate.setText('20200325')
    textClearanceLevel.setText('The Classification is Classified')
    textSecurityManagerName.setText('Peach P')
    textSecurityManagerPhoneNum.setText('894-8419')
    textSecurityManagerSignDate.setText('20220325')


    // fields.forEach(field => {
    //   field.enableReadOnly()
    // })

    console.log(pdfDoc)

    const pdfBytes = await pdfDoc.save()
    download(pdfBytes, `test.pdf`, "application/pdf");
  }




  function sendFile(e) {
    e.preventDefault();

    let body = new FormData();

    body.append('file', file)

    console.log(body)

    // fetch(`${API_BASE_URL}/`, {
    //   method: 'POST',
    //   body
    // })
    // .then(data => console.log(data))
    // .catch(err => console.log('err: ', err))
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
          <button onClick={e => fillForm()}>Fill Form</button>
          <form>
            <input type="file" name="file" onChange={e => setFile(e.target.value)} />
            <input type="submit" onClick={e => fillForm()} value="Upload" />
          </form>
        </header>
      </div>
    );
  }

  let contextObj = {



  }






  return (




    <AppContext.Provider value={contextObj}>
      <Routes>
        <Route path='/' element={<PlaceHolderPage />} />
        {/* <Route path='/login' element={<Login />} /> */}
        {/* <Route path={routeURL} element={<UserHomePage />} /> */}
      </Routes>
    </AppContext.Provider>

  )

}

export default App;



