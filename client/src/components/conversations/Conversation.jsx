import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import "./conversation.css";

const Conversation = ({ conversation, currentUser }) => {
  const [user, setUser] = useState(null);

  const PublicFolder = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const friendId = conversation.members.find(
      (member) => member !== currentUser._id
    );
    const getUser = async () => {
      try {
        const res = await axios.get(`/users/?userId=${friendId}`);
        console.log(res.data);
        setUser(res.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  return (
    <>
      <div className="conversation">
        <img
          src={
            user?.profilePicture
              ? PublicFolder + user?.profilePicture
              : PublicFolder + "/person/noAvatar.png"
          }
          alt=""
          className="conversationImage"
        />
        <span className="conversationName">{user?.username}</span>
      </div>
    </>
  );
};

export default Conversation;
