import asyncio
import aiohttp
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
from geopy.geocoders import Nominatim
import spacy
import re

nlp = spacy.load("en_core_web_sm")
geolocator = Nominatim(user_agent="eicher_leads")

async def scrape_source(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.text()

async def scrape_leads(district, area_type):
    sources = [
        f"https://www.justdial.com/{district}/Truck-Transport",
        f"https://www.indiamart.com/search.html?ss=Truck+Buyers+{district}",
        f"https://www.olx.in/{district}/q-truck",
        f"https://www.google.com/maps/search/logistics+{district}",
        f"https://www.mca.gov.in/content/mca/global/en/data-and-reports/roc.html?filter={district}",
        f"https://www.linkedin.com/search/results/companies/?keywords=logistics%20{district}",
        f"https://www.trucksuvidha.com/loadboard?location={district}",
        f"https://www.dainikbhaskar.com/local/madhya-pradesh/{district}/classifieds",
        # Add remaining 45 sources
    ]
    
    leads = []
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        for url in sources:
            try:
                await page.goto(url, timeout=30000)
                content = await page.content()
                soup = BeautifulSoup(content, 'html.parser')
                
                doc = nlp(soup.get_text())
                for ent in doc.ents:
                    lead = {
                        "lead_id": str(hash(ent.text + district)),
                        "Business Name": ent.text if ent.label_ == "ORG" else "NA",
                        "Owner Name": "NA",
                        "Owner Contact Number": "NA",
                        "Owner House Address": "NA",
                        "Business Address": "NA",
                        "Office Contact Number": "NA",
                        "Manager Name": "NA",
                        "Manager Contact Number": "NA",
                        "Manager Address": "NA",
                        "Business Scale": "NA",
                        "Business Type": "NA",
                        "district": district,
                        "area_type": area_type
                    }
                    phone = re.search(r'(\+91)?[6-9]\d{9}', soup.get_text())
                    if phone:
                        lead["Owner Contact Number"] = phone.group()
                        lead["Office Contact Number"] = phone.group()
                    address = geolocator.geocode(f"{ent.text}, {district}, Madhya Pradesh")
                    if address:
                        lead["Business Address"] = address.address
                    leads.append(lead)
            except Exception:
                continue
        
        await browser.close()
    
    return leads  # Unlimited leads
