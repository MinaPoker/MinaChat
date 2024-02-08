import React, { useEffect, useRef, useState } from "react";
import Logout from "./Logout";
import ChatInput from "./ChatInput";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
import {v4 as uuidv4} from "uuid"

const ChatContainer = ({ currentChat, curentUser, socket }) => {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const fetchMessagesForCurrentChat = async () => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    const response = await axios.post(recieveMessageRoute, {
      from: data._id,
      to: currentChat._id,
    });
    setMessages(response.data);
  };

  useEffect(() => {
    fetchMessagesForCurrentChat();
  }, [currentChat]);



  const retrieveCurrentUserId = async () => {
    if (currentChat) {
      const userId = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      )._id;

    }
  };

  useEffect(() => {
    retrieveCurrentUserId();
  }, [currentChat]);


  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
    });
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

   const setupSocketEventListeners = () => {
     if (socket.current) {
       socket.current.on("msg-recieve", (msg) => {
         setArrivalMessage({ fromSelf: false, message: msg });
       });
     }
   };

   const updateMessagesOnArrival = () => {
     arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
   };

   const scrollIntoViewOnMessagesChange = () => {
     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
   };

   useEffect(() => {
     setupSocketEventListeners();
   }, []);

   useEffect(() => {
     updateMessagesOnArrival();
   }, [arrivalMessage]);

   useEffect(() => {
     scrollIntoViewOnMessagesChange();
   }, [messages]);

  return (
    <>
      {currentChat && (
        <div className=" pt-4 grid grid-rows-[10%, 78%, 12%] gap-1 overflow-hidden">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center gap-4">
              <div>
                <img
                  src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                  alt="avatar"
                  className="h-12"
                />
              </div>

              <div>
                <h3 className="text-white text-xl">{currentChat.username}</h3>
              </div>
            </div>
            <Logout />
          </div>
          <div className="p-[1rem] px-[2rem] flex flex-col gap-4 overflow-auto">
            {messages.map((message) => {
              return (
                <div ref={scrollRef} key={uuidv4()}>
                  <div
                    className={`flex items-center ${
                      message.fromSelf ? " justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`content ${
                        message.fromSelf
                          ? "bg-purple-500 bg-opacity-25"
                          : "bg-indigo-500 bg-opacity-25"
                      }`}
                    >
                      <div className=" w-max-[40%] break-words p-4 text-2xl rounded-2xl text-[#d1d1d1]">
                        <p>{message.message}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="chat-input">
            <ChatInput handleSendMsg={handleSendMsg} />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatContainer;
