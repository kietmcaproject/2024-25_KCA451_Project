from flask import Flask, render_template, request, redirect, url_for, jsonify, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
import pandas as pd
import pickle
import os
from sklearn.exceptions import NotFittedError

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['SECRET_KEY'] = 'your-secret-key-here'  # Change this to a random secret key
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

# User model
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    name = db.Column(db.String(100))
    age = db.Column(db.Integer)

    def set_password(self, password):
        self.password = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password, password)

@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id)) 

# Load the trained model and metadata
try:
    with open('model/breast_cancer_model.pkl', 'rb') as f:
        model_data = pickle.load(f)
        model = model_data['model']
        FEATURE_ORDER = model_data['feature_order']
    print("✅ Model loaded successfully")
    print(f"Model features: {FEATURE_ORDER}")
except Exception as e:
    print("❌ Failed to load model:", str(e))
    raise e


# login_manager = LoginManager(app)
login_manager.login_view = 'login'  # This sets the default login view

# Add this decorator to enforce login for all routes
@app.before_request
def require_login():
    allowed_routes = ['login', 'register', 'static']  # Routes that don't need auth
    if request.endpoint not in allowed_routes and not current_user.is_authenticated:
        return redirect(url_for('login'))

@app.route('/')
def home():
    return redirect(url_for('login'))

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/support')
def support():
    return render_template('support.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        user = User.query.filter_by(email=email).first()
        
        if not user or not user.check_password(password):
            flash('Invalid email or password', 'error')
            return redirect(url_for('login'))
        
        login_user(user)
        return redirect(url_for('dashboard'))
    
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
        
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        name = request.form.get('name')
        age = request.form.get('age')
        
        if User.query.filter_by(email=email).first():
            flash('Email already registered', 'error')
            return redirect(url_for('register'))
        
        new_user = User(email=email, name=name, age=age)
        new_user.set_password(password)
        
        db.session.add(new_user)
        db.session.commit()
        
        flash('Registration successful! Please log in.', 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html')

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', user=current_user)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))

@app.route('/diagnosis-options')
@login_required
def diagnosis_options():
    return render_template('diagnosis_options.html')

@app.route('/predict')
@login_required
def predict():
    return render_template('predict.html')

@app.route('/manual-entry', methods=['GET', 'POST'])
@login_required
def manual_entry():
    if request.method == 'GET':
        return render_template('manual_entry.html')
    
    if request.method == 'POST':
        try:
            data = request.get_json()
            
            features = [
                float(data['feature_1']),  # mean radius
                float(data['feature_2']),  # mean texture
                float(data['feature_3']),  # mean perimeter
                float(data['feature_4']),  # mean area
                float(data['feature_5']),  # mean smoothness
                float(data['feature_6']),  # mean compactness
                float(data['feature_7']),  # mean concavity
                float(data['feature_8']),  # mean concave points
                float(data['feature_9']),  # mean symmetry
                float(data['feature_10'])  # mean fractal dimension
            ]
            
            input_data = pd.DataFrame([features], columns=[
                'mean radius', 'mean texture', 'mean perimeter', 'mean area',
                'mean smoothness', 'mean compactness', 'mean concavity',
                'mean concave points', 'mean symmetry', 'mean fractal dimension'
            ])
            
            prediction = model.predict(input_data)[0]
            proba = model.predict_proba(input_data)[0]
            confidence = round(max(proba) * 100, 2)
            
            return jsonify({
                "prediction": "Malignant" if prediction == 1 else "Benign",
                "confidence": confidence,
                "status": "success"
            })
            
        except Exception as e:
            return jsonify({
                "error": str(e),
                "message": "Invalid input data"
            }), 400

@app.route('/upload-csv', methods=['GET', 'POST'])
@login_required
def upload_csv():
    if request.method == 'POST':
        if 'csv_file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files['csv_file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400

        try:
            data = pd.read_csv(file)
            required_columns = [
                'mean radius', 'mean texture', 'mean perimeter', 'mean area',
                'mean smoothness', 'mean compactness', 'mean concavity',
                'mean concave points', 'mean symmetry', 'mean fractal dimension'
            ]
            
            if not all(col in data.columns for col in required_columns):
                return jsonify({"error": "Missing required columns."}), 400

            predictions = model.predict(data[required_columns])
            benign_count = int((predictions == 0).sum())
            malignant_count = int((predictions == 1).sum())

            return jsonify({
                "benign_count": benign_count,
                "malignant_count": malignant_count,
                "status": "success"
            })
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return render_template('upload_csv.html')
    
@app.route('/symptom_checker', methods=['GET', 'POST'])
@login_required
def symptom_checker():
    if request.method == 'POST':
        print("✅ Form received:", request.form)
        answers = request.form
        score = 0

        factors = {
            'Lump': answers.get('lump') == 'yes',
            'Pain': answers.get('pain') == 'yes',
            'Shape Change': answers.get('shape_change') == 'yes',
            'Skin Change': answers.get('skin_change') == 'yes',
            'Nipple Irritation': answers.get('nipple_irritation') == 'yes',
            'Discharge': answers.get('discharge') == 'yes',
            'Family History': answers.get('family_history') == 'yes',
            'Smoking/Alcohol': answers.get('smoke_alcohol') == 'yes',
            'Self Exam': answers.get('self_exam') == 'no',
            'Mammogram': answers.get('mammogram') == 'no'
        }

        weights = {
            'Lump': 2, 'Pain': 1, 'Shape Change': 2, 'Skin Change': 2,
            'Nipple Irritation': 1, 'Discharge': 2,
            'Family History': 2, 'Smoking/Alcohol': 1,
            'Self Exam': 1, 'Mammogram': 1
        }

        for symptom, active in factors.items():
            if active:
                score += weights[symptom]

        if score <= 3:
            risk_level = 'Low Risk'
            message = 'Your answers suggest a low risk. Continue monitoring and consult a doctor if needed.'
        elif score <= 6:
            risk_level = 'Moderate Risk'
            message = 'Your answers suggest a moderate risk. Consider scheduling a screening or consult with a doctor.'
        else:
            risk_level = 'High Risk'
            message = 'Your answers suggest a high risk. Please consult a healthcare provider immediately.'

        chart_data = {
            'Low Risk': 1 if risk_level == 'Low Risk' else 0,
            'Moderate Risk': 1 if risk_level == 'Moderate Risk' else 0,
            'High Risk': 1 if risk_level == 'High Risk' else 0
        }

        return render_template(
            'symptom_checker.html',
            score=score,
            risk_level=risk_level,
            message=message,
            chart_data=chart_data
        )

    return render_template('symptom_checker.html', score=None)

# Create database tables
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)