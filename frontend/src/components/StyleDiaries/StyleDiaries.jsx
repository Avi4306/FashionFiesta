import React, { useState, useEffect } from 'react';
import Form from './Form/Form.jsx'; // Assuming Form.jsx is your Create Post form
import Posts from './Posts/Posts.jsx';
import { TextField, Button, IconButton, Box, Typography } from '@mui/material'; // Added Box, Typography
import { Cancel as CancelIcon } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add'; // Import AddIcon for the button
import { useNavigate, useLocation } from 'react-router-dom';
import { MuiChipsInput } from 'mui-chips-input';
import { getPostsBySearch, getPosts } from '../../actions/posts.js';
import { useDispatch } from 'react-redux';

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

  // State for the "Create Post" form visibility
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  // State for the button hover animation
  const [isHoveringPostButton, setIsHoveringPostButton] = useState(false); // Renamed to avoid conflict

  // 🛠️ Fetch posts if there's no search query (on initial load or back navigation)
  useEffect(() => {
    if (!searchQuery && !query.get('tags')) {
      dispatch(getPosts());
    }
  }, [dispatch, searchQuery, query]);

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
        setIsCreatePostOpen(true);
        if (e && e.currentTarget) {
            e.currentTarget.blur();
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

      {/* NEW: Roll out button for Create New Post */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 10, // Adjust position as needed
          right: 100, // Adjust position as needed (or left: 16 if you prefer)
          zIndex: 1000,
        }}
      >
        <Button
          variant="contained"
          color="primary" // Use primary color for consistency or define a custom one
          onClick={handleOpenCreatePost}
          onMouseEnter={handleMouseEnterPostButton} // Use specific handler
          onMouseLeave={handleMouseLeavePostButton} // Use specific handler
          sx={{
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
            backgroundColor: '#aa5a44', // Example color, match your theme
            
            // Hover state
            '&:hover': {
              width: '250px', // Adjust width as needed for your text
              borderRadius: '48px',
              padding: '6px 16px',
              backgroundColor: '#8e4738', // Darker hover color
            },

            // Inner Box for the icon
            '& .MuiButton-startIcon': { // Target the startIcon slot provided by MUI
                marginRight: isHoveringPostButton ? '8px' : '0',
                transition: 'margin-right 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                // Ensure the icon itself is centered if it's the only thing in the circle
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            },
          }}
        >
            <AddIcon /> {/* The plus icon */}
            <Typography 
                variant="button" 
                sx={{ 
                    whiteSpace: 'nowrap',
                    opacity: isHoveringPostButton ? 1 : 0, 
                    transition: 'opacity 0.3s linear 0.3s',
                    marginLeft: isHoveringPostButton ? '0px' : '-200px', // Slide the text in
                    transition: 'margin-left 0.6s linear',
                }}
            >
                Create New Post
            </Typography>
        </Button>
      </Box>

      {/* Render the Form component as a modal/dialog */}
      {/* You must ensure your Form.jsx accepts isOpen and onClose props */}
      <Form isOpen={isCreatePostOpen} onClose={handleCloseCreatePost} />
      <Posts />
    </div>
  );
};

export default StyleDiaries;