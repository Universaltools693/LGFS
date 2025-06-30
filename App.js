import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

const App = () => {
  const [key, setKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [district, setDistrict] = useState('');
  const [areaType, setAreaType] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [model, setModel] = useState('');
  const [areas, setAreas] = useState([]);
  const [models, setModels] = useState([]);
  const [leads, setLeads] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloadReady, setIsDownloadReady] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [greeting, setGreeting] = useState('');

  // Time-based greeting (updated for 10:33 PM IST, June 30, 2025)
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 6) setGreeting('Good Night');
    else if (hour >= 6 && hour < 12) setGreeting('Good Morning');
    else if (hour >= 12 && hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
    setTimeout(() => document.getElementById('greeting').style.display = 'none', 4000);
  }, []);

  // Show greeting after authentication
  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(() => {
        document.getElementById('greeting').style.display = 'block';
        setTimeout(() => document.getElementById('greeting').style.display = 'none', 4000);
      }, 1000);
    }
  }, [isAuthenticated]);

  // Fetch areas
  useEffect(() => {
    if (district && areaType) {
      axios.get(`https://your-render-url.com/api/areas?district=${district}&type=${areaType}`)
        .then(res => setAreas(res.data));
    }
  }, [district, areaType]);

  // Fetch models
  useEffect(() => {
    if (vehicleType) {
      axios.get(`https://your-render-url.com/api/models?type=${vehicleType}`)
        .then(res => setModels(res.data));
    }
  }, [vehicleType]);

  // Authenticate
  const authenticate = () => {
    if (key === 'HAPPY') {
      setIsAuthenticated(true);
    }
  };

  // Generate leads
  const generateLeads = () => {
    setIsProcessing(true);
    axios.get(`https://your-render-url.com/api/leads?district=${district}&type=${areaType}&model=${model}`)
      .then(res => {
        setLeads(res.data);
        setIsProcessing(false);
        setIsDownloadReady(true);
        setTimeout(() => {
          document.getElementById('truck').classList.add('truck-move');
          document.getElementById('smoke').style.display = 'block';
          setTimeout(() => document.getElementById('smoke').style.display = 'none', 5000);
        }, 1000);
      });
  };

  // Download leads (unlimited)
  const download = (format) => {
    window.location.href = `https://your-render-url.com/api/download?format=${format}`;
  };

  return (
    <div>
      {!isAuthenticated && (
        <div id="auth-layer" className="auth-layer">
          <div className="auth-text">
            Authentication Needed<br />By<br />Authorized Person
            <svg className="icon" viewBox="0 0 24 24" fill="white">
              <path d="M21 11h-3V6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-7zm-5 7H8v-2h8v2zm0-4H8v-2h8v2zm0-4H8V8h8v2z"/>
            </svg>
          </div>
          <div className="auth-box">
            <label>KEY</label>
            <input type="text" value={key} onChange={e => setKey(e.target.value)} />
            <button onClick={authenticate}>Press For KEY Authorization</button>
          </div>
          <div id="greeting" className="greeting-box">{greeting}</div>
        </div>
      )}
      {isAuthenticated && (
        <div className="main-page">
          <div id="greeting" className="greeting-box">{greeting}</div>
          <h1>Lead Generation Hub For Sales
            <svg className="icon" viewBox="0 0 24 24" fill="black">
              <path d="M21 11h-3V6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-7zm-5 7H8v-2h8v2zm0-4H8v-2h8v2zm0-4H8V8h8v2z"/>
            </svg>
          </h1>
          <div className="dropdowns">
            <div>
              <select onChange={e => setDistrict(e.target.value)}>
                <option value="">Select District</option>
                {['Jabalpur', 'Mandla', 'Dindori', 'Damoh', 'Katni', 'Narsinghpur', 'Gadarwara', 'Seoni', 'Lakhnadon'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <svg className="icon" viewBox="0 0 24 24" fill="black">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
              </svg>
            </div>
            <div>
              <select onChange={e => setAreaType(e.target.value)}>
                <option value="">Select Area Type</option>
                <option value="Urban">Urban</option>
                <option value="Rural">Rural</option>
              </select>
              <svg className="icon" viewBox="0 0 24 24" fill="black">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
              </svg>
            </div>
            <div>
              <select onChange={e => setVehicleType(e.target.value)}>
                <option value="">Select Vehicle Type</option>
                <option value="Haulage Trucks/Tractors">Haulage Trucks/Tractors</option>
                <option value="Tippers">Tippers</option>
                <option value="Transit Mixers">Transit Mixers</option>
              </select>
              <svg className="icon" viewBox="0 0 24 24" fill="black">
                <path d="M21 11h-3V6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-7zm-5 7H8v-2h8v2zm0-4H8v-2h8v2zm0-4H8V8h8v2z"/>
              </svg>
            </div>
            <div>
              <select onChange={e => setModel(e.target.value)}>
                <option value="">Select Model</option>
                {models.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <svg className="icon" viewBox="0 0 24 24" fill="black">
                <path d="M21 11h-3V6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-7zm-5 7H8v-2h8v2zm0-4H8v-2h8v2zm0-4H8V8h8v2z"/>
              </svg>
            </div>
          </div>
          <button className="lead-button" onClick={generateLeads} disabled={!district || !areaType || !vehicleType || !model}>
            Press For Lead Generation
            <svg className="icon" viewBox="0 0 24 24" fill="white">
              <path d="M21 11h-3V6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-7zm-5 7H8v-2h8v2zm0-4H8v-2h8v2zm0-4H8V8h8v2z"/>
            </svg>
          </button>
          {isProcessing && (
            <svg id="truck" className="truck-icon" viewBox="0 0 24 24" fill="black">
              <path d="M21 11h-3V6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-7zm-5 7H8v-2h8v2zm0-4H8v-2h8v2zm0-4H8V8h8v2z"/>
            </svg>
          )}
          <div id="smoke" className="smoke">Leads Generated</div>
          {isDownloadReady && (
            <div className="download-button">
              <button onClick={() => setShowDownloadOptions(!showDownloadOptions)}>
                Download
                <svg className="icon" viewBox="0 0 24 24" fill="white">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </svg>
              </button>
              {showDownloadOptions && (
                <div className="download-options">
                  <button onClick={() => download('excel')}>Download in Excel File</button>
                  <button onClick={() => download('pdf')}>Download in PDF File</button>
                </div>
              )}
            </div>
          )}
          {leads.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Business Name</th>
                  <th>Owner Name</th>
                  <th>Owner Contact</th>
                  <th>Owner Address</th>
                  <th>Business Address</th>
                  <th>Office Contact</th>
                  <th>Manager Name</th>
                  <th>Manager Contact</th>
                  <th>Manager Address</th>
                  <th>Business Scale</th>
                  <th>Business Type</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr key={lead.lead_id}>
                    <td>{lead['Business Name']}</td>
                    <td>{lead['Owner Name']}</td>
                    <td>{lead['Owner Contact Number']}</td>
                    <td>{lead['Owner House Address']}</td>
                    <td>{lead['Business Address']}</td>
                    <td>{lead['Office Contact Number']}</td>
                    <td>{lead['Manager Name']}</td>
                    <td>{lead['Manager Contact Number']}</td>
                    <td>{lead['Manager Address']}</td>
                    <td>{lead['Business Scale']}</td>
                    <td>{lead['Business Type']}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
