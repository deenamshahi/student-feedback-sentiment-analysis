import os
import pandas as pd
from src.data_preprocessing import preprocess_data, clean_text, load_data


def test_clean_text():
    """Test text cleaning function"""
    text = "This is AMAZING!!! @user #hashtag http://example.com"
    cleaned = clean_text(text)

    assert isinstance(cleaned, str)
    assert len(cleaned) > 0
    assert "@user" not in cleaned
    assert "http://" not in cleaned
    assert cleaned.islower()


def test_load_data():
    """Test data loading"""
    # Resolve path to dataset relative to the root of the repository
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    path = os.path.join(base_dir, "data", "filtered_dataset_expanded.csv")

    df = load_data(path)

    assert isinstance(df, pd.DataFrame)
    assert "Text" in df.columns
    assert "Sentiment" in df.columns
    assert len(df) > 0


def test_preprocess_data():
    """Test data preprocessing"""
    # Create sample data
    df = pd.DataFrame({
        "Text": ["Good product!", "Bad service", "Okay experience"],
        "Sentiment": ["positive", "negative", "neutral"],
    })

    processed = preprocess_data(df)

    assert "cleaned_text" in processed.columns
    assert len(processed) == len(df)
