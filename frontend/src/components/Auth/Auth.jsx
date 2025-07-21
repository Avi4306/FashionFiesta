import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, signup } from '../../actions/auth';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

// --- Helper Components & Icons ---
const UserIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>);
const MailIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>);
const LockIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>);

const Input = ({ name, type = 'text', placeholder, icon, value, handleChange }) => (
    <div className="relative w-full mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>
        <input name={name} type={type} placeholder={placeholder} value={value} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2" style={{ backgroundColor: '#F0E4D3', borderColor: '#D5D0B8', color: '#000000', 'accentColor': '#DCC5B2' }} required />
    </div>
);

// --- Main App Component ---
export default function Auth() {
    const [isSignUp, setIsSignUp] = useState(true);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
    
    // --- Restored original functional logic ---
    const dispatch = useDispatch();
    const navigate = useNavigate();
    [formData, setFormData] = useState(initialState);
    const handleChange = (e) => {
        dispatch({ type: 'CLEAR_ERROR' });
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSignUp) {
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
        const result = jwtDecode(res?.credential);
        try {
            dispatch({ type: 'AUTH', data: { result, token } });
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };

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

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const switchMode = () => {
        setIsSignUp((prev) => !prev);
        setFormData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
    };

    const spring = { type: "spring", stiffness: 260, damping: 30 };

    return (
        <div className="min-h-screen flex items-center justify-center font-sans p-4" style={{ backgroundColor: '#FAF7F3' }}>
            <div className="relative w-full max-w-4xl min-h-[600px] rounded-2xl shadow-2xl overflow-hidden flex" style={{ backgroundColor: '#FAF7F3' }}>
                
                {/* Sign Up Form Panel (Left Side) */}
                <div className="w-1/2 p-8 sm:p-12 flex flex-col justify-center items-center">
                    <AnimatePresence>
                        {isSignUp && (
                            <motion.div key="signup-form" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ ...spring, duration: 0.5 }} className="w-full">
                                <h2 className="text-3xl font-bold text-black mb-2 text-center">Create Account</h2>
                                <p className="text-black mb-6 text-sm text-center">or use your email for registration</p>
                                <form onSubmit={handleSubmit} className="w-full">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                       <Input name="firstName" placeholder="First Name" icon={<UserIcon />} value={formData.firstName} handleChange={handleChange} />
                                       <Input name="lastName" placeholder="Last Name" icon={<UserIcon />} value={formData.lastName} handleChange={handleChange} />
                                    </div>
                                    <Input name="email" type="email" placeholder="Email" icon={<MailIcon />} value={formData.email} handleChange={handleChange} />
                                    <Input name="password" type="password" placeholder="Password" icon={<LockIcon />} value={formData.password} handleChange={handleChange} />
                                    <Input name="confirmPassword" type="password" placeholder="Confirm Password" icon={<LockIcon />} value={formData.confirmPassword} handleChange={handleChange} />
                                    <div className="text-center">
                                        <button type="submit" className="w-48 mt-4 font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg" style={{ backgroundColor: '#DCC5B2', color: '#FAF7F3' }}>SIGN UP</button>
                                    </div>
                                </form>
                                <div className="mt-4 w-full flex justify-center">
                                   <GoogleLogin onSuccess={googleSuccess} onError={googleFailure} theme="filled_black" shape="pill" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sign In Form Panel (Right Side) */}
                <div className="w-1/2 p-8 sm:p-12 flex flex-col justify-center items-center">
                     <AnimatePresence>
                        {!isSignUp && (
                            <motion.div key="signin-form" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ ...spring, duration: 0.5 }} className="w-full">
                                <h2 className="text-3xl font-bold text-black mb-2 text-center">Sign In</h2>
                                <p className="text-black mb-6 text-sm text-center">or use your account</p>
                                <form onSubmit={handleSubmit} className="w-full">
                                    <Input name="email" type="email" placeholder="Email" icon={<MailIcon />} value={formData.email} handleChange={handleChange} />
                                    <Input name="password" type="password" placeholder="Password" icon={<LockIcon />} value={formData.password} handleChange={handleChange} />
                                    <a href="#" className="text-sm text-black hover:text-gray-700 my-4 block text-center">Forgot your password?</a>
                                    <div className="text-center">
                                        <button type="submit" className="w-48 mt-2 font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg" style={{ backgroundColor: '#DCC5B2', color: '#FAF7F3' }}>SIGN IN</button>
                                    </div>
                                </form>
                                <div className="mt-4 w-full flex justify-center">
                                   <GoogleLogin onSuccess={googleSuccess} onError={googleFailure} theme="filled_black" shape="pill" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sliding Overlay */}
                <motion.div className="absolute top-0 left-0 h-full w-1/2 flex flex-col items-center justify-center text-center p-8 z-30" style={{ backgroundColor: '#DCC5B2', color: '#000000' }} initial={false} animate={{ x: isSignUp ? '100%' : '0%' }} transition={spring}>
                    <AnimatePresence mode="wait">
                        {isSignUp ? (
                            <motion.div key="overlay-signup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                                <h2 className="text-3xl font-bold mb-2">Hello, Friend!</h2>
                                <div className="w-xs h-0.5 my-3 ml-8" style={{ backgroundColor: '#000000', opacity: 0.7 }}></div>
                                <p className="mb-8">Enter your personal details and start your journey with us</p>
                                <button onClick={switchMode} className="w-48 bg-transparent font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105" style={{ border: '2px solid #000000', color: '#000000' }} onMouseOver={e => {e.currentTarget.style.backgroundColor = '#000000'; e.currentTarget.style.color = '#DCC5B2'}} onMouseOut={e => {e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#000000'}}>SIGN IN?</button>
                            </motion.div>
                        ):
                        (
                            <motion.div key="overlay-signin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                                <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
                                <div className="w-xs h-0.5 my-3 ml-8" style={{ backgroundColor: '#000000', opacity: 0.7 }}></div>
                                <p className="mb-8">To keep connected with us please login with your personal info</p>
                                <button onClick={switchMode} className="w-48 bg-transparent font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105" style={{ border: '2px solid #000000', color: '#000000' }} onMouseOver={e => {e.currentTarget.style.backgroundColor = '#000000'; e.currentTarget.style.color = '#DCC5B2'}} onMouseOut={e => {e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#000000'}}>SIGN UP?</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
