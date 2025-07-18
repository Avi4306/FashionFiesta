import React from 'react'
import { TextField, Grid, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
const Input = ({name, handleChange, label, autoFocus, type, half, handleShowPassword}) => {
    const isPassword = name === 'password';
  return (
    <Grid item xs={12} sm={half ? 6 : 12}>
      <TextField
      name={name}
      onChange={handleChange}
      variant='outlined'
      required
      fullWidth
      label= {label}
      autoFocus={autoFocus}
      type={type}
      {...(isPassword && {
          slotProps: {
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    {type === 'password' ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          },
        })}
      />
    </Grid>
  )
}

export default Input
