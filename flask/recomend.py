import json
import pandas as pd
from flask import Flask, jsonify,request
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Initialize Flask app
app = Flask(__name__)

# Load product data from JSON file
with open('converted_full.json', 'r') as f:
    data = json.load(f)

# Convert to DataFrame
df = pd.DataFrame(data)

# Prepare text data for TF-IDF
df['title'] = df['title'].fillna('')
df['brand'] = df['brand'].fillna('')
df['text'] = df['title'] + ' ' + df['brand']

# Vectorize the text using TF-IDF
vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = vectorizer.fit_transform(df['text'])

# Compute cosine similarity between all products
cosine_sim = cosine_similarity(tfidf_matrix)

# Map product ID to its row index
id_to_index = {str(row['id']): idx for idx, row in df.iterrows()}

# Define the recommendation API endpoint
from flask import Flask, jsonify, request  # ✅ Add request

@app.route('/recommend', methods=['POST'])  # ✅ Remove <item_id>
def recommend():
    data = request.get_json()
    item_id = str(data.get('id'))

    if item_id not in id_to_index:
        return jsonify({'error': 'Item not found'}), 404

    idx = id_to_index[item_id]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:6]

    recommendations = []
    for i, score in sim_scores:
        item = df.iloc[i]
        recommendations.append({
            'id': item['id'],
            'title': item['title'],
            'brand': item['brand'],
            'price': item['price'],
            'ratings': item['ratings'],
            'image': item['imageURL'][0] if item['imageURL'] else '',
            'similarity': round(float(score), 3)
        })

    return jsonify({'recommended': recommendations})


# Run the Flask app (PORT is here)
if __name__ == '__main__':
    app.run(debug=False, port=5000)
