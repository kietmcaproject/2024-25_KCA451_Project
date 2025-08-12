import pandas as pd
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score
import pickle
import os

# Create model directory if it doesn't exist
os.makedirs('model', exist_ok=True)

def train_and_save_model():
    # Load the dataset
    data = load_breast_cancer()
    X = pd.DataFrame(data.data, columns=data.feature_names)
    y = pd.Series(data.target)
    
    # Define feature order explicitly (must match form inputs)
    FEATURE_ORDER = [
        'mean radius',        # feature_1
        'mean texture',       # feature_2
        'mean perimeter',     # feature_3
        'mean area',          # feature_4
        'mean smoothness',    # feature_5
        'mean compactness',   # feature_6
        'mean concavity',     # feature_7
        'mean concave points',# feature_8
        'mean symmetry',      # feature_9
        'mean fractal dimension' # feature_10
    ]
    
    # Filter and order features
    X_selected = X[FEATURE_ORDER]
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X_selected, y, test_size=0.2, random_state=42
    )
    
    # Train model with optimized parameters
    model = SVC(
        kernel='linear',
        probability=True,  # Required for confidence scores
        random_state=42,
        C=0.1  # Regularization parameter
    )
    model.fit(X_train, y_train)
    
    # Evaluate model
    train_acc = accuracy_score(y_train, model.predict(X_train))
    test_acc = accuracy_score(y_test, model.predict(X_test))
    
    # Save the model and metadata
    model_data = {
        'model': model,
        'feature_order': FEATURE_ORDER,
        'accuracy': {
            'train': train_acc,
            'test': test_acc
        }
    }
    
    with open('model/breast_cancer_model.pkl', 'wb') as f:
        pickle.dump(model_data, f)
    
    print("✅ Model trained and saved successfully")
    print(f"  - Training accuracy: {train_acc:.2%}")
    print(f"  - Test accuracy: {test_acc:.2%}")
    print("  - Feature order:", FEATURE_ORDER)

if __name__ == '__main__':
    train_and_save_model()