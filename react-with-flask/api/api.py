import time
from flask import Flask
# You'll need flask_cors and jsonify for your eventual dashboard endpoints
from flask import jsonify 
from flask_cors import CORS 

app = Flask(__name__)
CORS(app) # Necessary to allow your React frontend (on port 3000) to connect

# Test Endpoint from the tutorial
@app.route('/api/time')
def get_current_time():
    return {'time': time.time()}

# ----------------------------------------------------
# Add your required Empty Endpoints here:
# ----------------------------------------------------

@app.route('/weather')
def weather():
    return jsonify({"service": "weather", "status": "placeholder"})

@app.route('/transit')
def transit():
    return jsonify({"service": "transit", "status": "placeholder"})

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