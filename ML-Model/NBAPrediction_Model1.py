import os
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import TimeSeriesSplit
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import accuracy_score
import xgboost as xgb

# ✅ Define MODEL_DIR early
MODEL_DIR = r"D:\Fantasy-Basketball-main\ML-Model"

# ✅ Ensure Correct File Path
DATA_FILE = r"D:\Fantasy-Basketball-main\ML-Model\nba_data_up_to.csv"

if not os.path.exists(DATA_FILE):
    raise FileNotFoundError(f"❌ Missing dataset: {DATA_FILE}. Please check the file path.")

# ✅ Load Data
df = pd.read_csv(DATA_FILE, index_col=0)
print("✅ Data loaded successfully!")

# ✅ Debugging: Check raw data
print(f"🛠️ DEBUG: Initial rows: {df.shape[0]}, columns: {df.shape[1]}")
print(f"🛠️ DEBUG: Columns in dataset: {df.columns.tolist()}")
print(f"🛠️ DEBUG: Sample Data:\n{df.head()}")

# ✅ Preprocess Data
df = df.sort_values("date").reset_index(drop=True)
df = df.drop(columns=["mp.1", "mp_opp.1", "index_opp"], errors="ignore")

# ✅ Debugging: Check after dropping unnecessary columns
print(f"🛠️ DEBUG: Rows after dropping unused columns: {df.shape[0]}")

# ✅ Ensure 'won' column is properly formatted
if df["won"].dtype != np.int64 and df["won"].dtype != np.int32:
    print("⚠️ Converting 'won' column to integer values (0/1)...")
    df["won"] = df["won"].astype(int)

# ✅ Handle Missing Values (Drop only irrelevant ones)
df = df.dropna(subset=["won"]).reset_index(drop=True)

# ✅ Debugging: Check missing values
missing_values = df.isnull().sum()
print(f"🛠️ DEBUG: Missing values:\n{missing_values[missing_values > 0]}")

# ✅ Create Target Column (Win/Loss for Next Game)
df["target"] = df.groupby("team", group_keys=False)["won"].shift(-1)

# ✅ Fix missing target values
df["target"] = df["target"].fillna(method="bfill")  # Use next available value
df["target"] = df["target"].fillna(method="ffill")  # Use previous available value
df["target"] = df["target"].astype(int)

# ✅ Debugging: Check number of valid rows after target column creation
print(f"🛠️ DEBUG: Rows after fixing target column: {df.shape[0]}")

if df.shape[0] == 0:
    raise ValueError("❌ Error: No valid rows found after fixing target column.")

# ✅ Feature Selection
excluded_cols = ["won", "target", "team", "date", "season", "team_opp"]
feature_cols = [col for col in df.columns if col not in excluded_cols]

# ✅ Debugging: Check feature selection
print(f"🛠️ DEBUG: Selected feature columns: {feature_cols}")

# ✅ Ensure Features Exist Before Scaling
if not feature_cols:
    raise ValueError("❌ Error: No valid feature columns found for scaling.")

# ✅ Ensure Data Exists Before Scaling
if df[feature_cols].shape[0] == 0:
    raise ValueError("❌ Error: No valid rows found for scaling. Check preprocessing steps.")

# ✅ Scale Features
scaler = MinMaxScaler()
df.loc[:, feature_cols] = scaler.fit_transform(df[feature_cols])

# ✅ Debugging: Check if data is still valid after scaling
print(f"🛠️ DEBUG: Rows after scaling: {df.shape[0]}")

# ✅ Train AI Model (XGBoost)
xgb_model = xgb.XGBClassifier(
    n_estimators=100,
    learning_rate=0.05,
    max_depth=5,
    random_state=42  # For reproducibility
)
data_split = TimeSeriesSplit(n_splits=3)

# ✅ Train/Test Split for Backtesting
def backtest(data, model, predictors, start=2, step=1):
    prediction_dfs = []
    all_seasons = sorted(data["season"].unique())

    for i in range(start, len(all_seasons), step):
        curr_season = all_seasons[i]
        train = data[data["season"] < curr_season]
        test = data[data["season"] == curr_season]

        if train.shape[0] == 0 or test.shape[0] == 0:
            print(f"⚠️ Skipping season {curr_season} due to insufficient data.")
            continue

        model.fit(train[predictors], train["target"])
        test_prediction = model.predict(test[predictors])
        test_prediction = pd.Series(test_prediction, index=test.index)

        combined_vals = pd.concat([test["target"], test_prediction], axis=1)
        combined_vals.columns = ["actual", "prediction"]

        prediction_dfs.append(combined_vals)

    if not prediction_dfs:
        raise ValueError("❌ Error: No valid test sets found in backtesting.")

    return pd.concat(prediction_dfs)

# ✅ Run Backtest
predictions = backtest(df, xgb_model, feature_cols)
accuracy = accuracy_score(predictions["actual"], predictions["prediction"])
print(f"🎯 Model Accuracy: {accuracy:.2%}")

# ✅ Save Predictions to CSV for Frontend
PREDICTIONS_FILE = os.path.join(MODEL_DIR, "predictions.csv")

# Ensure predictions are not empty
if not predictions.empty:
    # Merge predictions with team and date info
    predictions["team"] = df.loc[predictions.index, "team"]
    predictions["season"] = df.loc[predictions.index, "season"]
    predictions["date"] = df.loc[predictions.index, "date"]

    # Save the predictions to CSV
    predictions = predictions.reset_index(drop=True)
    predictions.to_csv(PREDICTIONS_FILE, index=False)
    print(f"✅ Predictions saved successfully at {PREDICTIONS_FILE}")
else:
    print("❌ Error: No predictions generated, skipping CSV save.")

# ✅ Ensure Directory Exists Before Saving Model and Scaler
os.makedirs(MODEL_DIR, exist_ok=True)

# ✅ Save Model for Flask API
MODEL_PATH = os.path.join(MODEL_DIR, "nba_model.pkl")
joblib.dump(xgb_model, MODEL_PATH)
print(f"✅ Model saved successfully at {MODEL_PATH}")

# ✅ Save Scaler for Flask API
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.pkl")
joblib.dump(scaler, SCALER_PATH)
print(f"✅ Scaler saved successfully at {SCALER_PATH}")
