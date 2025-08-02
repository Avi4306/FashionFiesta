import React, { useState } from 'react';
import { Button, Box, Typography, Snackbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MuiAlert from '@mui/material/Alert'; // For a styled Snackbar
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useSelector } from 'react-redux'; // Import useSelector

import Categories from './Categories/Categories';
import Products from '../Products/Products';
import CreateProduct from '../Products/CreateProduct';

// Helper component for a more styled snackbar alert
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const TrendingStyles = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const profile = JSON.parse(localStorage.getItem("profile")); // Get user profile from localStorage
    const userId = profile?.result?._id || profile?.result?.sub; // Determine userId

    const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false); // State for Snackbar visibility
    const [snackbarMessage, setSnackbarMessage] = useState(""); // State for Snackbar message

    const handleOpenCreateProduct = () => {
        if (!userId) { // Check if user is not logged in
            setSnackbarMessage("Please sign in to create a product.");
            setOpenSnackbar(true);
        } else {
            setIsCreateProductOpen(true);
        }
    };

    const handleCloseCreateProduct = () => {
        setIsCreateProductOpen(false);
    };

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    return (
        <div>
            <Categories />

            <Box
                sx={{
                    position: 'fixed',
                    bottom: 30,
                    right: 100,
                    zIndex: 1000,
                }}
            >
                <Button
                    variant="contained"
                    
                    onClick={handleOpenCreateProduct}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    sx={{
                        transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1), padding 0.6s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        backgroundColor: '#ccb5a2',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        overflow: 'hidden',
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        padding: '0 12px',
                        minWidth: '48px',
                        '&:hover': {
                            width: '250px',
                            borderRadius: '48px',
                            padding: '6px 16px',
                        },
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        marginRight: '8px',
                    }}>
                        <AddIcon />
                    </Box>
                    <Typography
                        variant="button"
                        sx={{
                            whiteSpace: 'nowrap',
                            opacity: isHovering ? 1 : 0,
                            marginLeft: isHovering ? '0px' : '-200px',
                        }}
                    >
                        Add New Product
                    </Typography>
                </Button>
            </Box>

            <Products navigateOnCategoryChange = {false} />

            <CreateProduct
                isOpen={isCreateProductOpen}
                onClose={handleCloseCreateProduct}
            />

            {/* Snackbar for unauthorized access */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity="info"
                    sx={{ width: '100%', display: 'flex', alignItems: 'center' }}
                >
                    <div className="flex-grow">{snackbarMessage}</div>
                    <Button
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setOpenSnackbar(false);
                            navigate('/auth'); // Navigate to auth page
                        }}
                    >
                        SIGN IN
                    </Button>
                </Alert>
            </Snackbar>
        </div>
    );
};

export default TrendingStyles;