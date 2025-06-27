const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeLeads() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  const sources = [
    { url: 'https://www.justdial.com/Jabalpur/Transporters', selector: '.store-details', extract: item => ({ businessName: item.querySelector('.lng_cont_name')?.innerText || 'Unknown', contactNumber: item.querySelector('.mobilesv')?.innerText || 'N/A', address: item.querySelector('.address-info')?.innerText || 'N/A', area: 'Ranjhi', areaType: 'Urban', businessType: 'Medium Logistics', application: 'Marble transport, FMCG', model: 'Pro 3019', source: 'Justdial' }) },
    { url: 'https://dir.indiamart.com/jabalpur/transporters.html', selector: '.lstg', extract: item => ({ businessName: item.querySelector('.lstg-hd')?.innerText || 'Unknown', contactNumber: item.querySelector('.cll')?.innerText || 'N/A', address: item.querySelector('.lstg-add')?.innerText || 'N/A', area: 'Gorakhpur', areaType: 'Urban', businessType: 'Small Logistics', application: 'FMCG, parcels', model: 'Pro 3019', source: 'IndiaMART' }) },
    { url: 'https://www.sulekha.com/transporters/jabalpur', selector: '.list-item', extract: item => ({ businessName: item.querySelector('.title')?.innerText || 'Unknown', contactNumber: item.querySelector('.contact-number')?.innerText || 'N/A', address: item.querySelector('.address')?.innerText || 'N/A', area: 'Adhartal', areaType: 'Urban', businessType: 'Medium Logistics', application: 'FMCG, industrial goods', model: 'Pro 3019', source: 'Sulekha' }) }
  ];

  const allLeads = [];
  for (const source of sources) {
    await page.goto(source.url, { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
    const leads = await page.evaluate(source => {
      const results = [];
      const items = document.querySelectorAll(source.selector);
      items.forEach(item => results.push(source.extract(item)));
      return results;
    }, source);
    allLeads.push(...leads);
  }

  const uniqueLeads = Array.from(new Set(allLeads.map(JSON.stringify))).map(JSON.parse).filter(lead => lead.contactNumber !== 'N/A');
  fs.writeFileSync('leads.json', JSON.stringify(uniqueLeads, null, 2));
  await browser.close();
  return uniqueLeads;
}

scrapeLeads().then(leads => console.log('Scraped Leads:', leads));
