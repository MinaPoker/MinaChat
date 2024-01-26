"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { allUserRoute, host } from "@/utils/APIRoutes";
import { useRouter } from "next/navigation";
import Contacts from "@/components/Contacts";
import Welcome from "@/components/Welcome";
import ChatContainer from "@/components/ChatContainer";
import { io } from "socket.io-client";

const Chats = () => {
  const socket = useRef();
  const router = useRouter();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const checkLocalStorageAndSetUser = async () => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      router.push("/login");
    } else {
      setCurrentUser(
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )
      );
    }
  };

  useEffect(() => {
    checkLocalStorageAndSetUser();
  }, []);

  const connectSocketIfUserExists = () => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  };

  useEffect(() => {
    connectSocketIfUserExists();
  }, [currentUser]);

  const fetchContactsIfAvatarSet = async () => {
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        const data = await axios.get(`${allUserRoute}/${currentUser._id}`);
        setContacts(data.data);
      } else {
        router.push("/");
      }
    }
  };

  useEffect(() => {
    fetchContactsIfAvatarSet();
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center gap-4 items-center bg-[#131324]">
      <div className="h-[85vh] w-[85vw] bg-[#00000076] grid grid-cols-1 md:grid-cols-4 ">
        <div className="md:col-span-1 bg-[#0000076]">
          <Contacts contacts={contacts} changeChat={handleChatChange} />
        </div>

        <div className="md:col-span-3 bg-gray-500">
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Chats;
