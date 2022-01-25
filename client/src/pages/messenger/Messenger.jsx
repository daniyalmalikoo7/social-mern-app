import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const Messenger = () => {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  const scrollRef = useRef();

  const { user } = useContext(AuthContext);

  // useEffect(() => {
  //   //configure socket on client side
  //   setSocket(io("ws://localhost:8900"));
  // }, []);

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current?.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data?.senderId,
        text: data?.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current?.emit("addUser", user?._id);
    socket.current?.on("getUsers", (users) => {
      setOnlineUsers(
        user.followings.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(`/conversations/${user._id}`);
        setConversations(res.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    getConversations();
  }, [user]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(`/messages/${currentChat?._id}`);
        setMessages(res.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    getMessages();
  }, [currentChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      conversationId: currentChat._id,
      text: newMessage,
    };

    const recieverId = currentChat.members.find(
      (member) => member !== user._id
    );

    //send message to socket server
    socket.current?.emit("sendMessage", {
      senderId: user._id,
      recieverId,
      text: newMessage,
    });

    try {
      const res = await axios.post("/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input
              type="text"
              placeholder="Search for friends..."
              className="searchChat"
            />
            {conversations.map((conv) => (
              <div key={conv._id} onClick={() => setCurrentChat(conv)}>
                <Conversation
                  key={conv._id}
                  conversation={conv}
                  currentUser={user}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages ? (
                    messages?.map((msg) => {
                      return (
                        <div ref={scrollRef}>
                          <Message
                            message={msg}
                            own={msg.sender === user?._id}
                          />
                        </div>
                      );
                    })
                  ) : (
                    <span className="noConversationText">
                      Start a coversation...
                    </span>
                  )}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    placeholder="write something..."
                    className="chatMessageInput"
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Please open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <div className="chatOnline">
              <ChatOnline
                onlineUsers={onlineUsers}
                currentId={user?._id}
                setCurrentChat={setCurrentChat}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Messenger;
