import pandas as pd
import string
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.utils import resample
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os
import nltk

# Download stopwords if not already present
nltk.download('stopwords')
from nltk.corpus import stopwords
stop_words = stopwords.words('english')

# Data cleaning function
def clean_text(text):
    text = str(text).lower()
    text = text.translate(str.maketrans('', '', string.punctuation))
    return text

# Load data
data = pd.read_csv(r"D:\Esewa project\sentiment-analysis-project\data\filtered_dataset_expanded.csv")
data.columns = data.columns.str.strip()
data = data.dropna(subset=['Text', 'Sentiment'])
data['Text'] = data['Text'].apply(clean_text)

X = data['Text']
y = data['Sentiment']

# Balance the dataset (downsample majority class)
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

X = df_balanced['Text']
y = df_balanced['Sentiment']

print("Class distribution after balancing:\n", y.value_counts())

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Improved vectorizer with stopwords and bigrams
vectorizer = TfidfVectorizer(
    stop_words=stop_words,
    ngram_range=(1,2),
    min_df=2,
    max_df=0.95
)
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# Use Random Forest Classifier with class_weight balanced
model = RandomForestClassifier(class_weight='balanced', n_estimators=200, random_state=42)
model.fit(X_train_vec, y_train)

# Save model and vectorizer
os.makedirs(r'd:/Esewa project/sentiment-analysis-project/model', exist_ok=True)
joblib.dump(model, r'd:/Esewa project/sentiment-analysis-project/model/model.pkl')
joblib.dump(vectorizer, r'd:/Esewa project/sentiment-analysis-project/model/vectorizer.pkl')

# Evaluate
y_pred = model.predict(X_test_vec)
print("Training complete.")
print("Test accuracy:", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))
