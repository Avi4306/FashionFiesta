import React, { useState, useEffect } from 'react';
import Form from './Form/Form.jsx'; // Assuming Form.jsx is your Create Post form
import Posts from './Posts/Posts.jsx';
import { TextField, Button, IconButton, Box, Typography, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { Cancel as CancelIcon } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate, useLocation } from 'react-router-dom';
import { MuiChipsInput } from 'mui-chips-input';
import { getPostsBySearch, getPosts } from '../../actions/posts.js';
import { useDispatch } from 'react-redux';

// Helper component for a more styled snackbar alert
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const StyleDiaries = () => {
    const query = useQuery();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const searchQuery = query.get('searchQuery');
    const [search, setSearch] = React.useState('');
    const [tags, setTags] = React.useState([]);

    // Get user authentication status
    const profile = JSON.parse(localStorage.getItem("profile"));
    const userId = profile?.result?._id || profile?.result?.sub;

    // State for the "Create Post" form visibility
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
    // State for the button hover animation
    const [isHoveringPostButton, setIsHoveringPostButton] = useState(false);

    // State for Snackbar visibility and message
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    // 🛠️ Fetch posts if there's no search query (on initial load or back navigation)
    useEffect(() => {
        if (!searchQuery && !query.get('tags')) {
            dispatch(getPosts());
        }
    }, [dispatch, searchQuery, query.get('tags')]); // <-- FIX: Changed dependency from 'query' to 'query.get('tags')'

    const clearSearch = () => setSearch('');

    const searchPost = () => {
        if (search.trim() || tags.length) {
            dispatch(getPostsBySearch({ search, tags: tags.join(',') }));
            navigate(`/style-diaries/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`);
        } else {
            dispatch(getPosts());
            navigate('/style-diaries');
        }
    };

    // Handlers for the "Create Post" form
    const handleOpenCreatePost = (e) => {
        if (!userId) { // Check if user is not logged in
            setSnackbarMessage("Please sign in to create a post.");
            setOpenSnackbar(true);
        } else {
            setIsCreatePostOpen(true);
            if (e && e.currentTarget) {
                e.currentTarget.blur();
            }
        }
    };

    const handleCloseCreatePost = () => {
        setIsCreatePostOpen(false);
    };

    // Handlers for the "Create Post" button hover animation
    const handleMouseEnterPostButton = () => {
        setIsHoveringPostButton(true);
    };

    const handleMouseLeavePostButton = () => {
        setIsHoveringPostButton(false);
    };

    return (
        <div className="px-4 sm:px-8 md:px-16 py-4 space-y-6">
            <div className="bg-[#FAF7F3] rounded-2xl shadow-lg p-4 sm:p-6 space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    {/* Search Field */}
                    <div className="flex w-full">
                        <TextField
                            name="search"
                            variant="outlined"
                            label="Search Diaries"
                            size="small"
                            fullWidth
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') searchPost();
                            }}
                            sx={{
                                '& label.Mui-focused': { color: '#000' },
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': { borderColor: '#dcc5b2' },
                                },
                            }}
                        />
                        <IconButton onClick={clearSearch} className="text-[#000]">
                            <CancelIcon fontSize="small" />
                        </IconButton>
                    </div>

                    {/* Tags and Search Button */}
                    <div className="flex w-full flex-col sm:flex-row gap-2">
                        <MuiChipsInput
                            value={tags}
                            onChange={setTags}
                            placeholder="Add tags"
                            fullWidth
                            className="text-sm"
                            sx={{
                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#dcc5b2',
                                },
                                '& .MuiChip-root': {
                                    backgroundColor: '#dcc5b2',
                                    color: '#fff',
                                },
                            }}
                        />
                        <Button
                            variant="contained"
                            size="small"
                            onClick={searchPost}
                            sx={{
                                backgroundColor: '#dcc5b2',
                                color: '#fff',
                                paddingX: 2.5,
                                paddingY: 0.8,
                                '&:hover': { backgroundColor: '#dfd0b8' },
                                borderRadius: '8px',
                                textTransform: 'none',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            Search
                        </Button>
                    </div>
                </div>
            </div>

            {/*Roll out button for Create New Post */}
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 10,
                    right: 100,
                    zIndex: 1000,
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenCreatePost}
                    onMouseEnter={handleMouseEnterPostButton}
                    onMouseLeave={handleMouseLeavePostButton}
                    sx={{
                        transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1), padding 0.6s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        overflow: 'hidden',
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        padding: '0 12px',
                        minWidth: '48px',
                        backgroundColor: '#aa5a44',
                        '&:hover': {
                            width: '250px',
                            borderRadius: '48px',
                            padding: '6px 16px',
                            backgroundColor: '#8e4738',
                        },
                        '& .MuiButton-startIcon': {
                            marginRight: isHoveringPostButton ? '8px' : '0',
                            transition: 'margin-right 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                    }}
                >
                    <AddIcon />
                    <Typography
                        variant="button"
                        sx={{
                            whiteSpace: 'nowrap',
                            opacity: isHoveringPostButton ? 1 : 0,
                            transition: 'opacity 0.3s linear 0.3s',
                            marginLeft: isHoveringPostButton ? '10px' : '-200px',
                        }}
                    >
                        Create New Post
                    </Typography>
                </Button>
            </Box>

            {/* Render the Form component as a modal/dialog */}
            <Form isOpen={isCreatePostOpen} onClose={handleCloseCreatePost} />
            <Posts />

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
                            navigate('/auth');
                        }}
                    >
                        SIGN IN
                    </Button>
                </Alert>
            </Snackbar>
        </div>
    );
};

export default StyleDiaries;