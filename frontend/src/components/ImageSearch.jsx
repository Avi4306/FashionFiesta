import React, { useState, useRef } from 'react';

function ImageSearchForm() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [fileName, setFileName] = useState('');
    const [searchResults, setSearchResults] = useState(null); // To store JSON results
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Ref for the hidden file input to trigger it programmatically
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name);
            setPreviewUrl(URL.createObjectURL(file)); // Create a URL for image preview
            setSearchResults(null); // Clear previous results
            setError(''); // Clear previous errors
        } else {
            setSelectedFile(null);
            setFileName('');
            setPreviewUrl('');
        }
    };

    const handleUploadAndSearch = async () => {
        if (!selectedFile) {
            setError('Please select an image file first.');
            return;
        }

        setLoading(true);
        setError('');
        setSearchResults(null);

        const formData = new FormData();
        formData.append('image', selectedFile); // 'image' must match the field name in your Node.js backend (upload.single('image'))

        try {

            const response = await fetch(`${import.meta.env.FLASK_URL}/search`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                // If the response is not ok (e.g., 400, 500 status)
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setSearchResults(data);
            // Optionally, clear file input after successful upload
            setSelectedFile(null);
            setFileName('');
            setPreviewUrl('');
            fileInputRef.current.value = ''; // Clear the actual input element
        } catch (err) {
            console.error("Upload failed:", err);
            setError(`Upload failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>Image Search with AI</h1>

            <div
                className="file-upload-area"
                onClick={() => fileInputRef.current.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    handleFileChange({ target: { files: e.dataTransfer.files } });
                }}
            >
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    style={{ display: 'none' }} // Hide the actual input
                />
                {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="image-preview" />
                ) : (
                    <p>Drag & Drop an image here, or click to select</p>
                )}
                {fileName && <p className="file-name">{fileName}</p>}
            </div>

            <button
                onClick={handleUploadAndSearch}
                disabled={!selectedFile || loading}
                className="search-button"
            >
                {loading ? 'Searching...' : 'Search Image'}
            </button>

            {error && <p className="error-message">{error}</p>}

            {searchResults?.matches?.length > 0 && (
  <div className="results-container">
    <h2>Search Results:</h2>
    <div className="results-grid">
      {searchResults.matches.map((match, index) => (
        <div key={index} className="result-card">
          <img src={match.url} alt={match.filename} className="result-image" />
          <p><strong>{match.filename}</strong></p>
          <p>Score: {(match.score * 100).toFixed(1)}%</p>
        </div>
      ))}
    </div>
  </div>
)}

        </div>
    );
}

export default ImageSearchForm;