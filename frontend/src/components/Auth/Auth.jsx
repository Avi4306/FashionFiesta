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
const Auth = () => {

    const [showPassword, setShowPassword] = useState(false);
    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);
    const [isSignup, setIsSignup] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleChange = () => {

    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
    };
    const switchMode = () => {
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
            <button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
                {isSignup ? 'Sign Up' : 'Login'}
            </button>
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
