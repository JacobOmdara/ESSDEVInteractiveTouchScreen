"""

Parse General Transit Feed Specification (GTFS) static data
to display expected transit times based on day, time, and bus

GTFS provided by the City of Kingston (last updated 12/18/2024):
https://opendatakingston.cityofkingston.ca/search?tags=gtfs

We can store parsed results into a cache since they will be expected to be repurposed!
The function defined here will extract bus stops based on the current time

Considerations for future ESSDEV developers:
- GTFS provided by the city of Kingston is outdated, data is prone to being unreliable if changes have been made
- This stands for get_manual_service, which uses a mock calendar to obtain stop times for weekdays and weekends (no holidays)
"""
import os
import pandas as pd
from datetime import datetime, timedelta

base_path = os.path.dirname(__file__)
gtfs_path = os.path.join(base_path, 'gtfs')

stops = pd.read_csv(os.path.join(gtfs_path, 'stops.txt'))
trips = pd.read_csv(os.path.join(gtfs_path, 'trips.txt'))
calendar_dates = pd.read_csv(os.path.join(gtfs_path, 'calendar_dates.txt'))
stop_times = pd.read_csv(os.path.join(gtfs_path, 'stop_times.txt'))

# mock calendar for determining service ID
def get_manual_service_id():
    weekday = datetime.now().weekday()
    if weekday < 5: # monday - friday
        return "1615"
    elif weekday == 5: # saturday
        return "1701"
    else: # sunday
        return "1708"

def extract_static_data(stop_id):
    # stop id corresponds to Brock/Barrie, which is next to the metro
    active_service = get_manual_service_id()
    valid_trips = trips[trips['service_id'].astype(str) == active_service]
    relevant_stops = stop_times[stop_times['stop_id'] == stop_id].copy()

    # Get the current time in HH:MM:SS format to find upcoming trips, give 20 minute leeway to help student prepare
    now = datetime.now()
    leeway = now + timedelta(minutes = 20)

    leeway_str = leeway.strftime("%H:%M:%S")

    # filter for trips that haven't happened yet today
    upcoming_stops = relevant_stops[relevant_stops['arrival_time'] > leeway_str]

    # MERGE with trips.txt to see the headsigns/route info
    final_schedule = pd.merge(upcoming_stops, valid_trips, on='trip_id')

    # Sort by time and pick the top one
    next_trip = final_schedule.sort_values('arrival_time').iloc[0]

    print(f"The next trip_id is: {next_trip['trip_id']}")
    print(f"Destination: {next_trip['trip_headsign']} at {next_trip['arrival_time']}")

    df = (
        stop_times[stop_times.trip_id == next_trip['trip_id']]
        .sort_values("stop_sequence")
        .merge(stops[["stop_id", "stop_name"]], on="stop_id")
    )
    # print(df)
    return df

print(extract_static_data("S00292"))