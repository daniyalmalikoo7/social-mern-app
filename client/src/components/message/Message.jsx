import "./message.css";
import {format} from "timeago.js"

const Message = ({ own, message }) => {
  return (
    <div className={own ? "message" : "message own"}>
      <div className="messageTop">
        <img className="messageImage" src="/assets/person/3.jpeg" alt="" />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message?.createdAt)}</div>
    </div>
  );
};

export default Message;
