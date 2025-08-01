<<<<<<< HEAD
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
=======
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { createPost } from "../../../actions/posts";
import "./styles.css";

const Form = () => {
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    tags: [],
<<<<<<< HEAD
    selectedFiles: [],
=======
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
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const dispatch = useDispatch();
<<<<<<< HEAD
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
=======
  const user = JSON.parse(localStorage.getItem("profile"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postData.title || !postData.content || !postData.tags) {
      setErrorMsg("Title, content, and image are required.");
      setOpenSnackbar(true);
      return;
    }
    try {
      dispatch(createPost({ ...postData, name: user?.result?.name || user?.result?.sub, creatorPfp: user?.result?.profilePhoto }));
    } catch (error) {
      console.error(error);
    }
    clear();
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
  };

  const clear = () => {
    setPostData({
      content: "",
      title: "",
      tags: [],
<<<<<<< HEAD
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
=======
      selectedFile: "",
    });
  };

  if (!user?.result?.name && !user?.result.sub) {
    return (
      <div className="community-container">
        <h2 className="text-4xl tracking-[0.4rem] text-shadow-lg/30">
          Please Sign In to share your ideas
        </h2>
      </div>
    );
  }

  return (
    <div className="community-container grid grid-cols-1 grid-rows-[10rem,auto] gap-5 text-center">
      <h2 className="text-4xl tracking-[0.4rem] text-shadow-lg/30">
        Got an idea? Share it with the world
      </h2>

      <form
        className="Form-container grid grid-cols-1 md:grid-cols-2 grid-rows-auto gap-5 w-full"
        autoComplete="off"
        noValidate
        onSubmit={handleSubmit}
      >
        {/* Title Field */}
        <TextField
          name="title"
          label="Title"
          variant="outlined"
          fullWidth
          value={postData.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
          className="md:col-span-2"
          slotProps={{
            inputLabel: {
              sx: {
                color: "#2e2e2e",
                fontFamily: "Montserrat",
                backgroundColor: "transparent",
                px: "4px",
                "&.Mui-focused": {
                  color: "#000",
                  backgroundColor: "transparent",
                },
              },
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              backgroundColor: "#faf7f3",
              fontFamily: "Montserrat",
              "& input": {
                padding: "12px",
              },
              "& fieldset": { borderColor: "#ccc" },
              "&:hover fieldset": { borderColor: "#999" },
              "&.Mui-focused fieldset": {
                borderColor: "#000",
                boxShadow: "0 0 0 2px rgba(0,0,0,0.15)",
              },
            },
          }}
        />

        {/* Content Field */}
        <TextField
          name="content"
          label="Content"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={postData.content}
          onChange={(e) =>
            setPostData({ ...postData, content: e.target.value })
          }
          className="md:col-span-2"
          slotProps={{
            inputLabel: {
              sx: {
                color: "#2e2e2e",
                fontFamily: "Montserrat",
                backgroundColor: "transparent",
                px: "4px",
                "&.Mui-focused": {
                  color: "#000",
                  backgroundColor: "transparent",
                },
              },
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              backgroundColor: "#faf7f3",
              fontFamily: "Montserrat",
              "& textarea": {
                padding: "12px",
              },
              "& fieldset": { borderColor: "#ccc" },
              "&:hover fieldset": { borderColor: "#999" },
              "&.Mui-focused fieldset": {
                borderColor: "#000",
                boxShadow: "0 0 0 2px rgba(0,0,0,0.15)",
              },
            },
          }}
        />

        {/* Tags Field */}
        <TextField
          name="tags"
          label="Tags (Comma separated)"
          variant="outlined"
          fullWidth
          value={postData.tags.join(",")}
          onChange={(e) =>
            setPostData({ ...postData, tags: e.target.value.split(",") })
          }
          className="md:col-span-2"
          slotProps={{
            inputLabel: {
              sx: {
                color: "#2e2e2e",
                fontFamily: "Montserrat",
                backgroundColor: "transparent",
                px: "4px",
                "&.Mui-focused": {
                  color: "#000",
                  backgroundColor: "transparent",
                },
              },
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              backgroundColor: "#faf7f3",
              fontFamily: "Montserrat",
              "& input": {
                padding: "12px",
              },
              "& fieldset": { borderColor: "#ccc" },
              "&:hover fieldset": { borderColor: "#999" },
              "&.Mui-focused fieldset": {
                borderColor: "#000",
                boxShadow: "0 0 0 2px rgba(0,0,0,0.15)",
              },
            },
          }}
        />

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className="col-span-1 md:col-span-2 flex flex-col items-center justify-center text-center border-2 border-dashed border-[#737373] rounded-2xl p-6 cursor-pointer transition hover:border-[#999]"
        >
          <input {...getInputProps()} />
          <p className="text-sm text-gray-600 font-medium">
            Drag & drop an image, or click to select one
          </p>
        </div>

        {/* Image Preview */}
        {postData.selectedFile && (
          <div className="col-span-1 md:col-span-2 flex justify-center">
            <img
              src={postData.selectedFile}
              alt="Preview"
              className="w-32 h-auto rounded-xl shadow"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row justify-center items-center gap-4 mt-2">
          <button
            type="submit"
            className="px-5 py-2 bg-[#dcc5b2] text-white font-semibold rounded-md shadow hover:bg-[#dfd0b8] transition"
          >
            Submit
          </button>
          <button
            onClick={clear}
            type="button"
            className="px-5 py-2 bg-[#ccc] text-black font-semibold rounded-md shadow hover:bg-[#bbb] transition"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
