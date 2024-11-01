import React, { useContext, useEffect, useState } from "react";
import "./Chatbox.css";
import assets from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import upload from "../../lib/upload";
import { toast } from "react-toastify";

const Chatbox = () => {
  const {
    userData,
    messagesId,
    chatUser,
    messages,
    setMessages,
    chatVisible,
    setChatVisible,
    rightSidebarVisible,
    setRightSidebarVisible,
  } = useContext(AppContext);

  const [input, setInput] = useState("");

  const formatDate = (timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const sendMessage = async () => {
    try {
      if (input && messagesId) {
        await updateDoc(doc(db, "messages", messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            text: input,
            createdAt: new Date(),
          }),
        });

        const userIDs = [chatUser.rId, userData.id];

        userIDs.forEach(async (id) => {
          const userChatsRef = doc(db, "chats", id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            const chatIndex = userChatData.chatsData.findIndex(
              (c) => c.messageId === messagesId
            );
            userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30);
            userChatData.chatsData[chatIndex].updatedAt = Date.now();
            if (userChatData.chatsData[chatIndex].rId === userData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false;
            }
            await updateDoc(userChatsRef, {
              chatsData: userChatData.chatsData,
            });
          }
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.message);
    }
    setInput("");
  };

  useEffect(() => {
    if (messagesId) {
      const unSub = onSnapshot(doc(db, "messages", messagesId), (res) => {
        setMessages(res.data().messages.reverse());
        console.log(res.data().messages.reverse());
      });
      return () => {
        unSub();
      };
    }
  }, [messagesId]);

  const renderMessages = () => {
    let lastDisplayedDate = null;
    let earliestMessageOfDay = null; // Track the earliest message of the current day

    return messages.map((msg, index) => {
      const messageDate = msg.createdAt.toDate();
      const displayDate = formatDate(msg.createdAt);
      const isToday = messageDate.toDateString() === new Date().toDateString();

      // If it's a new day, reset earliest message tracking
      if (lastDisplayedDate !== messageDate.toDateString()) {
        lastDisplayedDate = messageDate.toDateString();
        earliestMessageOfDay = index; // Set the index of the current message as the earliest
      }

      // Determine if this is the earliest message of the day
      const showDate = earliestMessageOfDay === index;

      // Update earliest message if the current message is earlier
      if (showDate) {
        earliestMessageOfDay = null; // Reset to prevent showing again in the loop
      }

      return (
        <div key={index}>
          {showDate && (
            <div className="chat-date">{isToday ? "Today" : displayDate}</div>
          )}
          <div className={msg.sId === userData.id ? "s-msg" : "r-msg"}>
            {msg.image ? (
              <img className="msg-img" src={msg.image} alt="" />
            ) : (
              <p className="msg">{msg.text}</p>
            )}
            <div>
              <img
                src={
                  msg.sId === userData.id
                    ? userData.avatar
                    : chatUser.userData.avatar
                }
                alt=""
              />
              <p>{convertTimestamp(msg.createdAt)}</p>
            </div>
          </div>
        </div>
      );
    });
  };

  const sendImage = async (e) => {
    try {
      const fileUrl = await upload(e.target.files[0]);

      if (fileUrl && messagesId) {
        await updateDoc(doc(db, "messages", messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            image: fileUrl,
            createdAt: new Date(),
          }),
        });

        const userIDs = [chatUser.rId, userData.id];

        userIDs.forEach(async (id) => {
          const userChatsRef = doc(db, "chats", id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            const chatIndex = userChatData.chatsData.findIndex(
              (c) => c.messageId === messagesId
            );
            userChatData.chatsData[chatIndex].lastMessage = "Image";
            userChatData.chatsData[chatIndex].updatedAt = Date.now();
            if (userChatData.chatsData[chatIndex].rId === userData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false;
            }
            await updateDoc(userChatsRef, {
              chatsData: userChatData.chatsData,
            });
          }
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const convertTimestamp = (timestamp) => {
    let date = timestamp.toDate();
    const hour = date.getHours();
    const minute = date.getMinutes().toString().padStart(2, "0");
    if (hour > 12) {
      return hour - 12 + ":" + minute + " PM";
    } else {
      return hour + ":" + minute + " AM";
    }
  };

  // Send message when Enter key is pressed
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Check if Enter is pressed without Shift
      e.preventDefault();
      sendMessage();
    }
  };

  return chatUser ? (
    <div className={`chat-box ${chatVisible ? "" : "hidden"}`}>
      <div className="chat-user">
        <img src={chatUser.userData.avatar} alt="" />
        <p>
          {chatUser.userData.name}{" "}
          {Date.now() - chatUser.userData.lastSeen <= 70000 ? (
            <img className="dot" src={assets.green_dot} alt="" />
          ) : null}
        </p>
        <img
          onClick={() => setChatVisible(false)}
          src={assets.arrow_icon}
          alt=""
          className="arrow"
        />
        <img
          src={assets.more_icon}
          className={`more ${rightSidebarVisible ? "rotated" : ""}`}
          alt=""
          onClick={() => setRightSidebarVisible(!rightSidebarVisible)}
        />
      </div>

      <div className="chat-msg">{renderMessages()}</div>

      <div className="chat-input">
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          placeholder="Send a message"
          onKeyDown={handleKeyDown}
        />
        <input
          onChange={sendImage}
          type="file"
          id="image"
          accept="image/png, image/jpeg"
          hidden
        />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img onClick={sendMessage} src={assets.send_button} alt="" />
      </div>
    </div>
  ) : (
    <div className={`chat-welcome ${chatVisible ? "" : "hidden"}`}>
      <img src={assets.logo_icon} alt="" />
      <p>Quick chat anytime, anywhere</p>
    </div>
  );
};

export default Chatbox;
