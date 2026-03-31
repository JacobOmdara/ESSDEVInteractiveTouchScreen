import time
from flask import Flask
# You'll need flask_cors and jsonify for your eventual dashboard endpoints
from flask import jsonify 
from flask_cors import CORS 
import requests
from google.transit import gtfs_realtime_pb2
from datetime import datetime, timedelta
import feedparser                          # add this line

app = Flask(__name__)
CORS(app) # Necessary to allow your React frontend (on port 3000) to connect

# Test Endpoint from the tutorial
@app.route('/api/time')
def get_current_time():
    return {'time': time.time()}

# ----------------------------------------------------
# Add your required Empty Endpoints here:
# ----------------------------------------------------

@app.route('/api/weather')
def get_weather():
    # Coordinates for Kingston, Ontario
    lat = 44.2312
    lon = -76.4860
    
    # Notice the URL change: we are asking for daily max, min, and weather codes
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=America/New_York"
    
    try:
        response = requests.get(url)
        response.raise_for_status() 
        data = response.json()
        
        # Open-Meteo returns parallel arrays for daily data. Let's extract them:
        daily_data = data['daily']
        dates = daily_data['time']
        max_temps = daily_data['temperature_2m_max']
        min_temps = daily_data['temperature_2m_min']
        weather_codes = daily_data['weather_code']
        
        # Package the 7 days into a nice list for the frontend
        forecast = []
        for i in range(len(dates)):
            forecast.append({
                "date": dates[i],
                "max_temp": round(max_temps[i]), # Rounding to make it look cleaner
                "min_temp": round(min_temps[i]),
                "weather_code": weather_codes[i]
            })
            
        return jsonify({
            "city": "Kingston",
            "forecast": forecast,
            "unit": "°C"
        })
    except Exception as e:
        return jsonify({"error": "Failed to fetch weather forecast", "details": str(e)}), 500

@app.route('/transit')
def transit():
    return jsonify({"service": "transit", "status": "placeholder"})

GTFS_URL = "https://api.cityofkingston.ca/gtfs-realtime/vehicleupdates.pb"
STATUS_MAP = {0: "Incoming", 1: "Stopped", 2: "En Route"}
@app.route('/api/buses/<route_id>', methods=['GET'])
def get_buses_by_route(route_id):
    try:
        response = requests.get(GTFS_URL, timeout=5)
        response.raise_for_status()
        
        feed = gtfs_realtime_pb2.FeedMessage()
        feed.ParseFromString(response.content)
        
        matches = []
        for entity in feed.entity:
            if entity.HasField('vehicle'):
                v = entity.vehicle
                
                # Kingston route_ids are strings like "701"
                if v.trip.route_id == str(route_id):
                    matches.append({
                        "id": v.vehicle.id,
                        "label": v.vehicle.label or "Bus",
                        "lat": v.position.latitude,
                        "lon": v.position.longitude,
                        "status": STATUS_MAP.get(v.current_status, "Unknown"),
                        "last_updated": datetime.fromtimestamp(v.timestamp).strftime('%H:%M:%S')
                    })
        
        return jsonify({
            "route": route_id,
            "buses": matches,
            "count": len(matches),
            "server_time": datetime.now().strftime('%H:%M:%S')
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/events')
def events():
    return jsonify({"service": "events", "status": "placeholder"})

@app.route('/health')
def health_check():
    return jsonify({"status": "healthy"})

_news_cache = {"data": None, "fetched_at": None}
NEWS_CACHE_TTL = timedelta(weeks=1)  # also rename to avoid clashing with CACHE_TTL if you add more later
@app.route('/api/news')
def get_news():
    global _news_cache
    if _news_cache["data"] and datetime.now() - _news_cache["fetched_at"] < NEWS_CACHE_TTL:
        return jsonify(_news_cache["data"])
    
    feed = feedparser.parse("https://www.queensjournal.ca/feed")
    articles = [
        {
            "title": e.title,
            "link": e.link,
            "author": getattr(e, "author", None),
            "pubDate": e.published,
            "categories": [t.term for t in getattr(e, "tags", [])],
            "thumbnail": getattr(e, "media_thumbnail", [{}])[0].get("url"),
        }
        for e in feed.entries
    ]
    _news_cache = {"data": articles, "fetched_at": datetime.now()}
    return jsonify(articles)

@app.route('/api/golden-words')
def get_golden_words():
    try:
        res = requests.get('https://goldenwords.ca/?page_id=63', timeout=5)
        res.raise_for_status()
        html = res.text

        import re
        match = re.search(r'<iframe[^>]+src="(https://docs\.google\.com/viewer[^"]+)"', html)
        if not match:
            return jsonify({"error": "Could not find PDF link"}), 404

        pdf_url = match.group(1).replace('&amp;', '&')
        return jsonify({"pdf_url": pdf_url})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# ----------------------------------------------------
# CRUCIAL RUN BLOCK:
# ----------------------------------------------------

if __name__ == '__main__':
    # Runs the application on the required port 5000
    app.run(debug=False, port=5000)