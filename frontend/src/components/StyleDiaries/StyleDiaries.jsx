import React, { useEffect } from 'react';
import Form from './Form/Form.jsx';
import Posts from './Posts/Posts.jsx';
import { TextField, Button, IconButton } from '@mui/material';
import { Cancel as CancelIcon } from '@mui/icons-material';
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
      dispatch(getPosts()); // <-- also dispatch here in case user clicks "Search" without input
      navigate('/style-diaries');
    }
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

      <Form />
      <Posts />
    </div>
  );
};

export default StyleDiaries;
