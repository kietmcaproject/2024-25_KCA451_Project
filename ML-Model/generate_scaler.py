import os
import joblib
from sklearn.preprocessing import MinMaxScaler

# Create a new scaler
scaler = MinMaxScaler()

# Fit scaler with dummy data
dummy_data = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
scaler.fit(dummy_data)

# Save Scaler
MODEL_DIR = r"D:\Fantasy-Basketball-main\ML-Model"
os.makedirs(MODEL_DIR, exist_ok=True)

SCALER_PATH = os.path.join(MODEL_DIR, "scaler.pkl")
joblib.dump(scaler, SCALER_PATH)

print(f"✅ Dummy Scaler saved successfully at {SCALER_PATH}")
