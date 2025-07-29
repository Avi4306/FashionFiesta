from flask import Flask, request, jsonify, render_template, url_for
from werkzeug.utils import secure_filename
import os
import json
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from utils import extract_features, calculate_similarities, build_feature_dataset
from flask_cors import CORS

# === Setup Base Directory ===
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# === Config ===
app = Flask(__name__)
CORS(app)

print("✅ Running correct app.py in flask/scan_and_search")

# Paths
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static', 'uploads')
DATASET_FOLDER = os.path.join(BASE_DIR, 'static', 'dataset_images')
FEATURES_PATH = os.path.join(BASE_DIR, 'image_features.json')
JSON_PATH = os.path.join(BASE_DIR, 'converted_full.json')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# === Feature Rebuild Check ===
def needs_rebuild():
    if not os.path.exists(FEATURES_PATH):
        return True
    try:
        with open(FEATURES_PATH) as f:
            saved = json.load(f)
        current_images = [
            f for f in os.listdir(DATASET_FOLDER)
            if f.lower().endswith(tuple(ALLOWED_EXTENSIONS))
        ]
        return len(saved) != len(current_images)
    except Exception as e:
        print(f"⚠️ Error reading feature file: {e}")
        return True

# === Build or Load Features ===
if needs_rebuild():
    print("🔄 Rebuilding feature dataset...")
    build_feature_dataset(DATASET_FOLDER, FEATURES_PATH)
else:
    print("✅ Feature dataset up to date.")

try:
    with open(FEATURES_PATH, 'r') as f:
        features_db = json.load(f)
except Exception as e:
    print(f"❌ Failed to load image features: {e}")
    features_db = {}

# === Load Text Data ===
try:
    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
    df = pd.DataFrame(data)
except Exception as e:
    print(f"❌ Failed to load text dataset: {e}")
    df = pd.DataFrame(columns=['_id', 'title', 'brand', 'price', 'ratings', 'imageURL'])

# Extract _id from MongoDB format
def get_clean_id(val):
    if isinstance(val, dict) and '$oid' in val:
        return val['$oid']
    return str(val)

df['_id'] = df['_id'].apply(get_clean_id)
df['title'] = df['title'].fillna('')
df['brand'] = df['brand'].fillna('')
df['category'] = df['category'].fillna('') if 'category' in df.columns else ''
df['text'] = df['title'] + ' ' + df['brand'] + ' ' + df['category']

# TF-IDF Vectorization
try:
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(df['text'])
    cosine_sim = cosine_similarity(tfidf_matrix)
    id_to_index = {str(row['_id']): idx for idx, row in df.iterrows()}
except Exception as e:
    print(f"❌ TF-IDF failed: {e}")
    tfidf_matrix = None
    cosine_sim = []
    id_to_index = {}

# === Utilities ===
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# === Routes ===
@app.route('/')
def index():
    return render_template('index.html')

@app.before_request
def before_any():
    print("🚨 Received request to:", request.path)

@app.route('/search', methods=['POST'])
def search():
    print("📩 /search route triggered")
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']
    original_filename = file.filename

    if file and allowed_file(original_filename):
        filename = secure_filename(original_filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        try:
            query_features = extract_features(filepath)
            results = calculate_similarities(query_features, features_db)[:5]

            matches = []
            for fname, score in results:
                matches.append({
                    'filename': fname,
                    'score': round(score, 3),
                    'url': url_for('static', filename=f'dataset_images/{fname}')
                })

            return jsonify({'matches': matches})
        except Exception as e:
            print(f"❌ Error in similarity search: {e}")
            return jsonify({'error': 'Image processing failed'}), 500

    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/recommend', methods=['POST'])
def recommend():
    print("📩 /recommend route triggered")
    data = request.get_json()
    item_id = str(data.get('_id'))

    if item_id not in id_to_index:
        return jsonify({'error': 'Item not found'}), 404

    idx = id_to_index[item_id]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:6]

    recommendations = []
    for i, score in sim_scores:
        item = df.iloc[i]
        recommendations.append({
            '_id': item.get('_id'),
            'title': item.get('title'),
            'brand': item.get('brand'),
            'price': item.get('price'),
            'ratings': item.get('ratings'),
            'image': item.get('imageURL')[0] if isinstance(item.get('imageURL'), list) else '',
            'similarity': round(float(score), 3)
        })

    return jsonify({'recommended': recommendations})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
