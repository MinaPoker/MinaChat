import React from 'react'
import {BiPowerOff} from "react-icons/bi"
import axios from "axios";
import { useRouter } from 'next/navigation'
import { logoutRoute } from '@/utils/APIRoutes';


const Logout = () => {
 const router = useRouter();
    const handleClick = async () => {
      const id = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      )._id;
      const data = await axios.get(`${logoutRoute}/${id}`);
      if (data.status === 200) {
        localStorage.clear();
        router.push("/login");
      }
    };

  return (
    <>
      <button 
      className='flex items-center justify-center p-2 rounded-xl bg-[#9a86f3] border-none cursor-pointer'
      onClick={handleClick}
      >
        <BiPowerOff  className='text-xl'/>
      </button>
    </>
  )
}

export default Logout
