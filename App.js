const { useState, useEffect } = React;
const { jsPDF } = window.jspdf;

function App({ userName }) {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [showDownload, setShowDownload] = useState(false);
  const [leads, setLeads] = useState([
    { businessName: "Tashi Transporter", contactNumber: "+91-8043835060", address: "Aaga Chowk, Jabalpur - 482002", area: "Ranjhi", areaType: "Urban", businessType: "Medium Logistics", application: "Marble transport, FMCG", model: "Pro 3019", source: "Justdial" },
    { businessName: "Unity Logistic Park", contactNumber: "+91-8044460148", address: "Katangi Bypass Chowk, Jabalpur - 482001", area: "Barela", areaType: "Urban", businessType: "Large Logistics", application: "FMCG, e-commerce", model: "Pro 3019", source: "IndiaMART" },
    { businessName: "Sai Marble & Granite", contactNumber: "+91-761-4040404", address: "Marble Market, Gorakhpur, Jabalpur - 482001", area: "Gorakhpur", areaType: "Urban", businessType: "Small Business", application: "Marble/granite transport", model: "Pro 3019", source: "Sulekha" },
    { businessName: "Sagar Transport Solutions", contactNumber: "+91-7582-223344", address: "Tili Road, Sagar - 470002", area: "Tili Road", areaType: "Urban", businessType: "Medium Logistics", application: "FMCG, industrial goods", model: "Pro 3019", source: "Justdial" },
    { businessName: "Singrauli Mining Transport", contactNumber: "+91-7866-445566", address: "Waidhan, Singrauli - 486886", area: "Waidhan", areaType: "Urban", businessType: "Medium Logistics", application: "Mining, construction materials", model: "Pro 8035XM", source: "IndiaMART" }
  ]);

  const geoData = {
    country: "India",
    state: "Madhya Pradesh",
    cities: [
      { name: "Jabalpur", areas: [{ name: "Ranjhi", type: "Urban" }, { name: "Barela", type: "Urban" }, { name: "Bargi", type: "Rural" }, { name: "Sihora", type: "Rural" }, { name: "Kundam", type: "Rural" }, { name: "Gorakhpur", type: "Urban" }, { name: "Adhartal", type: "Urban" }, { name: "Rampur", type: "Urban" }, { name: "Vijay Nagar", type: "Urban" }] },
      { name: "Sagar", areas: [{ name: "Tili Road", type: "Urban" }, { name: "Makronia", type: "Urban" }, { name: "Banda", type: "Rural" }, { name: "Khurai", type: "Rural" }] },
      { name: "Rewa", areas: [{ name: "Sirmour", type: "Urban" }, { name: "Mauganj", type: "Rural" }, { name: "Govindgarh", type: "Rural" }] },
      { name: "Satna", areas: [{ name: "Civil Lines", type: "Urban" }, { name: "Maihar", type: "Rural" }, { name: "Nagod", type: "Rural" }] },
      { name: "Katni", areas: [{ name: "Madanpur", type: "Urban" }, { name: "Barhi", type: "Rural" }, { name: "Vijayraghavgarh", type: "Rural" }] },
      { name: "Chhindwara", areas: [{ name: "Parasia", type: "Urban" }, { name: "Amarwara", type: "Rural" }, { name: "Chaurai", type: "Rural" }] },
      { name: "Damoh", areas: [{ name: "Civil Ward", type: "Urban" }, { name: "Hatta", type: "Rural" }, { name: "Patera", type: "Rural" }] },
      { name: "Singrauli", areas: [{ name: "Waidhan", type: "Urban" }, { name: "Jayant", type: "Urban" }, { name: "Chitrangi", type: "Rural" }] },
      { name: "Balaghat", areas: [{ name: "Waraseoni", type: "Urban" }, { name: "Baihar", type: "Rural" }, { name: "Lanji", type: "Rural" }] },
      { name: "Seoni", areas: [{ name: "Barghat", type: "Rural" }, { name: "Keolari", type: "Rural" }, { name: "Chhapara", type: "Urban" }] },
      { name: "Narsinghpur", areas: [{ name: "Gadarwara", type: "Urban" }, { name: "Kareli", type: "Rural" }, { name: "Gotegaon", type: "Urban" }] },
      { name: "Hoshangabad", areas: [{ name: "Itarsi", type: "Urban" }, { name: "Pipariya", type: "Urban" }, { name: "Sohagpur", type: "Rural" }] },
      { name: "Betul", areas: [{ name: "Sarni", type: "Urban" }, { name: "Multai", type: "Rural" }, { name: "Amla", type: "Rural" }] },
      { name: "Sidhi", areas: [{ name: "Churhat", type: "Rural" }, { name: "Sihawal", type: "Rural" }, { name: "Majhauli", type: "Rural" }] }
    ]
  };

  const eicherModels = {
    haulage: [{ name: "Pro 2119", application: "Marble transport, FMCG" }, { name: "Pro 3019", application: "Marble transport, FMCG" }, { name: "Pro 6028", application: "Industrial goods, cement" }, { name: "Pro 3019 CNG", application: "Eco-friendly FMCG" }, { name: "Pro 6048", application: "Tanker, bulkers" }],
    tippers: [{ name: "Pro 6019 XPT", application: "Construction, small mining" }, { name: "Pro 8035XM", application: "Heavy mining" }, { name: "Pro 6028T", application: "Medium mining" }],
    transitMixers: [{ name: "Pro 6028TM", application: "RMC delivery" }, { name: "Pro 6035TM", application: "Large RMC projects" }]
  };

  useEffect(() => {
    const fetchScrapedLeads = async () => {
      const newLeads = [
        { businessName: "Marble City Traders", contactNumber: "+91-761-4056789", address: "Rampur Marble Market, Jabalpur - 482008", area: "Rampur", areaType: "Urban", businessType: "Small Business", application: "Marble/granite transport", model: "Pro 3019", source: "Justdial" },
        { businessName: "Vijay Nagar Transport", contactNumber: "+91-761-2678901", address: "Vijay Nagar, Jabalpur - 482002", area: "Vijay Nagar", areaType: "Urban", businessType: "Small Logistics", application: "FMCG, parcels", model: "Pro 3019", source: "IndiaMART" },
        { businessName: "Damoh Logistics", contactNumber: "+91-7812-556677", address: "Civil Ward, Damoh - 470661", area: "Civil Ward", areaType: "Urban", businessType: "Medium Logistics", application: "FMCG, industrial goods", model: "Pro 3019", source: "Sulekha" }
      ];
      const uniqueLeads = newLeads.filter(newLead => !leads.some(lead => lead.contactNumber === newLead.contactNumber));
      setLeads([...leads, ...uniqueLeads]);
    };
    fetchScrapedLeads();
  }, []);

  const handleGenerateLeads = () => {
    const filtered = leads.filter(lead => lead.area === selectedArea && lead.model === selectedModel && (selectedType === '' || lead.areaType === selectedType));
    setFilteredLeads(filtered);
    setShowDownload(filtered.length > 0);
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredLeads);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    worksheet['!cols'] = [{ wch: 20 }, { wch: 20 }, { wch: 30 }, { wch: 15 }, { wch: 20 }, { wch: 25 }, { wch: 15 }];
    XLSX.utils.sheet_add_aoa(worksheet, [["Eicher Lead Generation", "", "", "", "", "", `Generated on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`]], { origin: "A1" });
    XLSX.writeFile(workbook, "Eicher_Leads.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Eicher Lead Generation", 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`, 20, 30);
    doc.setFontSize(10);
    doc.setFont("Helvetica", "normal");
    const tableData = filteredLeads.map(lead => [lead.businessName, lead.contactNumber, lead.address, lead.area, lead.businessType, lead.application, lead.source]);
    doc.autoTable({ head: [['Business Name', 'Contact Number', 'Address', 'Area', 'Business Type', 'Application', 'Source']], body: tableData, startY: 40, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontSize: 10 }, headStyles: { fillColor: [30, 64, 175], textColor: [255, 255, 255] }, alternateRowStyles: { fillColor: [240, 240, 240] }, margin: { top: 40 } });
    doc.text("Generated by Eicher Lead Generation System", 20, doc.lastAutoTable.finalY + 10);
    doc.save("Eicher_Leads.pdf");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return `Good Morning, ${userName}`;
    if (hour < 17) return `Good Afternoon, ${userName}`;
    if (hour < 20) return `Good Evening, ${userName}`;
    return `Good Night, ${userName}`;
  };

  return (
    <div className="App">
      <h1 className="greeting">{getGreeting()}</h1>
      <h2>Eicher Lead Generation</h2>
      {showDownload && (
        <div className="download-container">
          <button className="download-button">Download</button>
          <div className="download-dropdown">
            <button onClick={downloadExcel}>Download in Excel File</button>
            <button onClick={downloadPDF}>Download in PDF File</button>
          </div>
        </div>
      )}
      <div className="input-group">
        <label>Country: </label><input type="text" value="India" disabled />
      </div>
      <div className="input-group">
        <label>State: </label><input type="text" value="Madhya Pradesh" disabled />
      </div>
      <div className="input-group">
        <label>City: </label>
        <select onChange={e => { setSelectedArea(''); setSelectedCity(e.target.value); }}>
          <option value="">Select City</option>
          {geoData.cities.map(city => <option key={city.name} value={city.name}>{city.name}</option>)}
        </select>
      </div>
      <div className="input-group">
        <label>Area: </label>
        <select onChange={e => setSelectedArea(e.target.value)} disabled={!selectedCity}>
          <option value="">Select Area</option>
          {selectedCity && geoData.cities.find(city => city.name === selectedCity)?.areas.map(area => <option key={area.name} value={area.name}>{area.name}</option>)}
        </select>
      </div>
      <div className="input-group">
        <label>Type: </label>
        <select onChange={e => setSelectedType(e.target.value)}>
          <option value="">Select Type</option>
          <option value="Urban">Urban</option>
          <option value="Rural">Rural</option>
        </select>
      </div>
      <div className="input-group">
        <label>Category: </label>
        <select onChange={e => setSelectedCategory(e.target.value)}>
          <option value="">Select Category</option>
          <option value="haulage">Haulage Trucks</option>
          <option value="tippers">Tippers</option>
          <option value="transitMixers">Transit Mixers</option>
        </select>
      </div>
      <div className="input-group">
        <label>Model: </label>
        <select onChange={e => setSelectedModel(e.target.value)} disabled={!selectedCategory}>
          <option value="">Select Model</option>
          {selectedCategory && eicherModels[selectedCategory].map(model => <option key={model.name} value={model.name}>{model.name}</option>)}
        </select>
      </div>
      <button className="generate-button" onClick={handleGenerateLeads}>Generate Leads</button>
      <div>
        <h3>Leads</h3>
        {filteredLeads.length === 0 ? <p>No leads found. Please select valid options.</p> : (
          <table>
            <thead><tr><th>Business Name</th><th>Contact Number</th><th>Address</th><th>Area</th><th>Business Type</th><th>Application</th><th>Source</th></tr></thead>
            <tbody>{filteredLeads.map((lead, index) => <tr key={index}><td>{lead.businessName}</td><td>{lead.contactNumber}</td><td>{lead.address}</td><td>{lead.area}</td><td>{lead.businessType}</td><td>{lead.application}</td><td>{lead.source}</td></tr>)}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function MainApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  return isAuthenticated ? <App userName={userName} /> : <Login onLogin={name => { setUserName(name); setIsAuthenticated(true); }} />;
}

ReactDOM.render(<MainApp />, document.getElementById('root'));
