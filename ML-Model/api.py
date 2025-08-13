import os
import joblib
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.preprocessing import MinMaxScaler
import xgboost as xgb

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Define relative paths
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
MODEL_DIR = BASE_DIR
MODEL_PATH = os.path.join(MODEL_DIR, 'nba_model.pkl')
SCALER_PATH = os.path.join(MODEL_DIR, 'scaler.pkl')
FEATURE_COLS_PATH = os.path.join(MODEL_DIR, 'feature_columns.pkl')
PREDICTIONS_FILE = os.path.join(MODEL_DIR, 'predictions.csv')

# Validate paths
for path in [MODEL_PATH, SCALER_PATH, FEATURE_COLS_PATH, PREDICTIONS_FILE]:
    if not os.path.exists(path):
        raise FileNotFoundError(f"❌ Missing required file: {path}")

# Load model, scaler, and feature columns
model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)
feature_cols = joblib.load(FEATURE_COLS_PATH)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        input_df = pd.DataFrame([data])
        input_df = input_df[feature_cols]
        input_df = scaler.transform(input_df)
        prediction = model.predict(input_df)
        probability = model.predict_proba(input_df)[:, 1]
        return jsonify({"prediction": int(prediction[0]), "win_probability": float(probability[0])})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/predictions', methods=['GET'])
def get_predictions():
    if os.path.exists(PREDICTIONS_FILE):
        predictions = pd.read_csv(PREDICTIONS_FILE)
        return predictions.to_json(orient='records')
    else:
        return jsonify({"error": "Predictions file not found."}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)