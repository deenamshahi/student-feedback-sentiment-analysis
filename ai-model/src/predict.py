import pandas as pd
import joblib

def load_model(model_path):
    model = joblib.load(model_path)
    return model

def preprocess_input(text, vectorizer):
    text_transformed = vectorizer.transform([text])
    return text_transformed

def predict_sentiment(model, vectorizer, text):
    processed_text = preprocess_input(text, vectorizer)
    prediction = model.predict(processed_text)
    return prediction[0]

def load_data(file_path):
    data = pd.read_csv(r"F:\springboot\Esewa\student-feedback-sentiment-analysis\ai-model\data\filtered_dataset_expanded.csv")
    X = data['Text']      # Use your actual text column name
    y = data['Sentiment']     # Use your actual label column name
    return X, y

if __name__ == "__main__":
    model_path = r"F:\springboot\Esewa\student-feedback-sentiment-analysis\ai-model\model\model.pkl"
    vectorizer_path = r"F:\springboot\Esewa\student-feedback-sentiment-analysis\ai-model\model\vectorizer.pkl"

    model = load_model(model_path)
    vectorizer = load_model(vectorizer_path)

    X, y = load_data(r"F:\springboot\Esewa\student-feedback-sentiment-analysis\ai-model\data\filtered_dataset_expanded.csv")

    sample_text = "Your input text for sentiment analysis."
    sentiment = predict_sentiment(model, vectorizer, sample_text)
    print(f"The predicted sentiment is: {sentiment}")
