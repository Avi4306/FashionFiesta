import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Categories from './Categories/Categories';
import Products from '../Products/Products';
import CreateProduct from '../Products/CreateProduct';

const TrendingStyles = () => {
    const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const handleOpenCreateProduct = () => {
        setIsCreateProductOpen(true);
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
            <Categories/>

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
                    color="primary"
                    onClick={handleOpenCreateProduct}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    sx={{
                        // Animate width, padding, and border-radius for the 'roll out' effect
                        transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1), padding 0.6s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        overflow: 'hidden',
                        
                        // Initial circular state (when not hovering)
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        padding: '0 12px',
                        minWidth: '48px', 
                        
                        // Hover state
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
                            transition: 'opacity 0.3s linear 0.3s',
                            marginLeft: isHovering ? '0px' : '-200px', // Slide the text in
                            transition: 'margin-left 0.6s linear',
                        }}
                    >
                        Create New Product
                    </Typography>
                </Button>
            </Box>

            <Products />

            <CreateProduct
                isOpen={isCreateProductOpen}
                onClose={handleCloseCreateProduct}
            />
        </div>
    );
};

export default TrendingStyles;