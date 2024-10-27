import React, { useContext, useEffect, useState } from "react";
import "./Chat.css";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import Chatbox from "../../components/ChatBox/Chatbox";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import { AppContext } from "../../context/AppContext";

const Chat = () => {
  const { chatData, userData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [rightSidebarVisible, setRightSidebarVisible] = useState(true);

  useEffect(() => {
    if (chatData && userData) {
      setLoading(false);
    }
  }, [chatData, userData]);

  const toggleSidebar = () => {
    setRightSidebarVisible(!rightSidebarVisible);

};

  return (
    <div className={`chat ${rightSidebarVisible ? '' : 'sidebar-hidden'}`}>
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className={`chat-container ${rightSidebarVisible ? '' : 'expand-chatbox'}`}>
          <LeftSidebar />
          <Chatbox toggleSidebar={toggleSidebar} rightSidebarVisible={rightSidebarVisible} />
          {rightSidebarVisible && <RightSidebar />}
        </div>
      )}
    </div>
  );
};

export default Chat;
