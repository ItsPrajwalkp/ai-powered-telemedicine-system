from transformers import DistilBertTokenizer
from transformers import DistilBertForSequenceClassification

print("Loading tokenizer...")

tokenizer = DistilBertTokenizer.from_pretrained(
    "distilbert-base-uncased"
)

print("Loading model...")

model = DistilBertForSequenceClassification.from_pretrained(
    "distilbert-base-uncased"
)

print("DistilBERT Loaded Successfully!")