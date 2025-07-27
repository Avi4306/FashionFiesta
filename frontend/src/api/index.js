import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3000' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }
    return req;
});

export const fetchPosts = (currentPage) => API.get(`/style-diaries?page=${currentPage}`);

export const fetchPost = (id) => API.get(`/style-diaries/${id}`);

export const fetchPostsBySearch = (searchQuery) => API.get(`/style-diaries/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}`);

export const createPost = (newPost) => API.post('/style-diaries', newPost);

export const deletePost = (id) => API.delete(`/style-diaries/${id}`);

export const likePost = (id) => API.patch(`/style-diaries/${id}/likePost`);

export const comment = (value, id) => API.post(`/style-diaries/${id}/comment`, { value });

export const login = (formData) => API.post('/user/login', formData);
export const googleLogin = (formData) => API.post("/user/google", formData);
export const sendOtp = (email) => API.post('/auth/signup/send-otp', { email });
export const verifyOtpSignup = (formData) => API.post('/auth/signup/verify', formData);


export const fetchUserById = (id) => API.get(`/user/${id}`)
export const updateUser = (id, formData) => API.put(`/user/profile/${id}`, formData);

export const fetchUserPosts = (id) => API.get(`/user/${id}/posts`);
export const fetchUserProducts = (id) => API.get(`/user/${id}/products`);
export const fetchFeaturedDesigners = () => API.get('/users/featured-designers');
export const deleteUserAccount = (userId, password) => API.delete(`/user/${userId}`, { data: { password } });


export const fetchProduct = (id) => API.get(`/products/${id}`);
// export const fetchProducts = (query) => API.get(`/products?${query}`);
export const fetchProductsBySearch = (searchQuery) => API.get(`/products/search?searchQuery=${searchQuery.search || 'none'}`);
export const createProduct = (productData) => API.post('/products', productData);

export const fetchCategories = () => API.get("/products/categories/list");

export const fetchProducts = ({ category, page = 1, limit = 12, sort = "newest" }) =>
  API.get("/products/categories", {
    params: { category, page, limit, sort },
  });
  
export const deleteProduct = (id) => API.delete(`/products/${id}`);

export const addToCart = (productId, quantity) => API.post('/cart/add', { productId, quantity });
export const fetchCart = () => API.get('/cart');
export const mergeCarts = (localCartItems) => API.post('/cart/merge', { items: localCartItems });

export const updateCartItem = (productId, quantity) => API.patch(`/cart/${productId}`, { quantity });

export const removeCartItem = (productId) => API.delete(`/cart/${productId}`);


export const uploadImage = (fileData, folderName) =>
  API.post("/upload", { fileData, folderName });