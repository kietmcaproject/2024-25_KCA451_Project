# Customer Churn Prediction

This project predicts whether a customer is likely to churn (leave a service) based on historical data and machine learning models.

## 📌 Overview
Customer churn is a major problem in subscription-based services and telecom industries.  
This project uses **data analysis** and **machine learning algorithms** to identify patterns that indicate a customer might leave.

## 🚀 Features
- Data preprocessing and cleaning
- Exploratory Data Analysis (EDA) with visualizations
- Model training with multiple algorithms
- Performance evaluation and metrics
- Predictive insights for reducing churn

## 🛠 Technologies Used
- Python
- Pandas, NumPy
- Matplotlib, Seaborn
- Scikit-learn
- Jupyter Notebook

## 📂 Project Structure
CustomerChurnPrediction/
│── files/ # Uploaded/generated files
│── flask_session/ # Flask session storage
│── model/ # Saved ML models
│── static/ # Static assets (CSS, JS, Images)
│── templates/ # HTML templates for Flask
│── Thesis/ # Project thesis/report
│── venv/ # Python virtual environment
│── app.py # Main Flask application
│── apppassword.txt # App-specific password (if required)
│── churn_notebook.ipynb # Jupyter Notebook for EDA & model training
│── howtocreatevenv.png # Guide to create virtual environment
│── requirements.txt # Python dependencies
│── WA_Fn-UseC_-Telco-Customer-Churn.csv # Dataset


---

## 🛠 Technologies Used
- Python  
- Pandas, NumPy  
- Matplotlib, Seaborn  
- Scikit-learn  
- Flask  
- Jupyter Notebook  

---

## 🚀 How to Run

### 1️⃣ Clone the Repository
git clone <repo-link>
cd <repo-folder>

2️⃣ Create a Virtual Environment

python -m venv venv

3️⃣ Activate the Virtual Environment

Windows (CMD):
venv\Scripts\activate

Windows (PowerShell):
venv\Scripts\Activate.ps1

Mac/Linux:
source venv/bin/activate

4️⃣ Install Dependencies

pip install -r requirements.txt

5️⃣ Run the Flask App

python app.py

The app will start on http://127.0.0.1:5000/

📊 How It Works

Load dataset from WA_Fn-UseC_-Telco-Customer-Churn.csv.
Perform EDA & preprocessing in churn_notebook.ipynb.
Train multiple ML models and save the best one in /model.
Serve predictions via app.py using Flask.

📧 Contact
For queries or collaboration, contact me at shubhamtiwari0131@gmail.com


