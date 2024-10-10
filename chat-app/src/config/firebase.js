
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyDRDweO0YNAE1fHDm-cM9dX7cMSWejMOno",
  authDomain: "rte-chatapp.firebaseapp.com",
  projectId: "rte-chatapp",
  storageBucket: "rte-chatapp.appspot.com",
  messagingSenderId: "388399039335",
  appId: "1:388399039335:web:3d06788e66f05ffc50e5c2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username,email,password) => {
    try{
        const res = await createUserWithEmailAndPassword(auth,email,password);
        const user = res.user;
        await setDoc(doc(db,"users",user.uid),{
            id:user.uid,
            username:username.toLowerCase(),
            email,
            name:"",
            avatar:"",
            bio:"Hey There, I am using ChatApp!",
            lastSeen:Date.now()
        })
        await setDoc(doc(db,"chats",user.uid),{
            chatData:[]
        })
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const login = async (email,password) => {
    try {
        await signInWithEmailAndPassword(auth,email,password);
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const logout = async () => {
    try {
        await signOut(auth) 
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

export {signup,login,logout,auth,db}