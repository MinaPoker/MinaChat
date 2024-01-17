"use client";
import Link from "next/link";
import { React, useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "@/images/logo.svg"; // Adjust the path to your logo SVG
import Image from "next/image";
import axios from "axios";
import { registerRoute } from "@/utils/APIRoutes";
import { useRouter } from "next/navigation";

// Move toast options outside the component function
const toastOptions = {
  position: "bottom-right",
  autoClose: 2000,
  pauseOnHover: true,
  theme: "dark",
  draggable: true,
};

// Functional component
const Register = () => {
  const router = useRouter();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const checkLocalStorage = () => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      router.push("/");
    }
  };

  useEffect(() => {
    checkLocalStorage();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );
        router.push("/setAvatar");
      }
    }
  };

  return (
    <div className="h-screen  flex flex-col bg-[#131324] items-center justify-center w-auto">
      <form
        className="flex flex-col gap-8 rounded-3xl bg-[#00000076] px-12 py-20"
        onSubmit={(event) => handleSubmit(event)}
      >
        <div className="flex items-center justify-center w-auto">
          <Image src={Logo} alt="logo" className="h-10" />
        </div>

        <input
          type="text"
          placeholder="Username"
          name="username"
          onChange={(e) => handleChange(e)}
          className="bg-transparent p-4 rounded-lg border-solid border-2 border-[#4e0eff] text-white text-lg focus:border-2 focus:border-none"
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          onChange={(e) => handleChange(e)}
          className="bg-transparent p-4 rounded-lg border-solid border-2 border-[#4e0eff] text-white text-lg focus:border-2 focus:border-none"
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleChange}
          className="bg-transparent p-4 rounded-lg border-solid border-2 border-[#4e0eff] text-white text-lg focus:border-2 focus:border-none"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          onChange={(e) => handleChange(e)}
          className="bg-transparent p-4 rounded-lg border-solid border-2 border-[#4e0eff] text-white text-lg focus:border-2 focus:border-none"
        />

        <button
          type="submit"
          className="bg-[#997af0] text-white px-3 py-6 border-none font-bold cursor-pointer rounded-lg uppercase transition ease-in-out hover:bg-[#4e0eff]"
        >
          Create User
        </button>

        <span className="text-white uppercase">
          Already have an account?{" "}
          <Link href="/login" className="text-[#4e0eff]">
            Login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Register;
