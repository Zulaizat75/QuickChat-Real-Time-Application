import React, { useContext, useEffect, useState } from "react";
import "./ProfileUpdate.css";
import assets from "../../assets/assets";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import upload from "../../lib/upload";
import { AppContext } from "../../context/AppContext";

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const { setUserData } = useContext(AppContext);

  const [image, setImage] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const [prevImage, setPrevImage] = useState("");

  const handleProfileUpdate = async (event) => {
    event.preventDefault();
    if (!name) {
      toast.error("Name is required");
      return;
    }
    try {
      const docRef = doc(db, "users", uid);

      if (image) {
        const imgUrl = await upload(image);
        setPrevImage(imgUrl);
        await updateDoc(docRef, {
          avatar: imgUrl,
          bio,
          name,
        });
      } else {
        await updateDoc(docRef, { bio, name });
      }

      const snap = await getDoc(docRef);
      setUserData(snap.data());
      navigate("/chat");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();

        if (data) {
          setName(data.name || "");
          setBio(data.bio || "");
          setPrevImage(data.avatar || "");
        }
      } else {
        navigate("/");
      }
    });
  }, [navigate]);

  return (
    <div className="profile">
      <div className="profile-container">
        <img
          className="profile-pic-small"
          src={
            image ? URL.createObjectURL(image) : prevImage || assets.logo_icon
          }
          alt="Profile pic"
        />
        <form onSubmit={handleProfileUpdate}>
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={image ? URL.createObjectURL(image) : assets.avatar_icon}
              alt="Upload profile"
            />
            upload profile image
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Your name"
            required
          />
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="Write profile bio"
          ></textarea>
          <button type="submit">Save</button>
        </form>
        <img
          className="profile-pic"
          src={
            image ? URL.createObjectURL(image) : prevImage || assets.logo_icon
          }
          alt="Profile pic"
        />
      </div>
    </div>
  );
};

export default ProfileUpdate;
