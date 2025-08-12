import cv2
import numpy as np
import pytesseract
from datetime import datetime
import RPi.GPIO as GPIO
import time
import requests
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from threading import Thread
from pymongo import MongoClient
  
# Initialize Flask app
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Set up the GPIO pins for the ultrasonic sensors
TRIG_LEFT = 17  # Ultrasonic sensor 1 trigger pin (left side)
ECHO_LEFT = 18  # Ultrasonic sensor 1 echo pin (left side)
TRIG_RIGHT = 23  # Ultrasonic sensor 2 trigger pin (right side)
ECHO_RIGHT = 24  # Ultrasonic sensor 2 echo pin (right side)

GPIO.setmode(GPIO.BCM)
GPIO.setup(TRIG_LEFT, GPIO.OUT)
GPIO.setup(ECHO_LEFT, GPIO.IN)
GPIO.setup(TRIG_RIGHT, GPIO.OUT)
GPIO.setup(ECHO_RIGHT, GPIO.IN)

# Connect to MongoDB
client = MongoClient('mongodb+srv://parth:parth@cluster0.joitg.mongodb.net/')  # Replace with your MongoDB URI if using Atlas
db = client['echallan']  # Create or connect to 'echallan' database

# Collections for violations and vehicle owners
violations_collection = db['violations']
vehicle_owners_collection = db['vehicle_owners']

# Load YOLO vehicle detection model
net = cv2.dnn.readNet("yolov3.weights", "yolov3.cfg")  # Ensure correct paths
layer_names = net.getLayerNames()
output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers()]

# Initialize the vehicle tracks dictionary
vehicle_tracks = {}
vehicle_id = 0

# ThingSpeak API key and channel ID
thingspeak_api_key = "YOUR_THINGSPEAK_API_KEY"
thingspeak_channel_id = "YOUR_THINGSPEAK_CHANNEL_ID"

# Email account information
email_address = "your_email_address"
email_password = "your_email_password"

def measure_distance(trigger_pin, echo_pin):
    # Trigger the ultrasonic sensor
    GPIO.output(trigger_pin, True)
    time.sleep(0.00001)  # 10 microseconds
    GPIO.output(trigger_pin, False)

    # Measure the time it takes for the echo to return
    while GPIO.input(echo_pin) == 0:
        pulse_start = time.time()

    while GPIO.input(echo_pin) == 1:
        pulse_end = time.time()

    pulse_duration = pulse_end - pulse_start
    distance = pulse_duration * 17150  # Distance in cm
    return distance

def detect_vehicle_direction():
    left_distance = measure_distance(TRIG_LEFT, ECHO_LEFT)
    right_distance = measure_distance(TRIG_RIGHT, ECHO_RIGHT)
    
    if left_distance < 30 and right_distance > 30:  # Adjust threshold as needed
        return "left-to-right"
    elif right_distance < 30 and left_distance > 30:
        return "right-to-left"
    else:
        return "unknown"

def recognize_license_plate(frame, bbox):
    x, y, w, h = bbox
    plate_img = frame[y:y+h, x:x+w]
    gray = cv2.cvtColor(plate_img, cv2.COLOR_BGR2GRAY)
    gray = cv2.bilateralFilter(gray, 11, 17)
    edged = cv2.Canny(gray, 30, 200)
    license_plate_text = pytesseract.image_to_string(edged, config='--psm 8')
    return license_plate_text.strip()

def classify_vehicle(frame, bbox):
    x, y, w, h = bbox
    vehicle_img = frame[y:y+h, x:x+w]
    vehicle_type = "car"  # Replace with your classification model's output
    return vehicle_type

def estimate_speed(vehicle_id, current_center, previous_center):
    distance = np.linalg 
    cv2.norm(np.array(current_center) - np.array(previous_center))
    speed = distance / 0.1  # Assuming 10 FPS camera
    return speed

