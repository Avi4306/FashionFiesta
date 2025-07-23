import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3000' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }
    return req;
});

export const fetchPosts = () => API.get('/style-diaries');

export const fetchPost = (id) => API.get(`/style-diaries/${id}`);

export const fetchPostsBySearch = (searchQuery) => API.get(`/style-diaries/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}`);

export const createPost = (newPost) => API.post('/style-diaries', newPost);

export const deletePost = (id) => API.delete(`/style-diaries/${id}`);

export const likePost = (id) => API.patch(`/style-diaries/${id}/likePost`);

export const comment = (value, id) => API.post(`/style-diaries/${id}/comment`, { value });

export const login = (formData) => API.post('/user/login', formData);
export const googleLogin = (formData) => API.post("/user/google", formData);
export const signUp = (formData) => API.post('/user/signup', formData);

export const fetchUserById = (id) => API.get(`/user/${id}`)
export const updateUser = (id, formData) => API.put(`/user/profile/${id}`, formData);

export const fetchUserPosts = (id) => API.get(`/user/${id}/posts`);
export const fetchUserProducts = (id) => API.get(`/user/${id}/products`);

export const deleteUserAccount = (userId, password) => API.delete(`/user/${userId}`, { data: { password } });