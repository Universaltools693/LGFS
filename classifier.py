from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import TfidfVectorizer
import spacy

nlp = spacy.load("en_core_web_sm")

def classify_leads(leads, applications):
    vectorizer = TfidfVectorizer()
    classifier = MultinomialNB()
    
    X_train = [
        "logistics transport fleet", 
        "construction mining cement", 
        "courier fmcg delivery", 
        "lpg gas tanker petroleum", 
        "chemical market lot", 
        "agriculture farming"
    ]
    y_train = ["Logistics", "Construction", "Courier", "LPG", "Chemical", "Agriculture"]
    X_train_vec = vectorizer.fit_transform(X_train)
    classifier.fit(X_train_vec, y_train)
    
    classified_leads = []
    for lead in leads:
        doc = nlp(lead.get("Business Name", "") + " " + lead.get("Business Address", ""))
        text = " ".join([token.text for token in doc])
        X_vec = vectorizer.transform([text])
        business_type = classifier.predict(X_vec)[0]
        
        business_scale = "Medium"
        if "ltd" in lead.get("Business Name", "").lower():
            business_scale = "Big Broad"
        elif "pvt" in lead.get("Business Name", "").lower():
            business_scale = "Broad"
        elif len(text) < 50:
            business_scale = "Small"
        
        if business_type in applications:
            lead["Business Type"] = business_type
            lead["Business Scale"] = business_scale
            classified_leads.append(lead)
    
    return classified_leads
