import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import { createOutfit } from '../../actions/outfit';
import { Snackbar, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { UploadCloud } from 'lucide-react';

export default function SubmitOutfit({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.authData);

  // Convert file to base64
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // Handle image drop
  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    const base64 = await fileToBase64(file);
    setFormData((prev) => ({ ...prev, image: base64 }));
    setPreview(base64);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg('Please login to submit an outfit');
      setOpenSnackbar(true);
      return;
    }
    if (!formData.image) {
      setErrorMsg('Please select an image');
      setOpenSnackbar(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(createOutfit(formData));
      setFormData({ title: '', description: '', image: null });
      setPreview(null);
      onClose(); // Close modal on success
    } catch (error) {
      console.error("Failed to submit outfit:", error);
      setErrorMsg("Failed to submit outfit. Please try again.");
      setOpenSnackbar(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900 bg-opacity-70">
      <div className="relative w-full max-w-lg mx-auto bg-[#faf7f3] rounded-3xl shadow-xl p-8 sm:p-10">
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 16, top: 16, color: '#44403c' }}
        >
          <CloseIcon />
        </IconButton>

        <h3 className="text-2xl font-semibold text-center text-[#44403c] mb-6">Submit Your Outfit</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 border border-[#dcc5b2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#dcc5b2] transition-colors"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <textarea
            placeholder="Description"
            className="w-full p-2 border border-[#dcc5b2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#dcc5b2] transition-colors"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows="4"
          />

          <div
            {...getRootProps()}
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 p-4 rounded-xl cursor-pointer text-center bg-white"
          >
            <input {...getInputProps()} />
            <p className="text-sm text-gray-600 font-medium">
              {isDragActive ? "Drop the image here ..." : "Drag & drop an image, or click to select"}
            </p>
          </div>

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-60 object-cover rounded-lg mt-3 shadow"
            />
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center gap-2 bg-[#aa5a44] text-white px-4 py-2 rounded-xl hover:bg-[#8a4536] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></span>
            ) : (
              <>
                <UploadCloud size={20} /> Submit Outfit
              </>
            )}
          </button>
        </form>
      </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        message={errorMsg}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </div>
  );
}