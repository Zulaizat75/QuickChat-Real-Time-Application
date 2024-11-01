import React, { useContext, useEffect, useState } from "react";
import "./RightSidebar.css";
import assets from "../../assets/assets";
import { logout } from "../../config/firebase";
import { AppContext } from "../../context/AppContext";

const RightSidebar = () => {
  const {
    chatUser,
    messages,
    rightSidebarVisible,
    setRightSidebarVisible
  } = useContext(AppContext);
  const [msgImages, setMsgImages] = useState([]);

  console.log(rightSidebarVisible);

  useEffect(() => {
    let tempVar = [];
    messages.forEach((msg) => {
      if (msg.image) {
        tempVar.push(msg.image);
      }
    });
    setMsgImages(tempVar);
  }, [messages]);

  return chatUser ? (
    <div className={`right-sidebar ${rightSidebarVisible ? '':'hide'}`}>
    <div className={`rs ${rightSidebarVisible ? '':'hide-child'}`}>
      <div className="rs-profile">
        <img src={chatUser.userData.avatar} alt="" />
        <h3>
          {Date.now() - chatUser.userData.lastSeen <= 70000 ? (
            <img src={assets.green_dot} className="dot" alt="" />
          ) : null}{" "}
          {chatUser.userData.name}
        </h3>
        <p>{chatUser.userData.bio}</p>
      </div>
      <hr />
      <div className="rs-media">
        <p>Media</p>
        <div>
          {msgImages.map((url, index) => (
            <img onClick={() => window.open(url)} key={index} src={url} alt="" />
          ))}
        </div>
      </div>
      <button onClick={() => logout()}>Logout</button>
    </div>
    </div>
  ) : (
    <div className="rs rs-hidden">
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

export default RightSidebar;
