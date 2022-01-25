import "./share.css";
import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel,
} from "@mui/icons-material";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const Share = () => {
  const { user } = useContext(AuthContext);
  const desc = useRef();
  const [file, setFile] = useState(null);
  const PublicFolder = process.env.REACT_APP_PUBLIC_FOLDER;

  const submitHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };

    if (file) {
      console.log("file", file);
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      newPost.img = fileName;
      try {
        console.log("data", data);
        await axios.post("/upload", data);
      } catch (error) {
        console.log(error);
      }
    }
    try {
      await axios.post("/posts", newPost);
    } catch (error) {}
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImage"
            src={
              user.profilePicture
                ? PublicFolder + user.profilePicture
                : PublicFolder + "/person/noAvatar.png"
            }
            alt=""
          />
          <input
            placeholder={`What's on your mind ${user.username}?`}
            className="shareInput"
            ref={desc}
          />
        </div>

        <hr className="shareHr" />
        {file && (
          <div className="shareImageContainer">
            <img
              className="shareImage"
              src={URL.createObjectURL(file)}
              alt=""
            />
            <Cancel className="shareCancelling" onClick={() => setFile(null)} />
          </div>
        )}

        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".jpeg, .jpg, .png"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <button className="shareButton" type="submit ">
            Share
          </button>
        </form>
      </div>
    </div>
  );
};

export default Share;