def issue_echallan(license_plate, vehicle_type, speed, direction):
    violation_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    fine_amount = 500  # Example fine amount
    
    violation = {
        'license_plate': license_plate,
        'violation_time': violation_time,
        'fine_amount': fine_amount,
        'vehicle_type': vehicle_type,
        'speed': speed,
        'direction': direction
    }

    # Insert violation into MongoDB
    violations_collection.insert_one(violation)
    print(f"E-Challan issued to {license_plate} at {violation_time} with a fine of {fine_amount}.")
    
    # Emit real-time notification
    socketio.emit('new_violation', violation)
    
    # Get owner email and send email notification
    owner_email = get_owner_email(license_plate)
    if owner_email:
        send_fine_email(owner_email, vehicle_type, speed)

def send_notification(license_plate, vehicle_type, speed, direction):
    url = f"https://api.thingspeak.com/update?api_key={thingspeak_api_key}&field1={license_plate}&field2={vehicle_type}&field3={speed}&field4={direction}"
    response = requests.get(url)
    if response.status_code == 200:
        print("Notification sent successfully")
    else:
        print("Error sending notification")

def get_owner_email(license_plate):
    owner = vehicle_owners_collection.find_one({'license_plate': license_plate})
    if owner:
        return owner.get('email')
    return None

def send_fine_email(owner_email, vehicle_type, speed):
    subject = "E-Challan Notification"
    body = f"Dear Vehicle Owner,\n\nYour {vehicle_type} was detected speeding at {speed} km/h. Please pay the fine at your earliest convenience.\n\nThank you."
    
    msg = MIMEMultipart()
    msg['From'] = email_address
    msg['To'] = owner_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(email_address, email_password)
            server.send_message(msg)
        print(f"Email sent to {owner_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")

def capture_video():
    global vehicle_id
    cap = cv2.VideoCapture(0)  # Change to your camera index or video file
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        # Perform vehicle detection
        blob = cv2.dnn.blobFromImage(frame, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
        net.setInput(blob)
        outputs = net.forward(output_layers)

        # Process detections
        for output in outputs:
            for detection in output:
                scores = detection[5:]
                class_id = np.argmax(scores)
                confidence = scores[class_id]
                if confidence > 0.5:  # Confidence threshold
                    center_x = int(detection[0] * frame.shape[1])
                    center_y = int(detection[1] * frame.shape[0])
                    w = int(detection[2] * frame.shape[1])
                    h = int(detection[3] * frame.shape[0])
                    x = int(center_x - w / 2)
                    y = int(center_y - h / 2)

                    # Update vehicle tracking
                    current_center = (center_x, center_y)
                    previous_center = vehicle_tracks.get(vehicle_id, current_center)
                    vehicle_tracks[vehicle_id] = current_center

                    # Recognize license plate and classify vehicle
                    license_plate = recognize_license_plate(frame, (x, y, w, h))
                    vehicle_type = classify_vehicle(frame, (x, y, w, h))
                    speed = estimate_speed(vehicle_id, current_center, previous_center)

                    # Issue e-challan if necessary
                    if speed > 60:  # Example speed limit
                        issue_echallan(license_plate, vehicle_type, speed, detect_vehicle_direction())

                    vehicle_id += 1  # Increment vehicle ID for tracking

        # Display the frame
        cv2.imshow('Frame', frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    GPIO.cleanup()

@app.route('/api/dashboard-data', methods=['GET'])
def get_dashboard_data():
    filters = request.args.get('filters', {})
    
    # Create the query to filter violations
    query = {}
    if filters:
        # Example: if you need to filter by vehicle type
        query = {'vehicle_type': filters.get('vehicle_type', '')}
    
    violations = violations_collection.find(query)
    
    # Convert MongoDB cursor to a list and return as JSON
    results = list(violations)
    return jsonify(results)

if __name__ == '__main__':
    try:
        # Run the Flask app in a separate thread
        Thread(target=app.run, kwargs={'debug': False}).start()
        capture_video()
    finally:
        # MongoDB cleanup is automatic as it's a server-side database, no need for manual cleanup
        GPIO.cleanup()  # Ensure GPIO cleanup