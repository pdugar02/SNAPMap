import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for the entire app

# Load the CSV data into a Pandas DataFrame
SNAP = pd.read_csv('SNAP.csv')

@app.route('/api/stores', methods=['GET'])
def get_stores():
    # Query parameter for filtering by ZIP Code
    zip_code = request.args.get('zip_code', None)
    print(f"ZIP code received: {zip_code}")  # Debugging statement

    # If ZIP code is provided, filter the DataFrame by the given ZIP code
    if zip_code:
        print(zip_code)
        filtered_data = SNAP[(SNAP['Latitude'] != 0) & (SNAP['Longitude'] != 0)]
        filtered_data = filtered_data.dropna(subset=['Latitude', 'Longitude'])
        filtered_data = filtered_data[
            (filtered_data['Latitude'].astype(str).str.strip() != '') & 
            (filtered_data['Longitude'].astype(str).str.strip() != '')
        ]
        filtered_data = filtered_data[filtered_data["Zip Code"].astype(str) == zip_code]
        # If no data is found for the given ZIP code, return an empty list
        if filtered_data.empty:
            print("No data found for ZIP code")
            return jsonify([]), 200
        
        # Extract only latitude and longitude columns
        coordinates = filtered_data[['Latitude', 'Longitude']].to_dict(orient='records')
        print(len(coordinates))
        # Return the coordinates as JSON
        print(jsonify(coordinates))
        return jsonify(coordinates), 200
    else:
        # If no ZIP code is provided, return an empty list
        return jsonify([]), 400

if __name__ == '__main__':
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=2000)
