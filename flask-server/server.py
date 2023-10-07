from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS from Flask-CORS extension
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, classification_report

app = Flask(__name__)
cors = CORS(app, resources={r"/message": {"origins": "http://localhost:3000"}})
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

userData="placeholder"

@app.route('/api/send-data', methods=['POST'])
def send_data():
    global userData  # Declare userData as a global variable
    if request.method == 'POST':
        data = request.json.get('data')  # Access the 'data' field from the JSON request
        userData= data
        return jsonify({'message': userData})

@app.route('/message', methods=['GET'])
def get_message():
    global userData  # Declare userData as a global variable

    # Load your dataset from CSV
    dataset = pd.read_csv('dataset.csv')

    dataset = dataset.drop(columns=['imageUrl'])  # Not relevant

    # Separate the features (X) from the target variable (y)
    X = dataset.drop(columns=['occasion'])  # Exclude 'occasion' as the target variable
    y = dataset['occasion']  # 'occasion' is your target variable

    # One-hot encode categorical features in X
    X = pd.get_dummies(X, columns=['clothing_type', 'weather'])

    # Split the data into training and testing sets (e.g., 80% training, 20% testing)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Now you have X_train, X_test, y_train, y_test for model training and evaluation

    # Create a DecisionTreeClassifier
    classifier = DecisionTreeClassifier(random_state=42)  # You can adjust hyperparameters here

    # Train the classifier on the training data
    classifier.fit(X_train, y_train)

    # Predict labels for the testing set
    y_pred = classifier.predict(X_test)

    # Calculate accuracy
    accuracy = accuracy_score(y_test, y_pred)

    # Generate a classification report with more metrics
    report = classification_report(y_test, y_pred)

    # Now, let's test the classifier with a new single instance (you need to prepare this)
    # Create a template DataFrame with all possible columns and set all values to 0
    new_instance = pd.DataFrame(columns=X.columns)
    new_instance.loc[0] = 0  # Initialize all values to 0

    # Replace the values for the specific features (clothing_type and weather)
    new_instance[f'clothing_type_{userData}'] = 1  # Replace 'your_value' with the actual clothing type
    # Initialize a variable to store the weather
   
    matched_weather = None

    # Iterate through the DataFrame rows
    for index, row in dataset.iterrows():
        if row['clothing_type'] == userData:
            matched_weather = row['weather']
            break  # Exit the loop once a match is found

    new_instance[f'weather_{matched_weather}'] = 1

    # Predict the occasion for the new instance
    predicted_occasion = classifier.predict(new_instance)
    
    return jsonify({
        'predicted_occasion': predicted_occasion[0],
        'accuracy': accuracy,
        'classification_report': report,
        'weather': matched_weather
    })

    # Return the predicted occasion, accuracy, and classification report

if __name__ == '__main__':
    app.run(debug=True)
