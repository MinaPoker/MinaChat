"use client";
import React, { useEffect, useState } from "react";
import logo from "@/images/logo.svg";

const Contacts = ({ contacts, currentUsers, changeChat }) => {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const setCurrentUserData = async () => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    setCurrentUserName(data.username);
    setCurrentUserImage(data.avatarImage);
  };

  useEffect(() => {
    setCurrentUserData();
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  return (
    <div>
      {currentUserImage && currentUserName && (
        <div className="grid grid-rows-[10%, 75%, 15%] gap-4 overflow-hidden bg-[#080420]">
          <div className="flex items-center gap-4 justify-center">
            <img src={logo} alt="logo" className="h-8" />
            <h3 className="text-white upercase">MinaPoker</h3>
          </div>
          <div
            className=" flex flex-col items-center overflow-auto gap-3 scrollbar-thin scrollbar-thumb-gray-500 
                              scrollbar-track-gray-300"
          >
            {contacts.map((contact, index) => {
              return (
                <div
                  className={`bg-[#ffffff34] min-h-20 cursor-pointer w-[90%] rounded-md p-2 flex gap-4 items-center 
                            transition-all duration-500 ease-in-out${
                              index === currentSelected
                                ? "Selected bg-#9a86f3"
                                : " "
                            }`}
                  key={contact._id}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div>
                    <img
                      src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                      alt="avatar"
                      className="h-12"
                    />
                  </div>
                  <div>
                    <h3 className="text-white">{contact.username}</h3>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-[#0d0d30] flex justify-center items-center gap-8">
            <div>
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
                className="h-16 max-w-full"
              />
            </div>
            <div>
              <h2 className="text-lg text-white">{currentUserName}</h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
