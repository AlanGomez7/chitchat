import React, { useContext } from "react";
import ScrollableFeed from "react-scrollable-feed";
import ChatContext from "../../Context/chatContext";
import TypingAnimation from "./typingAnimation";

function scrollablePanel({ messages }) {
  const { user, isTyping } = useContext(ChatContext);

  const senderMargin = (msg, m, i, user) => {
    if (
      i < msg.length - 1 &&
      msg[i + 1].sender._id === m.sender._id &&
      msg[i].sender._id !== user
    )
      return 0;
    else if (
      (i < msg.length - 1 &&
        msg[i + 1].sender._id !== m.sender._id &&
        msg[i].sender._id !== user) ||
      (i === msg.length - 1 && msg[i].sender._id !== user)
    )
      return 0;
    else return "auto";
  };

  const sendermarginTop = (msg, m, i) => {
    return i > 0 && msg[i - 1].sender._id === m.sender._id;
  };
  return (
    <ScrollableFeed>
      {messages?.map((m, i) => (
        <div style={{ display: "flex" }} key={m._id}>
          <span
            style={{
              borderRadius: "6px",
              padding: "5px 15px",
              maxWidth: "75%",
              backgroundColor: `${
                m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
              }`,
              marginLeft: senderMargin(messages, m, i, user._id),
              marginTop: sendermarginTop(messages, m, i) ? 3 : 10,
            }}
          >
            {m.content}
          </span>
        </div>
      ))}
    </ScrollableFeed>
  );
}

export default scrollablePanel;
