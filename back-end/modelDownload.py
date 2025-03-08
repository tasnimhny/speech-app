#pip install huggingface_hub
from huggingface_hub import snapshot_download

# Download and save the model locally
model_path = snapshot_download(repo_id="guillaumekln/faster-whisper-small", cache_dir="./whisper_models")

print(f"Model downloaded to: {model_path}")