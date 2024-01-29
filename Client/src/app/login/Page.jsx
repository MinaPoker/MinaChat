"use client";
//Import necessary modules and components
import Link from "next/link";
import { React, useState, useNavigate, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "@/images/logo.svg"; // Adjust the path to your logo SVG
import Image from "next/image";
import axios from "axios";
import { loginRoutes } from "@/utils/APIRoutes";
import { useRouter } from "next/navigation";

// Move toast options outside the component function

// Functional component
const Login = () => {
  const router = useRouter();

  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    pauseOnHover: true,
    theme: "dark",
    draggable: true,
  };
  const checkLocalStorageAndRedirect = () => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      router.push("/");
    }
  };

  useEffect(() => {
    checkLocalStorageAndRedirect();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // Validate form inputs
  const validateForm = () => {
    const { username, password } = values;
    if (username === "") {
      toast.error("Username is required.", toastOptions);
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      let currentUser = await window.mina?.getAccounts();
      if (currentUser.length == 0) {
        await window.mina.requestAccounts().catch((err) => err);
        currentUser = await window.mina?.getAccounts();
      }

      const content = `Click "Sign" to sign in. No password needed!

     This request will not trigger a blockchain transaction or cost any gas fees.

    I accept the Auro Test zkApp Terms of Service: ${window.location.href}

     address: ${currentUser[0]}
     iat: ${new Date().getTime()}`;

      const signContent = {
        message: content,
      };

      const signResult = await window.mina
        ?.signMessage(signContent)
        .catch((err) => err);

      console.log(signResult);

      // let verifyResult = await window.mina
      //   ?.verifyMessage(signResult)
      //   .catch((err) => err);

      // console.log(verifyResult);

      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
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

        navigate("/");
      }
    }
  };


  // JSX structure for the component
  return (
    <div className="h-screen  flex flex-col bg-[#131324] items-center justify-center w-auto">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col gap-8 rounded-3xl bg-[#00000076] px-12 py-20"
      >
        {/* Logo */}
        <div className="flex items-center justify-center w-auto">
          <Image src={Logo} alt="logo" className="h-10" />
        </div>

        {/* Input fields */}
        <input
          type="text"
          placeholder="Username"
          name="username"
          onChange={(e) => handleChange(e)}
          min="3"
          className="bg-transparent p-4 rounded-lg border-solid border-2 border-[#4e0eff] text-white text-lg focus:border-2 focus:border-none"
        />

        {/* Submit button */}
        <button
          type="submit"
          className="bg-[#997af0] text-white px-3 py-6 border-none font-bold cursor-pointer rounded-lg uppercase transition ease-in-out hover:bg-[#4e0eff]"
        >
          Login
        </button>
        <span className="text-white uppercase">
          Don't have an account?{" "}
          <Link href="/register" className="text-[#4e0eff]">
            Register
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
