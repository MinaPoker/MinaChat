import React, { useEffect, useState } from "react";
import Robot from "@/images/robot.gif";
import Image from "next/image";

const Welcome = ({ currentUsers }) => {
const [userName, setUserName] = useState("");
 const setUserNameFromLocalStorage = async () => {
   const userData = await JSON.parse(
     localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
   );
   setUserName(userData.username);
 };

 useEffect(() => {
   setUserNameFromLocalStorage();
 }, []);

return (
    <div className="flex items-center justify-center flex-col text-white">
      <Image src={Robot} alt="Robot" className=" h-[50%]" />
      <h1 className="text-2xl font-bold">
        Welcome, <span className="text-[#4e00ff] text-3xl">{userName}!</span>
      </h1>

      <h3>Please select a chat to start messaging</h3>
    </div>
  );
};

export default Welcome;
