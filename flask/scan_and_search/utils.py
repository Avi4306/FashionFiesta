import os
import json
import numpy as np
from tensorflow.keras.applications.vgg16 import VGG16, preprocess_input
from tensorflow.keras.preprocessing import image
from sklearn.metrics.pairwise import cosine_similarity

# Load VGG16 model once
model = VGG16(weights="imagenet", include_top=False, pooling='avg')

def extract_features(img_path):
    """Extract VGG16 features from a single image file."""
    img = image.load_img(img_path, target_size=(224, 224))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)
    features = model.predict(x)
    return features.flatten()

def calculate_similarities(query_features, features_db):
    """Compare the query features with the precomputed feature database."""
    similarities = []
    for filename, dataset_features in features_db.items():
        sim = cosine_similarity([query_features], [dataset_features])[0][0]
        similarities.append((filename, sim))
    similarities.sort(key=lambda x: x[1], reverse=True)
    return similarities

def build_feature_dataset(dataset_folder='static/dataset_images', output_path='image_features.json'):
    """Build and save feature vectors for all dataset images."""
    features_db = {}
    for filename in os.listdir(dataset_folder):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            img_path = os.path.join(dataset_folder, filename)
            features = extract_features(img_path)
            features_db[filename] = features.tolist()

    with open(output_path, 'w') as f:
        json.dump(features_db, f)
    print(f"✅ Built and saved features for {len(features_db)} images.")
