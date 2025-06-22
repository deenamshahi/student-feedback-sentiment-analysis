import os
import pandas as pd
import string
import joblib
import nltk

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.utils import resample
from sklearn.metrics import classification_report, accuracy_score

# Download stopwords once
try:
    from nltk.corpus import stopwords
    stop_words = stopwords.words('english')
except LookupError:
    nltk.download('stopwords')
    from nltk.corpus import stopwords
    stop_words = stopwords.words('english')


def clean_text(text):
    text = str(text).lower()
    text = text.translate(str.maketrans('', '', string.punctuation))
    return text


def load_and_preprocess_data(file_path):
    data = pd.read_csv(file_path)
    data.columns = data.columns.str.strip()
    data = data.dropna(subset=['Text', 'Sentiment'])
    data['Text'] = data['Text'].apply(clean_text)
    return data


def balance_data(X, y):
    df = pd.concat([X, y], axis=1)
    class_counts = df['Sentiment'].value_counts()
    majority_class = class_counts.idxmax()
    minority_class = class_counts.idxmin()

    majority_df = df[df['Sentiment'] == majority_class]
    minority_df = df[df['Sentiment'] == minority_class]

    majority_downsampled = resample(
        majority_df,
        replace=False,
        n_samples=len(minority_df),
        random_state=42
    )

    df_balanced = pd.concat([minority_df, majority_downsampled])
    return df_balanced['Text'], df_balanced['Sentiment']


def main():
    # Use relative path for portability
    data_path = os.path.join('data', 'filtered_dataset_expanded.csv')
    model_dir = os.path.join('model')
    os.makedirs(model_dir, exist_ok=True)

    data = load_and_preprocess_data(data_path)
    X, y = balance_data(data['Text'], data['Sentiment'])

    print("Class distribution after balancing:\n", y.value_counts())

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    vectorizer = TfidfVectorizer(
        stop_words=stop_words,
        ngram_range=(1, 2),
        min_df=2,
        max_df=0.95
    )
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    model = RandomForestClassifier(
        class_weight='balanced',
        n_estimators=200,
        random_state=42
    )
    model.fit(X_train_vec, y_train)

    joblib.dump(model, os.path.join(model_dir, 'model.pkl'))
    joblib.dump(vectorizer, os.path.join(model_dir, 'vectorizer.pkl'))

    y_pred = model.predict(X_test_vec)
    print("Training complete.")
    print("Test accuracy:", accuracy_score(y_test, y_pred))
    print(classification_report(y_test, y_pred))


if __name__ == '__main__':
    main()
