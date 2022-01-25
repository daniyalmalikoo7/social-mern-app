import axios from "axios";
import { useEffect, useState } from "react";
import "./chatOnline.css";

const ChatOnline = ({ onlineUsers, setCurrentChat, currentId }) => {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  const PublicFolder = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get(`/users/friends/${currentId}`);
      setFriends(res.data);
    };
    getFriends();
  }, [currentId]);

  useEffect(() => {
    setOnlineFriends(
      friends?.filter((friend) => onlineUsers.includes(friend._id))
    );
  }, [friends, onlineUsers]);

  const handleClick = async (onlineFriend) => {
    try {
      const conversation = await axios.get(
        `/conversations/find/${currentId}/${onlineFriend._id}`
      );
      setCurrentChat(conversation.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="chatOnline">
      {onlineFriends?.map((onlineFriend) => (
        <div
          key={onlineFriend?._id}
          className="chatOnlineFriend"
          onClick={() => handleClick(onlineFriend)}
        >
          <div className="chatOnlineImageContainer">
            <img
              className="chatOnlineImage"
              src={
                onlineFriend.profilePicture
                  ? PublicFolder + onlineFriend.profilePicture
                  : PublicFolder + "person/noAvatar.png"
              }
              alt=""
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{onlineFriend.username}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatOnline;
