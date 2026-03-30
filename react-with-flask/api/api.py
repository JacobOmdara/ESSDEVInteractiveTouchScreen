import time
from flask import Flask
# You'll need flask_cors and jsonify for your eventual dashboard endpoints
from flask import jsonify 
from flask_cors import CORS 
import requests
from google.transit import gtfs_realtime_pb2
from datetime import datetime

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
    
    # Open-Meteo API URL for current weather
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,weather_code&timezone=America/New_York"
    
    try:
        response = requests.get(url)
        response.raise_for_status() # Raise an error for bad status codes
        data = response.json()
        
        # Extract the current temperature
        current_temp = data['current']['temperature_2m']
        
        return jsonify({
            "city": "Kingston",
            "temperature": current_temp,
            "unit": "°C"
        })
    except Exception as e:
        return jsonify({"error": "Failed to fetch weather data", "details": str(e)}), 500

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

# ----------------------------------------------------
# CRUCIAL RUN BLOCK:
# ----------------------------------------------------

if __name__ == '__main__':
    # Runs the application on the required port 5000
    app.run(debug=False, port=5000)