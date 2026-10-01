import pandas as pd
import torch
import numpy as np
from sklearn.metrics import confusion_matrix, classification_report
import seaborn as sns
import matplotlib.pyplot as plt

from transformers import (
    DistilBertTokenizer,
    DistilBertForSequenceClassification,
    Trainer,
    TrainingArguments
)

from torch.utils.data import Dataset
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Load dataset
df = pd.read_csv("dataset/symptom_dataset.csv")

# Convert disease names to numbers
df["label"] = df["disease"].astype("category").cat.codes

# Save label mapping
label_map = dict(
    enumerate(df["disease"].astype("category").cat.categories)
)

print("Label Mapping:")
print(label_map)

# Tokenizer
tokenizer = DistilBertTokenizer.from_pretrained(
    "distilbert-base-uncased"
)

texts = df["symptoms_text"].tolist()
labels = df["label"].tolist()

# Split data
train_texts, val_texts, train_labels, val_labels = train_test_split(
    texts,
    labels,
    test_size=0.2,
    random_state=42
)

# Tokenize
train_encodings = tokenizer(
    train_texts,
    truncation=True,
    padding=True
)

val_encodings = tokenizer(
    val_texts,
    truncation=True,
    padding=True
)

# Dataset class
class SymptomDataset(Dataset):

    def __init__(self, encodings, labels):
        self.encodings = encodings
        self.labels = labels

    def __getitem__(self, idx):
        item = {
            key: torch.tensor(val[idx])
            for key, val in self.encodings.items()
        }
        item["labels"] = torch.tensor(self.labels[idx])
        return item

    def __len__(self):
        return len(self.labels)

# Create datasets
train_dataset = SymptomDataset(train_encodings, train_labels)
val_dataset = SymptomDataset(val_encodings, val_labels)

# Load model
model = DistilBertForSequenceClassification.from_pretrained(
    "distilbert-base-uncased",
    num_labels=len(label_map)
)

# Training settings (NO evaluation_strategy here)
training_args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=30,
    per_device_train_batch_size=4,
    logging_dir="./logs",
    save_strategy="no"
)

# Trainer (NO eval_dataset, NO compute_metrics)
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset
)

print("\nTraining Started...")

trainer.train()

print("\nTraining Completed!")

# ✅ MANUAL ACCURACY CALCULATION
print("\nEvaluating model...")

predictions = trainer.predict(val_dataset)

y_pred = np.argmax(predictions.predictions, axis=1)

accuracy = accuracy_score(val_labels, y_pred)

print("\nValidation Accuracy:", accuracy)
# Confusion Matrix
cm = confusion_matrix(val_labels, y_pred)

print("\nConfusion Matrix:\n", cm)

# Plot it
plt.figure(figsize=(10, 8))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues")
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix")
plt.show()

# Classification Report
print("\nClassification Report:\n")
print(classification_report(val_labels, y_pred))
# Save model
model.save_pretrained("model/symptom_model")
tokenizer.save_pretrained("model/symptom_model")

print("\nModel Saved Successfully!")