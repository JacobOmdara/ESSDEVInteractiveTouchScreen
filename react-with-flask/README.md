# BMH Interactive Touch Screen Display

This project features a React frontend (powered by Vite) and a Python Flask backend to run an interactive touch screen display.

## Prerequisites
Before you begin, ensure you have the following installed on your machine:
* **[Node.js](https://nodejs.org/)** (v18 or higher recommended) - Includes `npm`.
* **[Python](https://www.python.org/downloads/)** (v3.8 or higher) - Includes `pip`.

---

## 🛠️ Setup Instructions

### 1. Frontend Setup
1. Clone this repository to your local machine.

2. Open a terminal and navigate to the project folder:
   ```bash
   cd react-with-flask

3. npm install

### 2. Backend Setup
1. open terminal and then navigate to api folder
   cd react-with-flask/api

2. create a python virtual environment (only need to create once):
    Windows: python -m venv venv
    Mac/Linux: python3 -m venv venv

3. activate the virtual environment:
    Windows: .\venv\Scripts\activate
    Mac/Linux: source venv/bin/activate

4. Install Python packages (only need to install once):
    pip install -r requirements.txt

### 3. Run the application
To run the application, you need to have 2 terminals open
1. open a terminal with react-with-flask folder

2. run api start script
    npm run api

3. Open a second terminal with react-with-flask folder

3. run the vite development server:
    npm run dev