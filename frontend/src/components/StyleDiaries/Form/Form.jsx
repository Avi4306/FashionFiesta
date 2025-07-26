import React, { useState } from "react";
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
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { createPost } from "../../../actions/posts";
import "./styles.css";

const Form = ({ isOpen, onClose }) => {
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    tags: [],
    selectedFile: "",
  });

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setPostData({ ...postData, selectedFile: reader.result });
    };
    if (file) reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("profile"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !postData.title ||
      !postData.content ||
      !postData.selectedFile
    ) {
      setErrorMsg("Title, content, tags, and image are required.");
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
      onClose(); // close dialog after submission
    } catch (error) {
      console.error(error);
    }
  };

  const clear = () => {
    setPostData({
      content: "",
      title: "",
      tags: [],
      selectedFile: "",
    });
  };

  if (!user?.result?.name && !user?.result?.sub) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      BackdropProps={{
        style: {
          backgroundColor: "rgba(0, 0, 0, 0.3)", // semi-transparent black
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
              Drag & drop an image, or click to select one
            </p>
          </div>

          {postData.selectedFile && (
            <div className="flex justify-center">
              <img
                src={postData.selectedFile}
                alt="Preview"
                className="w-32 h-auto rounded-xl shadow mt-2"
              />
            </div>
          )}
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={clear} color="secondary">
          Clear
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>

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