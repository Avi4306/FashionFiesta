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
    Snackbar,
    InputAdornment, // NEW: Import InputAdornment
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";

// Helper component for a more styled snackbar alert
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CreateProduct = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { loading, success, error } = useSelector((state) => state.productsData);
    const [errorMsg, setErrorMsg] = useState("");
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
    const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
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
    const [base64Images, setBase64Images] = useState([]);

    const fileToBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const onDrop = useCallback(
        async (acceptedFiles) => {
            const newImages = [...images, ...acceptedFiles];
            setImages(newImages);
            const base64Array = await Promise.all(
                acceptedFiles.map((file) => fileToBase64(file))
            );
            setBase64Images((prev) => [...prev, ...base64Array]);
        },
        [images]
    );

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
        if (!form.title || !form.price || !form.tags || base64Images.length <= 0) {
            setErrorMsg("Title, price, tags and images are required.");
            setOpenErrorSnackbar(true);
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
            images: base64Images,
        };

        dispatch(createProduct(productData));
    };

    // This useEffect hook handles both success and error states
    useEffect(() => {
        if (success) {
            setForm({
                title: "", description: "", price: "", discount: "",
                category: "", brand: "", stock: "", sizes: "",
                colors: "", tags: "",
            });
            setImages([]);
            setBase64Images([]);
            onClose(); // Close the dialog
            setOpenSuccessSnackbar(true); // Show the success message
            // You might want to dispatch an action here to reset the 'success' state in Redux
            // dispatch(resetProductCreate());
        }
        if (error) {
            setErrorMsg(error);
            setOpenErrorSnackbar(true); // Show the error message
        }
    }, [success, error, dispatch, onClose]);

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Create New Product</DialogTitle>
            <DialogContent>
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
                                // START OF CHANGE
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">₹</InputAdornment>
                                    ),
                                }}
                                // END OF CHANGE
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
                open={openErrorSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenErrorSnackbar(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={() => setOpenErrorSnackbar(false)} severity="error">
                    {errorMsg}
                </Alert>
            </Snackbar>

            <Snackbar
                open={openSuccessSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSuccessSnackbar(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={() => setOpenSuccessSnackbar(false)} severity="success">
                    Product successfully added!
                </Alert>
            </Snackbar>
        </Dialog>
    );
};

export default CreateProduct;