import React from 'react'
import { Button, Paper, Grid, Typography, Container} from '@mui/material';
import { Lock } from '@mui/icons-material';
import {IconButton } from '@mui/material';
import Input from './Input';
import { useState } from 'react';
import {GoogleLogin} from '@react-oauth/google'
import { useDispatch } from 'react-redux';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { login, signup } from '../../actions/auth';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import CropperDialog from './CropperDialog';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '', profilePhoto: '' };

const Auth = () => {

    const [showPassword, setShowPassword] = useState(false);
    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);
    const [isSignup, setIsSignup] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialState);
    const [imagePreview, setImagePreview] = useState('');
    const [cropSrc, setCropSrc] = useState(null);
    const [openCropper, setOpenCropper] = useState(false);
    const handleChange = (e) => {
        dispatch({ type: 'CLEAR_ERROR' });
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting form data:", formData)
        if (isSignup) {
            dispatch(signup(formData, navigate));
        } else {
            dispatch(login(formData, navigate));
        }
    };
    const switchMode = () => {
        dispatch({ type: 'CLEAR_ERROR' });
        setIsSignup((prevIsSignUp) => !prevIsSignUp);
        setShowPassword(false); // Reset password visibility when switching modes
    }
    const googleSuccess = async (res) => {
        const token = res?.credential;
        const decodedData = jwtDecode(token);
        try {
            dispatch({ type: 'AUTH', data: { result : decodedData, token } });

            navigate('/');
        } catch (error) {
            console.log(error);
            console.log("Google Sign In was unsuccessful.");
        }
    }
    const googleFailure = (error) => {
        console.log(error);
        console.log("Google Sign In was unsuccessful. Try again later.");
    }
    const { error } = useSelector((state) => state.auth);
    useEffect(() => {
  return () => {
    dispatch({ type: 'CLEAR_ERROR' }); // clear on unmount
  };
}, [dispatch]);
const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    setCropSrc(reader.result);
    setOpenCropper(true);
  };
  reader.readAsDataURL(file);
};

  return (
    <Container component="main" maxWidth="xs">
        <Paper elevation={3}>
        <IconButton>
            <Lock />
        </IconButton>
        <Typography variant="h5">{isSignup ? 'Sign Up' : 'Login'}</Typography>
        <Typography variant="body2">{isSignup ? 'Sign Up to continue' : 'Login to continue'}</Typography>
      <form >
        <Grid container spacing={2}>
            {openCropper && (
            <CropperDialog
                imageSrc={cropSrc}
                onClose={() => setOpenCropper(false)}
                onCropDone={(croppedImage) => {
                setFormData({ ...formData, profilePhoto: croppedImage });
                setImagePreview(croppedImage);
                setOpenCropper(false);
                }}
            />
            )}
            {isSignup && (
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <input
                accept="image/*"
                type="file"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="profile-upload"
                />
                <label htmlFor="profile-upload" style={{ cursor: 'pointer' }}>
                {imagePreview ? (
                    <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: 80, height: 80, borderRadius: '50%' }}
                    />
                ) : (
                    <div
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        backgroundColor: '#ccc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        margin: '0 auto',
                        color: '#fff',
                        textTransform: 'uppercase',
                    }}
                    >
                    {formData.firstName ? formData.firstName.charAt(0) : 'U'}
                    </div>
                )}
                <Typography variant="body2" color="primary">
                    {imagePreview ? 'Change Photo' : 'Upload Profile Photo'}
                </Typography>
                </label>

                {/* ✅ Remove Button (Only if preview is set) */}
                {imagePreview && (
                <Button
                    size="small"
                    color="secondary"
                    onClick={() => {
                    setImagePreview('');
                    setFormData({ ...formData, profilePhoto: '' });
                    }}
                    style={{ marginTop: '0.5rem' }}
                >
                    Remove Photo
                </Button>
                )}
            </div>
            )}

            {isSignup && (
            <>
            <Input name="firstName" label="First Name"  handleChange={handleChange} autoFocus half/>
            <Input name="lastName" label="Last Name" handleChange={handleChange} half/>
            </>
            )}
        </Grid>
            <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
            <Input name="password" label="Password" handleChange={handleChange} type= {showPassword ? "text" : "password"} handleShowPassword={handleShowPassword}/>
            { isSignup && (
            <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword}/>
            )}
            {error && <Typography color="error">{error}</Typography>}
            <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
                {isSignup ? 'Sign Up' : 'Login'}
            </Button>
            <GoogleLogin
                onSuccess={googleSuccess}
                onError={googleFailure}
                logo_alignment="left"
                style={{ marginTop: '10px', marginBottom: '10px' }}
            />
            <Grid container justifyContent="flex-end">
                <Grid item>
                    <Button onClick={switchMode}>{isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}</Button>
                </Grid>
            </Grid>
      </form>
      </Paper>
    </Container>
  )
}

export default Auth
