import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const ChatContext = createContext({});
export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [selectedChat, setSelectedChat] = useState("");
  const [chat, setChat] = useState([]);
  const [isTyping, setIsTyping] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    if (!userInfo) {
      navigate("/");
    }
  }, []);
  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chat,
        setChat,
        isTyping,
        setIsTyping,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
