import React from 'react'
import { useState, useRef } from 'react'
import { Button, TextField, Typography } from '@mui/material'
import { useDispatch } from 'react-redux'

const CommentSection = ({post}) => {
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')
  return (
    <div>
      <div>
        <div>
            <Typography variant="h6" gutterBottom>
              Comments
            </Typography>
            <div>
                {comments.map((comment, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                        <Typography variant="body1" gutterBottom>
                        <strong>{comment.name}</strong>: {comment.comment}
                        </Typography>
                    </div>
                    ))}
            </div>
            <div>
                <Typography variant="h6" gutterBottom>
                Add a Comment...
                </Typography>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Name"
                    margin="normal"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

            </div>
        </div>
      </div>
    </div>
  )
}

export default CommentSection
