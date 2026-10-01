import pandas as pd

# Load dataset
df = pd.read_csv(
    "dataset/symptom_dataset.csv"
)

# Show first rows
print(df.head())

print("\nDataset Loaded Successfully!")
print("Total Records:", len(df))