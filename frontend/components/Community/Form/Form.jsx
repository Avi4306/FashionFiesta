import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { TextField, Button, Snackbar } from '@mui/material';
import { useDispatch } from 'react-redux';
import { createPost } from '../../../src/actions/posts';
const Form = () => {
    const [postData, setPostData] = useState({
        title: '',
        content: '',
        tags: [],
        selectedFile: ''
    });
    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setPostData({ ...postData, selectedFile: reader.result });  // Store the base64 result
        };

        if (file) {
            reader.readAsDataURL(file);  // Convert to base64
        }
    }
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*', // Only accept image files
    });
    const [errorMsg, setErrorMsg] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const dispatch = useDispatch();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!postData.title || !postData.content || !postData.selectedFile) {
            setErrorMsg('Title, content, and image are required.');
            setOpenSnackbar(true);
            return;
        }
        try {
            await dispatch(createPost(postData)); 
      } catch (error) {
      console.error(error);
    }
        clear();  // Clear the form after submission
    }
    const clear = () => {
        setPostData({
            content: '',
            title: '',
            tags: [],
            selectedFile: ''
        });
    }
    return (
        <>
        <h2>Forms Component</h2>
        <form 
        autoComplete="off" 
        noValidate
        onSubmit={handleSubmit}>
            <TextField name ="title" variant="outlined" label="Title" fullWidth
            value={postData.title}
            onChange={e => setPostData({ ...postData, title: e.target.value })}
            />
            <TextField name ="content" variant="outlined" label="Content" fullWidth
            value={postData.content}
            onChange={e => setPostData({ ...postData, content: e.target.value })}
            />
            <TextField name ="tags" variant="outlined" label="Tags" fullWidth
            value={postData.tags}
            onChange={e => setPostData({ ...postData, tags: e.target.value.split(',') })}  // Split tags by comma
            />
            {/* File Upload using Dropzone */}
            <div {...getRootProps()} style={{ border: '2px dashed #aaa', padding: '20px', marginTop: '10px' }}>
            <input {...getInputProps()} />
            <p>Drag & drop an image, or click to select one</p>
            </div>

            {/* Show image preview if a file is selected */}
            {postData.selectedFile && (
            <img src={postData.selectedFile} alt="Selected file preview" style={{ marginTop: '20px', width: '100px' }} />
            )}
            
            <Button type="submit" variant="contained" color="primary" size='large'>Submit</Button>
            <Button onClick={clear} color="secondary" size ="small">Clear</Button>
            </form>
        </>
    );
}

export default Form;