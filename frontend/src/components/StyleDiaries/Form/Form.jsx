import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { createPost } from "../../../actions/posts";
import "./styles.css";
const Form = () => {
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
      setPostData({ ...postData, selectedFile: reader.result }); // Store the base64 result
    };

    if (file) {
      reader.readAsDataURL(file); // Convert to base64
    }
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [] // Only accept image files
    }
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("profile"));
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postData.title || !postData.content || !postData.tags) {
      setErrorMsg("Title, content, and image are required.");
      setOpenSnackbar(true);
      return;
    }
    try {
      dispatch(createPost({ ...postData, name: user?.result?.name }));
    } catch (error) {
      console.error(error);
    }
    clear(); // Clear the form after submission
  };
  const clear = () => {
    setPostData({
      content: "",
      title: "",
      tags: [],
      selectedFile: "",
    });
  };

  if (!user?.result?.name) {
    return (
      <div className="community-container">
        <h2 className="text-4xl tracking-[0.4rem] text-shadow-lg/30">
          Please Sign In to share your ideas
        </h2>
      </div>
    );
  }
  return (
    <div className="community-container  grid grid-cols-1 grid-rows-[10rem,30rem] gap-5 text-center ">
      <h2 className="text-4xl tracking-[0.4rem] text-shadow-lg/30 ">
        Got a idea, Share it with world
      </h2>
      <form
        className="Form-container grid grid-cols-2 grid-rows-[1rem,3rem,1rem,0.5rem] gap-5"
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
          className="col-start-1 row-start-1"
          slotProps={{
            inputLabel:{
                        sx: {
                          color: "#2e2e2e",
                          fontFamily: "Montserrat",
                          backgroundColor: "transparent",
                          px: "4px", // prevent label flicker over corners
                          "&.Mui-focused": {
                            color: "#000",
                            backgroundColor: "transparent",
                          },
                        },
                      }
          }}
          
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              backgroundColor: "#faf7f3",
              fontFamily: "Montserrat",
              transition: "all 0.3s ease",
              "& input": {
                padding: "12px",
                backgroundColor: "#faf7f3", // patch for corner flicker
                borderRadius: "10px",
              },
              "& fieldset": {
                borderColor: "#ccc",
              },
              "&:hover fieldset": {
                borderColor: "#999",
              },
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
          className="col-start-1 row-start-2"
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
              transition: "all 0.3s ease",
              "& textarea": {
                padding: "12px",
                backgroundColor: "#faf7f3",
                borderRadius: "10px",
              },
              "& fieldset": {
                borderColor: "#ccc",
              },
              "&:hover fieldset": {
                borderColor: "#999",
              },
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
          value={postData.tags.join(",")}  // Join the array to display as comma-separated string
          onChange={(e) =>
            setPostData({ ...postData, tags: e.target.value.split(",") })
          }
          className="col-start-1 row-start-3"
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
              transition: "all 0.3s ease",
              "& input": {
                padding: "12px",
                backgroundColor: "#faf7f3",
                borderRadius: "10px",
              },
              "& fieldset": {
                borderColor: "#ccc",
              },
              "&:hover fieldset": {
                borderColor: "#999",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#000",
                boxShadow: "0 0 0 2px rgba(0,0,0,0.15)",
              },
            },
          }}
        />

        {/* File Upload using Dropzone */}
        <div
          {...getRootProps()}
          className="row-span-3"
          style={{
            border: "2px dashed #fff",
            padding: "2rem",
            margin: "2rem",
            borderRadius: "20px",
          }}
        >
          <input {...getInputProps()} />
          <p className="upload-instruction">
            Drag & drop an image, or click to select one
          </p>
        </div>

        {/* Show image preview if a file is selected */}
        {postData.selectedFile && (
          <img
            src={postData.selectedFile}
            alt="Selected file preview"
            style={{ marginTop: "20px", width: "100px" }}
          />
        )}

        <button
          type="submit"
          className="font-semibold rounded-lg shadow-md/40 btns"
          onClick={handleSubmit}
        >
          Submit
        </button>
        <button
          onClick={clear}
          className="font-semibold rounded-lg shadow-md/40 btns"
        >
          Clear
        </button>
      </form>
    </div>
  );
};

export default Form;
