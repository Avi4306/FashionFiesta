import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import { createProduct } from "../../actions/products";
import { FaUpload, FaTimes, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

// --- Reusable & Styled Helper Components ---

const FormInput = ({ label, name, value, onChange, type = "text", required = false, placeholder = "", adornment, helpText }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-[#5a4e46] mb-1">
      {label} {required && <span className="text-[#cb6d6a]">*</span>}
    </label>
    <div className="relative">
      {adornment && <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><span className="text-[#857262] sm:text-sm">{adornment}</span></div>}
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={`block w-full h-10 rounded-md p-2 border-[#dcc5b2] bg-[#fbfbfa] shadow-sm focus:border-[#ccb5a2] focus:ring-1 focus:ring-[#ccb5a2] sm:text-sm text-[#5a4e46] placeholder:text-[#ac9887] ${adornment ? 'pl-7' : ''}`}
      />
    </div>
    {helpText && <p className="mt-1 text-xs text-[#857262]">{helpText}</p>}
  </div>
);

const TagInput = ({ label, name, value, onChange, required, helpText }) => {
    const tags = value.split(',').map(t => t.trim()).filter(Boolean);

    const removeTag = (tagToRemove) => {
        const newTags = tags.filter(tag => tag !== tagToRemove).join(', ');
        onChange({ target: { name, value: newTags } });
    };
    
    return (
        <div>
            <FormInput 
                label={label}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                helpText={helpText}
            />
            {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-x-1.5 rounded-full bg-[#dfd0b8] px-2 py-1 text-xs font-medium text-[#5a4e46]">
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-[#ccb5a2]/20">
                                <span className="sr-only">Remove</span>
                                <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 stroke-[#857262] group-hover:stroke-[#5a4e46]"><path d="M4 4l6 6m0-6l-6 6" /></svg>
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

const ImageUploader = ({ images, setImages, base64Images, setBase64Images }) => {
    const onDrop = useCallback(async (acceptedFiles) => {
        setImages(prev => [...prev, ...acceptedFiles]);
        const base64Array = await Promise.all(acceptedFiles.map(file => fileToBase64(file)));
        setBase64Images(prev => [...prev, ...base64Array]);
    }, [setImages, setBase64Images]);
    
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { "image/*": [] } });

    const fileToBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

    const removeImage = (indexToRemove) => {
        setImages(prev => prev.filter((_, index) => index !== indexToRemove));
        setBase64Images(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div>
            <label className="block text-sm font-medium text-[#5a4e46] mb-1">Product Images <span className="text-[#cb6d6a]">*</span></label>
            <div {...getRootProps()} className={`flex justify-center rounded-lg border-2 border-dashed px-6 pt-5 pb-6 transition-colors ${isDragActive ? 'border-[#ccb5a2] bg-[#dfd0b8]/50' : 'border-[#dcc5b2] hover:border-[#ccb5a2]'}`}>
                <div className="space-y-1 text-center">
                    <FaUpload className="mx-auto h-10 w-10 text-[#ac9887]" />
                    <div className="flex text-sm text-[#857262]"><label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-transparent font-medium text-[#b8a18f] hover:text-[#5a4e46]"><span>Upload files</span><input {...getInputProps()} id="file-upload" className="sr-only" /></label><p className="pl-1">or drag and drop</p></div>
                    <p className="text-xs text-[#857262]">PNG, JPG, GIF up to 10MB</p>
                </div>
            </div>
            {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                    {images.map((file, idx) => (
                        <div key={idx} className="relative aspect-square">
                            <img src={URL.createObjectURL(file)} alt="Preview" className="h-full w-full rounded-md object-cover shadow-sm" />
                            <button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#cb6d6a] shadow-md transition hover:scale-110"><FaTimes /></button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


// --- Main CreateProduct Component ---

export default function CreateProduct({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.productsData);
  
  const [form, setForm] = useState({ title: "", description: "", price: "", discount: "", category: "", brand: "", stock: "", sizes: "", colors: "", tags: "" });
  const [images, setImages] = useState([]);
  const [base64Images, setBase64Images] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'error' });

  // ... (Core logic remains the same)
  const handleChange = (e) => { setForm((prev) => ({ ...prev, [e.target.name]: e.target.value })); };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.tags || base64Images.length === 0) {
      setNotification({ show: true, message: "Title, price, tags and at least one image are required.", type: 'error' });
      return;
    }
    const productData = { ...form, price: Number(form.price), discount: Number(form.discount), stock: Number(form.stock), sizes: form.sizes.split(",").map(s => s.trim()).filter(Boolean), colors: form.colors.split(",").map(c => c.trim()).filter(Boolean), tags: form.tags.split(",").map(t => t.trim()).filter(Boolean), images: base64Images };
    dispatch(createProduct(productData));
    onClose()
  };
  
  useEffect(() => {
    if (success) {
      setForm({ title: "", description: "", price: "", discount: "", category: "", brand: "", stock: "", sizes: "", colors: "", tags: "" });
      setImages([]);
      setBase64Images([]);
      onClose();
    }
    if (error) { setNotification({ show: true, message: error, type: 'error' }); }
  }, [success, error, dispatch, onClose]);

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3d3327]/60 p-4 backdrop-blur-sm" aria-modal="true">
      <div className="relative w-full max-w-4xl rounded-xl bg-[#faf7f3] shadow-2xl">
        <div className="flex items-center justify-between rounded-t-xl border-b border-[#dcc5b2] bg-[#faf7f3] p-4">
          <h3 className="text-xl font-semibold text-[#5a4e46] ">Create New Product</h3>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-[#857262] transition hover:bg-[#dfd0b8] hover:text-[#5a4e46]"><FaTimes size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto">
          <div className="space-y-6 p-6">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
              <FormInput label="Title" name="title" value={form.title} onChange={handleChange} required />
              <FormInput label="Brand" name="brand" value={form.brand} onChange={handleChange} />
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-[#5a4e46] mb-1">Description</label>
                <textarea id="description" name="description" value={form.description} onChange={handleChange} rows="4" className="block w-full rounded-md border-[#dcc5b2] bg-[#fbfbfa] shadow-sm focus:border-[#ccb5a2] focus:ring-1 focus:ring-[#ccb5a2] sm:text-sm p-2 text-[#5a4e46] placeholder:text-[#ac9887]" />
              </div>
              <FormInput label="Price" name="price" value={form.price} onChange={handleChange} type="number" required adornment="₹" />
              <FormInput label="Discount (%)" name="discount" value={form.discount} onChange={handleChange} type="number" placeholder="e.g., 15" />
              <FormInput label="Category" name="category" value={form.category} onChange={handleChange} />
              <FormInput label="Stock" name="stock" value={form.stock} onChange={handleChange} type="number" />
              
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
                  <TagInput label="Sizes" name="sizes" value={form.sizes} onChange={handleChange} helpText="Comma-separated."/>
                  <TagInput label="Colors" name="colors" value={form.colors} onChange={handleChange} helpText="Comma-separated."/>
                  <TagInput label="Tags" name="tags" value={form.tags} onChange={handleChange} required helpText="Comma-separated."/>
              </div>

              <div className="md:col-span-2">
                <ImageUploader images={images} setImages={setImages} base64Images={base64Images} setBase64Images={setBase64Images} />
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-end space-x-4 rounded-b-xl border-t border-[#dcc5b2] bg-[#faf7f3] px-6 py-4">
            <button type="button" onClick={onClose} className="rounded-lg border border-[#dcc5b2] bg-transparent px-5 py-2.5 text-sm font-medium text-[#5a4e46] shadow-sm transition hover:bg-[#dfd0b8]">Cancel</button>
            <button type="submit" disabled={loading} className="rounded-lg bg-[#ccb5a2] px-5 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#b8a18f] disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>

       {/* Custom Notification */}
       <div className={`fixed bottom-5 left-1/2 z-50 -translate-x-1/2 transform transition-all duration-300 ${notification.show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <div className={`flex items-center gap-3 rounded-lg px-4 py-3 text-white shadow-lg ${notification.type === 'error' ? 'bg-[#cb6d6a]' : 'bg-[#588157]'}`}>
              {notification.type === 'error' ? <FaExclamationCircle/> : <FaCheckCircle/>}
              <span className="text-sm font-medium">{notification.message}</span>
          </div>
       </div>
    </div>
  );
}