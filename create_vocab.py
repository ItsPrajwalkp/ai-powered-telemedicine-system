from transformers import DistilBertTokenizerFast

# Load tokenizer from saved model
tokenizer = DistilBertTokenizerFast.from_pretrained(
    "model/symptom_model"
)

# Save missing vocab.txt
tokenizer.save_pretrained(
    "model/symptom_model"
)

print("✅ vocab.txt created successfully!") 