import os
import pandas as pd
import joblib

def load_model(model_path):
    return joblib.load(model_path)

def preprocess_input(text, vectorizer):
    return vectorizer.transform([text])

def predict_sentiment(model, vectorizer, text):
    processed_text = preprocess_input(text, vectorizer)
    prediction = model.predict(processed_text)
    return prediction[0]

def load_data(file_path):
    data = pd.read_csv(file_path)
    X = data['Text']
    y = data['Sentiment']
    return X, y

if __name__ == "__main__":
    model_path = os.path.join("model", "model.pkl")
    vectorizer_path = os.path.join("model", "vectorizer.pkl")
    data_path = os.path.join("data", "filtered_dataset_expanded.csv")

    model = load_model(model_path)
    vectorizer = load_model(vectorizer_path)

    sample_text = "Your input text for sentiment analysis."
    sentiment = predict_sentiment(model, vectorizer, sample_text)
    print(f"The predicted sentiment is: {sentiment}")
