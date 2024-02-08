import React, { useState } from "react";
import Picker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";

const ChatInput = ({ handleSendMsg }) => {
    const [msg, setMsg] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const handleEmojiPickerhideShow = () => {
      setShowEmojiPicker(!showEmojiPicker);
    };

    const handleEmojiClick = (event, emojiObject) => {
      let message = msg;
      message += emojiObject.emoji;
      setMsg(message);
    };

    const sendChat = (e) => {
      e.preventDefault();
      if (msg.length > 0) {
        handleSendMsg(msg);
        setMsg("");
      }
    };

  return (
    <div className="grid grid-col-[10%,90%] items-center py-1 pb-2">
      <div className="flex items-center text-white gap-4">
        <div className=" relative">
          <BsEmojiSmileFill
            className="text-lg cursor-pointer text-[#ffff00c8]"
            onClick={handleEmojiPickerhideShow}
          />
          {showEmojiPicker && (
            <Picker
              className="absolute bg-[#080420] border-[#9a86f3] shadow-md"
              onEmojiClick={handleEmojiClick}

            />
          )}
        </div>
      </div>
      <form
        className="w-full rounded-full flex items-center gap-8 bg-[#ffffff34]"
        onSubmit={(e) => sendChat(e)}
      >
        <input
          type="text"
          placeholder="Type your message here"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          className=" w-[90%] bg-transparent text-white border-none pl-4 text-lg selection:bg-[#9186f3] focus:outline-none"
        />
        <button className="p-[0.2rem] px-[2rem] rounded-full flex items-center justify-center bg-[#9186f3] border-none">
          <IoMdSend className="text-2xl text-white" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
