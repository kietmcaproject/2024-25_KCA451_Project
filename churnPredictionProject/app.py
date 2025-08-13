from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_session import Session
import smtplib
from email.mime.text import MIMEText
import random
import time
import pickle
import pandas as pd
import numpy as np
import sklearn

app = Flask(__name__)

# Configure session to use filesystem
app.config['SECRET_KEY'] = 'your-secret-key'  # Replace with a secure key
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

# Load the model and encoders
with open('model/customer_churn_prediction_model.pkl', 'rb') as f:
    model_data = pickle.load(f)
    model = model_data['model']
    features_name = model_data['features_name']

with open('model/encoders.pkl', 'rb') as f:
    encoders = pickle.load(f)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/web')
def web():
    return render_template('web.html')

@app.route('/predict', methods=['POST'])
def predict():
    # Extract form data
    input_data = {
        'gender': request.form['a'],  # Gender
        'SeniorCitizen': int(request.form['b']),  # SeniorCitizen
        'Partner': request.form['c'],  # Partner
        'Dependents': request.form['d'],  # Dependents
        'tenure': int(request.form['e']),  # Tenure
        'PhoneService': request.form['f'],  # PhoneService
        'MultipleLines': request.form['g'],  # MultipleLines
        'InternetService': request.form['h'],  # InternetService
        'OnlineSecurity': request.form['i'],  # OnlineSecurity
        'OnlineBackup': request.form['j'],  # OnlineBackup
        'DeviceProtection': request.form['k'],  # DeviceProtection
        'TechSupport': request.form['l'],  # TechSupport
        'StreamingTV': request.form['m'],  # StreamingTV
        'StreamingMovies': request.form['n'],  # StreamingMovies
        'Contract': request.form['o'],  # Contract
        'PaperlessBilling': request.form['p'],  # PaperlessBilling
        'PaymentMethod': request.form['q'],  # PaymentMethod
        'MonthlyCharges': float(request.form['r']),  # MonthlyCharges
        'TotalCharges': float(request.form['s'])  # TotalCharges
    }

    # Convert input data to DataFrame
    input_data_df = pd.DataFrame([input_data])

    # Encode categorical variables using the saved encoders
    for column, encoder in encoders.items():
        try:
            input_data_df[column] = encoder.transform(input_data_df[column])
        except ValueError as e:
            return render_template('web.html', prediction_text=f"Error: Invalid input for {column}. Please select a valid option.", prob_text="")

    # Ensure the features are in the correct order
    input_data_df = input_data_df[features_name]

    # Make prediction
    try:
        prediction = model.predict(input_data_df)
        prediction_text = "The customer is likely to churn." if prediction[0] == 1 else "The customer is not likely to churn."

        # Get prediction probability
        prob = model.predict_proba(input_data_df)[0]
        prob_text = f"Probability of Churn: {prob[1]*100:.2f}% | Probability of No Churn: {prob[0]*100:.2f}%"
    except Exception as e:
        return render_template('web.html', prediction_text=f"Error during prediction: {str(e)}", prob_text="")

    return render_template('web.html', prediction_text=prediction_text, prob_text=prob_text)

@app.route('/send-otp', methods=['POST'])
def send_otp():
    email = request.form.get('email')
    if not email:
        return jsonify({'success': False, 'message': 'Email is required.'}), 400

    # Generate a 6-digit OTP
    otp = str(random.randint(100000, 999999))

    # Store the OTP and timestamp in the session
    session['otp'] = otp
    session['email'] = email
    session['otp_timestamp'] = time.time()  # Store the current timestamp

    # Send the OTP via email
    try:
        sender_email = "churn.predictionotp@gmail.com"  # Your Gmail address
        sender_password = "gkbt eqxb kcqj nwwa"  # Your Gmail App Password
        subject = "Your OTP for Churn Prediction"
        body = f"Your OTP is: {otp}\nThis OTP is valid for 2 minutes."

        msg = MIMEText(body)
        msg['Subject'] = subject
        msg['From'] = sender_email
        msg['To'] = email

        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, email, msg.as_string())

        return jsonify({'success': True, 'message': 'OTP sent to your email.'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Failed to send OTP: {str(e)}'}), 500

@app.route('/verify-otp', methods=['POST'])
def verify_otp():
    user_otp = request.form.get('otp')
    if not user_otp:
        return jsonify({'success': False, 'message': 'OTP is required.'}), 400

    # Check if OTP exists in session
    if 'otp' not in session or 'otp_timestamp' not in session:
        return jsonify({'success': False, 'message': 'No OTP found. Please request a new OTP.'}), 400

    # Check if OTP has expired (2 minutes = 120 seconds)
    current_time = time.time()
    otp_timestamp = session['otp_timestamp']
    if (current_time - otp_timestamp) > 120:
        # Clear the session
        session.pop('otp', None)
        session.pop('otp_timestamp', None)
        session.pop('email', None)
        return jsonify({'success': False, 'message': 'OTP has expired. Please request a new OTP.'}), 400

    # Verify the OTP
    stored_otp = session['otp']
    if user_otp == stored_otp:
        # Clear the session after successful verification
        session.pop('otp', None)
        session.pop('otp_timestamp', None)
        session.pop('email', None)
        return jsonify({'success': True, 'message': 'OTP verified successfully.', 'redirect': url_for('web')})
    else:
        return jsonify({'success': False, 'message': 'Invalid OTP. Please try again.'}), 400

@app.route('/submit-feedback', methods=['POST'])
def submit_feedback():
    name = request.form.get('name')
    email = request.form.get('email')  # Email is now mandatory
    feedback = request.form.get('feedback')

    # Validate required fields (including email)
    if not name or not email or not feedback:
        return jsonify({'success': False, 'message': 'Name, email, and feedback are required.'}), 400

    # Validate email format
    email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    import re
    if not re.match(email_regex, email):
        return jsonify({'success': False, 'message': 'Please provide a valid email address.'}), 400

    # Compose the email
    try:
        sender_email = "churn.predictionotp@gmail.com"  # Your Gmail address
        sender_password = "gkbt eqxb kcqj nwwa"  # Your Gmail App Password
        receiver_email = "churn.predictionotp@gmail.com"  # Send to the same email
        subject = "New Feedback from Customer Churn Prediction App"
        body = f"Name: {name}\nEmail: {email}\nFeedback:\n{feedback}"

        msg = MIMEText(body)
        msg['Subject'] = subject
        msg['From'] = sender_email
        msg['To'] = receiver_email

        # Send the email
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, receiver_email, msg.as_string())

        return jsonify({'success': True, 'message': 'Thank you for your feedback!'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Failed to send feedback: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)