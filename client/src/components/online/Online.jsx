import React from "react";
import "./online.css";

const Online = ({ user }) => {
  const PublicFolder = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <li className="rightbarFriend">
      <div className="rightbarProfileImageContainer">
        <img
          src={PublicFolder + user.profilePicture}
          alt=""
          className="rightbarProfileImage"
        />
        <span className="rightbarOnline" />
      </div>

      <span className="rightbarUsername">{user.username}</span>
    </li>
  );
};

export default Online;
