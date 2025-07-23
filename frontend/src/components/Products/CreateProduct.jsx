import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import { createProduct } from "../../actions/products";
// import { resetProductCreate } from "../../reducers/productReducer";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Typography,
  Snackbar
} from "@mui/material";

const CreateProduct = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.productsData);
  const [errorMsg, setErrorMsg] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    discount: "",
    category: "",
    brand: "",
    stock: "",
    sizes: "",
    colors: "",
    tags: "",
  });

  const [images, setImages] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    setImages((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.tags || images.length<0) {
      setErrorMsg("Title, price, tags and images are required.");
      setOpenSnackbar(true);
      return;
    }

    const productData = {
      ...form,
      price: Number(form.price),
      discount: Number(form.discount),
      stock: Number(form.stock),
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(",").map((c) => c.trim()).filter(Boolean),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      images,
    };

    dispatch(createProduct(productData));
  };

  useEffect(() => {
    if (success) {
      setForm({
        title: "",
        description: "",
        price: "",
        discount: "",
        category: "",
        brand: "",
        stock: "",
        sizes: "",
        colors: "",
        tags: "",
      });
      setImages([]);
      dispatch(resetProductCreate());
      onClose();
    }
  }, [success, dispatch, onClose]);

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Product</DialogTitle>
      <DialogContent>
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField name="title" label="Title" fullWidth required value={form.title} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="category" label="Category" fullWidth value={form.category} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={form.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="price"
                label="Price"
                type="number"
                fullWidth
                required
                value={form.price}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="discount"
                label="Discount (%)"
                type="number"
                fullWidth
                value={form.discount}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField name="brand" label="Brand" fullWidth value={form.brand} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="stock"
                label="Stock"
                type="number"
                fullWidth
                value={form.stock}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="sizes"
                label="Sizes (comma separated)"
                fullWidth
                value={form.sizes}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="colors"
                label="Colors (comma separated)"
                fullWidth
                value={form.colors}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="tags"
                label="Tags (comma separated)"
                fullWidth
                required
                value={form.tags}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <div
                {...getRootProps()}
                style={{
                  border: "2px dashed #ccc",
                  padding: "20px",
                  textAlign: "center",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <Typography>Drop the images here...</Typography>
                ) : (
                  <Typography>Drag and drop images here, or click to select</Typography>
                )}
              </div>
              {images.length > 0 && (
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  {images.map((file, idx) => (
                    <Grid item key={idx}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        width={60}
                        height={60}
                        style={{ objectFit: "cover", borderRadius: 4 }}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? "Creating..." : "Create Product"}
        </Button>
      </DialogActions>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        message={errorMsg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Dialog>
  );
};

export default CreateProduct;