"""
Use GTFS-realtime file from ArcGIS 
"""

import os
import requests
import pandas as pd
from datetime import datetime
from google.transit import gtfs_realtime_pb2

base_path = os.path.dirname(__file__)
gtfs_path = os.path.join(base_path, 'gtfs')
trips = pd.read_csv(os.path.join(gtfs_path, 'trips.txt'))

url = "https://api.cityofkingston.ca/gtfs-realtime/vehicleupdates.pb"

def get_actual_live_bus():
    response = requests.get(url)
    
    feed = gtfs_realtime_pb2.FeedMessage()
    feed.ParseFromString(response.content)
    
    bus_positions = []

    # 4. Extract data
    for entity in feed.entity:
        if entity.HasField('vehicle'):
            v = entity.vehicle
            bus_positions.append({
                "trip_id": v.trip.trip_id,
                "lat": v.position.latitude,
                "lon": v.position.longitude,
                "vehicle_id": v.vehicle.id,
                "timestamp": v.timestamp
            })
            
    return bus_positions

def get_bus_by_route(target_route):
    
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        feed = gtfs_realtime_pb2.FeedMessage()
        feed.ParseFromString(response.content)
        
        # Map for status integers
        status_map = {0: "Incoming", 1: "Stopped", 2: "En Route"}
        
        matches = []

        for entity in feed.entity:
            if entity.HasField('vehicle'):
                v = entity.vehicle
                
                # Filter by the route_id (this is where "701" lives)
                if v.trip.route_id == str(target_route):
                    matches.append({
                        "route": v.trip.route_id,
                        "vehicle_label": v.vehicle.label, # The bus number on the side
                        "lat": v.position.latitude,
                        "lon": v.position.longitude,
                        "status": status_map.get(v.current_status, "Unknown"),
                        "stop_id": v.stop_id,
                        "last_ping": datetime.fromtimestamp(v.timestamp).strftime('%H:%M:%S')
                    })
                    
        return matches

    except Exception as e:
        print(f"Error fetching route {target_route}: {e}")
        return []
    
buses_701 = get_bus_by_route("701")
for bus in buses_701:
    print(f"Bus {bus['vehicle_label']} is {bus['status']} at {bus['lat']}, {bus['lon']}")