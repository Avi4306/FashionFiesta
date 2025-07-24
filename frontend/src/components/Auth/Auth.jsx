import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, googleLogin, sendSignupOtp, verifySignupOtp } from '../../actions/auth';
import { CLEAR_ERROR } from '../../constants/actionTypes';
import { jwtDecode } from 'jwt-decode';
import CropperDialog from './CropperDialog';
import { Typography, Button } from '@mui/material';

// Icons (custom SVGs or replace with a proper icon library)
const UserIcon = () => <svg className="h-5 w-5 text-gray-500" />;
const MailIcon = () => <svg className="h-5 w-5 text-gray-500" />;
const LockIcon = () => <svg className="h-5 w-5 text-gray-500" />;

const Input = ({ name, type = 'text', placeholder, icon, value, handleChange }) => (
  <div className="relative w-full mb-4">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
      style={{
        backgroundColor: '#F0E4D3',
        borderColor: '#D5D0B8',
        color: '#000000',
        accentColor: '#DCC5B2',
      }}
      required
    />
  </div>
);

export default function Auth() {
  const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePhoto: '',
    otp: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [cropSrc, setCropSrc] = useState(null);
  const [openCropper, setOpenCropper] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [serverOtp, setServerOtp] = useState(null); // optional for dev/testing
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);

  useEffect(() => {
    return () => dispatch({ type: CLEAR_ERROR });
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

  const handleChange = (e) => {
    dispatch({ type: CLEAR_ERROR });
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShowPassword = () => setShowPassword((prev) => !prev);

  const handleSendOtp = async (e) => {
  e.preventDefault();
  if (!formData.email) return;

  try {
    await dispatch(sendSignupOtp(formData.email));
    setOtpStep(true);
  } catch (err) {
    console.error("Error sending OTP:", err);
  }
};

const handleSubmit = async () => {
  try {
    await dispatch(verifySignupOtp(formData, navigate));
    setOtpStep(false);
    setFormData(initialState);
  } catch (err) {
    console.error("OTP verification failed:", err);
  }
};

  const switchMode = () => {
    dispatch({ type: CLEAR_ERROR });
    setIsSignUp((prev) => !prev);
    setShowPassword(false);
    setFormData(initialState);
    setOtpStep(false);
  };

  const googleSuccess = async (res) => {
    const token = res?.credential;
    if (!token) return;
    const decoded = jwtDecode(token);
    const { name, email, picture } = decoded;

    try {
      dispatch(googleLogin({ name, email, picture }, navigate));
    } catch (error) {
      console.error("Google Login Failed:", error);
    }
  };

  const googleFailure = (err) => {
    console.error("Google Sign In failed:", err);
  };

  const spring = { type: "spring", stiffness: 260, damping: 30 };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans p-4 bg-[#FAF7F3]">
      <div className="relative w-full max-w-4xl min-h-[600px] rounded-2xl shadow-2xl overflow-hidden flex bg-[#FAF7F3]">
        <div className="w-1/2 p-8 sm:p-12 flex flex-col justify-center items-center">
          <AnimatePresence>
            {isSignUp && (
              <motion.div
                key="signup-form"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ ...spring, duration: 0.5 }}
                className="w-full"
              >
                <h2 className="text-3xl font-bold text-black mb-2 text-center">Create Account</h2>
                <p className="text-black mb-6 text-sm text-center">or use your email for registration</p>
                <form onSubmit={handleSendOtp}>
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
                  <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <input accept="image/*" type="file" onChange={handleImageChange} style={{ display: 'none' }} id="profile-upload" />
                    <label htmlFor="profile-upload" style={{ cursor: 'pointer' }}>
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" style={{ width: 80, height: 80, borderRadius: '50%' }} />
                      ) : (
                        <div style={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#fff' }}>
                          {formData.firstName ? formData.firstName.charAt(0) : 'U'}
                        </div>
                      )}
                      <Typography variant="body2" color="primary">{imagePreview ? 'Change Photo' : 'Upload Profile Photo'}</Typography>
                    </label>
                    {imagePreview && (
                      <Button size="small" color="secondary" onClick={() => {
                        setImagePreview('');
                        setFormData({ ...formData, profilePhoto: '' });
                      }} style={{ marginTop: '0.5rem' }}>
                        Remove Photo
                      </Button>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input name="firstName" placeholder="First Name" icon={<UserIcon />} value={formData.firstName} handleChange={handleChange} />
                    <Input name="lastName" placeholder="Last Name" icon={<UserIcon />} value={formData.lastName} handleChange={handleChange} />
                  </div>
                  <Input name="email" type="email" placeholder="Email" icon={<MailIcon />} value={formData.email} handleChange={handleChange} />
                  <Input name="password" type={showPassword ? "text" : "password"} placeholder="Password" icon={<LockIcon />} value={formData.password} handleChange={handleChange} />
                  <Input name="confirmPassword" type={showPassword ? "text" : "password"} placeholder="Confirm Password" icon={<LockIcon />} value={formData.confirmPassword} handleChange={handleChange} />
                  {error && <p className="text-red-600 text-sm mt-2 text-center">{error}</p>}

                  <div className="text-center">
                    {/* OTP input section */}
                    {otpStep && (
                      <div className="text-center mt-6">
                        <h3 className="text-lg font-semibold mb-2">Enter the OTP sent to your email</h3>
                        <input
                          type="text"
                          name="otp"
                          placeholder="Enter OTP"
                          value={formData.otp}
                          onChange={handleChange}
                          className="w-48 px-3 py-2 border border-gray-300 rounded focus:outline-none"
                        />
                        <button
                          className="mt-4 w-48 py-2 rounded-full bg-black text-white font-semibold"
                          onClick={handleSubmit}
                        >
                          Verify OTP
                        </button>
                        {serverOtp && (
                          <p className="mt-2 text-xs text-gray-500">Dev OTP: {serverOtp}</p>
                        )}
                      </div>
                    )}
                    {!otpStep && (
                    <button type="submit" className="w-48 mt-4 font-bold py-3 px-6 rounded-full shadow-lg hover:scale-105 transition-transform" style={{ backgroundColor: '#DCC5B2', color: '#FAF7F3' }}>
                      SIGN UP
                    </button>
                    )}
                  </div>
                  <div className="mt-4 flex justify-center">
                    <GoogleLogin onSuccess={googleSuccess} onError={googleFailure} />
                  </div>
                </form>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sign In Form */}
        <div className="w-1/2 p-8 sm:p-12 flex flex-col justify-center items-center">
          <AnimatePresence>
            {!isSignUp && (
              <motion.div
                key="signin-form"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ ...spring, duration: 0.5 }}
                className="w-full"
              >
                <h2 className="text-3xl font-bold text-black mb-2 text-center">Sign In</h2>
                <p className="text-black mb-6 text-sm text-center">or use your account</p>
                <form onSubmit={handleSubmit}>
                  <Input name="email" type="email" placeholder="Email" icon={<MailIcon />} value={formData.email} handleChange={handleChange} />
                  <Input name="password" type={showPassword ? "text" : "password"} placeholder="Password" icon={<LockIcon />} value={formData.password} handleChange={handleChange} />
                  {error && <p className="text-red-600 text-sm mt-2 text-center">{error}</p>}
                  <div className="text-center">
                    <button type="submit" className="w-48 mt-4 font-bold py-3 px-6 rounded-full shadow-lg hover:scale-105 transition-transform" style={{ backgroundColor: '#DCC5B2', color: '#FAF7F3' }}>
                      SIGN IN
                    </button>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <GoogleLogin onSuccess={googleSuccess} onError={googleFailure} />
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Overlay */}
        <motion.div
          className="absolute top-0 left-0 h-full w-1/2 flex flex-col items-center justify-center text-center p-8 z-30 text-black"
          style={{ backgroundColor: '#DCC5B2' }}
          animate={{ x: isSignUp ? '100%' : '0%' }}
          transition={spring}
        >
          <AnimatePresence mode="wait">
            {isSignUp ? (
              <motion.div key="overlay-signup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                <h2 className="text-3xl font-bold mb-2">Hello, Friend!</h2>
                <p className="mb-8">Enter your personal details and start your journey with us</p>
                <button onClick={switchMode} className="w-48 border-2 border-black py-3 px-6 rounded-full hover:bg-black hover:text-[#DCC5B2] transition-all font-bold">
                  SIGN IN?
                </button>
              </motion.div>
            ) : (
              <motion.div key="overlay-signin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
                <p className="mb-8">To keep connected with us please login with your personal info</p>
                <button onClick={switchMode} className="w-48 border-2 border-black py-3 px-6 rounded-full hover:bg-black hover:text-[#DCC5B2] transition-all font-bold">
                  SIGN UP?
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}