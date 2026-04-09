from flask import Flask, request, jsonify
from flask_cors import CORS

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
    if not file or file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Dynamic response generation based on file name to simulate real AI differences
    filename = file.filename.lower()
    
    # Simple deterministic hash for file to always return same result for same file
    file_hash = sum(ord(c) for c in filename)
    
    diseases = [
        {
            "disease": "Tomato Early Blight",
            "confidence": 0.94 + (file_hash % 5) / 100,
            "treatment": ["Prune infected areas. Use sterilized shears.", "Apply Fungicide (Copper-based).", "Improve Airflow by removing dense foliage."],
            "regulatory_warning": "[EPA 40 CFR 131] Copper-based fungicides must be logged within 48 hours. Max application 2.5 lbs/acre/season near groundwater."
        },
        {
            "disease": "Corn Northern Leaf Blight",
            "confidence": 0.88 + (file_hash % 10) / 100,
            "treatment": ["Rotate crops.", "Apply foliar fungicide.", "Remove crop debris from the base of the plant."],
            "regulatory_warning": "[USDA Title 7] Foliar fungicide application requires buffer zones of 50ft from adjacent organic acreage."
        },
        {
            "disease": "Healthy Plant (No Pathogens Detected)",
            "confidence": 0.98 + (file_hash % 2) / 100,
            "treatment": ["No action required. Plant shows excellent vitality.", "Maintain current irrigation and nutrient plan."],
            "regulatory_warning": "Compliant with USDA Good Agricultural Practices (GAP)."
        },
        {
            "disease": "Grape Powdery Mildew",
            "confidence": 0.91 + (file_hash % 7) / 100,
            "treatment": ["Apply Sulfur dust immediately.", "Increase canopy airflow by pruning.", "Avoid overhead irrigation."],
            "regulatory_warning": "[OSHA 1910.134] Workers applying sulfur dust require approved N95 respirators and eye protection."
        }
    ]
    
    result = diseases[file_hash % len(diseases)]

    return jsonify(result)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)