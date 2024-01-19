"use client";
import React, { useEffect, useState } from "react";
import loader from "../../images/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { setAvatarRoute } from "@/utils/APIRoutes";
import { Buffer } from "buffer";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SetAvatar = () => {
  const api = "https://api.multiavatar.com/45678948";
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const router = useRouter();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    pauseOnHover: true,
    theme: "dark",
    draggable: true,
  };

  const checkLocalStorageAndRedirect = async () => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      router.push("/login");
    }
  };

  useEffect(() => {
    const checkLocalStorage = async () => {
      await checkLocalStorageAndRedirect();
    };

    checkLocalStorage();
  }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const user = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );

      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(user)
        );
        navigate("/");
      } else {
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
    }
  };

  const fetchAvatars = async () => {
    const data = [];
    for (let i = 0; i < 4; i++) {
      const image = await axios.get(
        `${api}/${Math.round(Math.random() * 1000)}`
      );
      const buffer = Buffer.from(image.data);
      data.push(buffer.toString("base64"));
    }
    return data;
  };

  useEffect(() => {
    const fetchData = async () => {
      const avatarsData = await fetchAvatars();
      setAvatars(avatarsData);
      setIsLoading(false);
    };

    fetchData();
  }, []);
  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <Image src={loader} alt="loader" />
        </div>
      ) : (
        <div className="flex justify-center items-center flex-col gap-12 bg-[#131324] h-screen w-screen">
          <div>
            <h1 className="text-white text-3xl">Pick up your avatar</h1>
          </div>

          <div className="flex gap-8">
            {avatars.map((avatar, index) => {
              return (
                <div
                  key={index}
                  className={`avatar ${
                    selectedAvatar === index
                      ? "selected border-solid border-4 border-purple-600  rounded-full"
                      : " "
                  } `}
                >
                  <img
                    className="h-24"
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    key={avatar}
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <button
            className="bg-[#997af0] text-white px-16 py-8 border-none font-bold rounded-lg  uppercase hover:bg-[#4e0eff]"
            onClick={setProfilePicture}
          >
            Set as Profile Picture
          </button>
        </div>
      )}
    </>
  );
};

export default SetAvatar;
