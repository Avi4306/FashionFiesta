import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  TextField,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Grid,
  Typography,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../../actions/posts";
import "./styles.css";

const Form = ({ isOpen, onClose }) => {
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    tags: [],
    selectedFiles: [],
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("profile"));

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const base64Array = await Promise.all(
        acceptedFiles.map((file) => fileToBase64(file))
      );
      setPostData((prev) => ({
        ...prev,
        selectedFiles: [...prev.selectedFiles, ...base64Array],
      }));
    },
    [setPostData]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !postData.title ||
      !postData.content ||
      !postData.tags.length ||
      !postData.selectedFiles.length
    ) {
      setErrorMsg("Title, content, tags, and at least one image are required.");
      setOpenSnackbar(true);
      return;
    }

    try {
      dispatch(
        createPost({
          ...postData,
          name: user?.result?.name || user?.result?.sub,
          creatorPfp: user?.result?.profilePhoto,
        })
      );
      clear();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const clear = () => {
    setPostData({
      content: "",
      title: "",
      tags: [],
      selectedFiles: [],
    });
  };

  // Check if the user is logged in
  const isLoggedIn = user?.result?.name || user?.result?.sub;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      BackdropProps={{
        style: {
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        },
      }}
      PaperProps={{
        style: {
          borderRadius: 16,
          padding: "24px",
        },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
        Got an idea? Share it with the world
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Conditional rendering based on login status */}
      <DialogContent dividers>
          <form
            className="grid grid-cols-1 gap-4"
            autoComplete="off"
            noValidate
            onSubmit={handleSubmit}
          >
            <TextField
              name="title"
              label="Title"
              fullWidth
              value={postData.title}
              onChange={(e) =>
                setPostData({ ...postData, title: e.target.value })
              }
            />

            <TextField
              name="content"
              label="Content"
              fullWidth
              multiline
              rows={4}
              value={postData.content}
              onChange={(e) =>
                setPostData({ ...postData, content: e.target.value })
              }
            />

            <TextField
              name="tags"
              label="Tags (comma separated)"
              fullWidth
              value={postData.tags.join(",")}
              onChange={(e) =>
                setPostData({ ...postData, tags: e.target.value.split(",") })
              }
            />

            <div
              {...getRootProps()}
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 p-4 rounded-md cursor-pointer text-center"
            >
              <input {...getInputProps()} />
              <p className="text-sm text-gray-600 font-medium">
                Drag & drop images, or click to select
              </p>
            </div>

            {postData.selectedFiles.length > 0 && (
              <Grid container spacing={1} sx={{ mt: 1 }}>
                {postData.selectedFiles.map((file, index) => (
                  <Grid item key={index}>
                    <img
                      src={file}
                      alt="Preview"
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </form>

      </DialogContent>
      {isLoggedIn && (
        <DialogActions>
          <Button onClick={clear} color="secondary">
            Clear
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        message={errorMsg}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Dialog>
  );
};

export default Form;