from fastapi import FastAPI
from fastapi.responses import FileResponse
import pandas as pd
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table
from scraper import scrape_leads
from classifier import classify_leads

app = FastAPI()

model_applications = {
    "Pro 3015": ["Logistics", "Construction", "Agriculture"],
    "Pro 3019": ["Logistics", "Construction"],
    "Pro 2049XP": ["Construction", "Mining"],
    "Pro 6028TM": ["Construction"]
}

areas = {
    "Jabalpur": {"Urban": ["Gwarighat", "Sadar", "Manegaon"], "Rural": ["Tewar", "Bargi"]},
    "Mandla": {"Urban": [], "Rural": ["Mandla Village"]},
    "Dindori": {"Urban": [], "Rural": ["Dindori Village"]},
    "Damoh": {"Urban": ["Damoh City"], "Rural": []},
    "Katni": {"Urban": ["Katni City"], "Rural": []},
    "Narsinghpur": {"Urban": [], "Rural": ["Narsinghpur Village"]},
    "Gadarwara": {"Urban": [], "Rural": ["Gadarwara Village"]},
    "Seoni": {"Urban": [], "Rural": ["Seoni Village"]},
    "Lakhnadon": {"Urban": [], "Rural": ["Lakhnadon Village"]}
}

models = {
    "Haulage Trucks/Tractors": ["Pro 3015", "Pro 3019"],
    "Tippers": ["Pro 2049XP"],
    "Transit Mixers": ["Pro 6028TM"]
}

@app.get("/api/areas")
async def get_areas(district: str, type: str):
    return areas.get(district, {}).get(type, [])

@app.get("/api/models")
async def get_models(type: str):
    return models.get(type, [])

@app.get("/api/leads")
async def get_leads(district: str, type: str, model: str):
    raw_leads = await scrape_leads(district, type)
    classified_leads = classify_leads(raw_leads, model_applications[model])
    return classified_leads

@app.get("/api/download")
async def download_leads(format: str, district: str, type: str, model: str):
    raw_leads = await scrape_leads(district, type)
    leads = classify_leads(raw_leads, model_applications[model])
    df = pd.DataFrame(leads)
    
    if format == "excel":
        df.to_excel("leads.xlsx", index=False)
        return FileResponse("leads.xlsx", filename="leads.xlsx")
    else:
        doc = SimpleDocTemplate("leads.pdf", pagesize=letter)
        table = Table([["Business Name", "Owner Name", "Owner Contact Number", "Owner House Address", "Business Address", "Office Contact Number", "Manager Name", "Manager Contact Number", "Manager Address", "Business Scale", "Business Type"]] + 
                      [[lead.get("Business Name", "NA"), lead.get("Owner Name", "NA"), lead.get("Owner Contact Number", "NA"), lead.get("Owner House Address", "NA"), lead.get("Business Address", "NA"), lead.get("Office Contact Number", "NA"), lead.get("Manager Name", "NA"), lead.get("Manager Contact Number", "NA"), lead.get("Manager Address", "NA"), lead.get("Business Scale", "NA"), lead.get("Business Type", "NA")] for lead in leads])
        doc.build([table])
        return FileResponse("leads.pdf", filename="leads.pdf")
