import React from 'react'
import Form from './Form/Form.jsx'
import Posts from './Posts/Posts.jsx'
import { AppBar, TextField, Button, Chip, IconButton } from '@mui/material'
import {Cancel as CancelIcon} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { MuiChipsInput } from 'mui-chips-input'
import { getPostsBySearch } from '../../actions/posts.js'
import { useDispatch } from 'react-redux'
import { useState } from 'react';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const styleDiaries = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const page = query.get('page') || 1;
  const searchQuery = query.get('searchQuery');
  const [search, setSearch] = React.useState('');
  const [tags, setTags] = React.useState([]);
  const clearSearch = () => {
    setSearch('');
  };
  const searchPost = () => {
    if (search.trim() || tags.length) {
      dispatch(getPostsBySearch({ search, tags: tags.join(',') }));
      navigate(`/style-diaries/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`);
    } else {
      navigate('/style-diaries');
    }
  }
  return (
    <>
      <AppBar position="static" color="inherit" className="mb-4">
        <TextField
          name="search"
          variant="outlined"
          label="Search Style Diaries"
          fullWidth
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (search.trim()) {
                navigate(`/style-diaries/search?searchQuery=${search}`);
              } else {
                navigate('/style-diaries');
              }
            }
          }}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <IconButton onClick={clearSearch}>
          <CancelIcon />
        </IconButton>
        <MuiChipsInput
      value={tags}
      onChange={setTags}
      placeholder="Add tags"
    />
        <Button
          variant="contained"
          color="primary"
          onClick={searchPost}>Search</Button>
        </AppBar>
      <Form />
      <Posts/>
    </>
  )
}

export default styleDiaries
