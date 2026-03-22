from flask import Flask, request, jsonify
from flask_cors import CORS
# import tensorflow as tf
# import numpy as np
# from PIL import Image
# import io

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "service": "AI Flask Service"})

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No image part"}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # In a real scenario, process image and pass to tf model:
    # img = Image.open(file.stream)
    # img = img.resize((224, 224))
    # ... preprocessing ...
    # preds = model.predict(img_array)
    
    # Mock Response
    return jsonify({
        "disease": "Tomato Early Blight",
        "confidence": 0.945,
        "treatment": [
            "Prune infected areas: Use sterilized shears to remove leaves with brown, concentric ring spots.",
            "Apply Fungicide: Spray a copper-based fungicide or chlorothalonil evenly across the plant.",
            "Improve Airflow: Remove dense foliage to ensure leaves dry quickly after rain or dew."
        ]
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
