"use client"

import { usePathname, useRouter } from "next/navigation";
import { useToken } from "../TokenContext"
import { jwtDecode } from 'jwt-decode';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Person2Icon from '@mui/icons-material/Person2';
import LogoutIcon from '@mui/icons-material/Logout';

import { Menu, MenuItem } from "@mui/material";

import { useEffect, useState } from "react";

export default function Navbar() {

  const [menuOpened, setMenuOpened] = useState(false);

  const { token, logout } = useToken();
  const router = useRouter()
  const pathname = usePathname();

  let decodedData = {}

  if (token) decodedData = jwtDecode(token);

  const openMenuHandler = () => {
    setMenuOpened(!menuOpened);
  }

  const closeMenuHandler = () => {
    setMenuOpened(false);
  }

  const handleClose = () => {};

  const menuItemStyle = 'flex items-center p-2 hover:bg-gray-800 hover:text-white cursor-pointer'
  const menuIconStyle = {
    marginX: '5px'
  }

  useEffect(() => {
    setMenuOpened(false)
  }, [pathname])

  const menuStyle = {
    width: '50%',
    position: 'absolute',
    right: 0,
    backgroundColor: '#ddd',
    fontColor: 'white',
    border: 'none',
    overflow: 'hidden',
    maxHeight: '200px',
  }

  return (
    <>
      <div className={`p-2 h-14 px-4 bg-gray-800 text-white flex ${token ? 'justify-between' : 'justify-end'} items-center`}>
        {token ? (
          <>
            <div className="flex">
              <div onClick={() => router.push('/')} className="cursor-pointer">Home</div>
              <div className="mx-2 cursor-pointer" onClick={() => router.push('/users')}>Users</div>
            </div>
            <>
              <div className="flex">
                <div className="flex cursor-pointer" onClick={openMenuHandler}>
                  <div className="mx-2">{decodedData.user.username}</div>
                  <AccountCircleIcon />
                </div>
              </div>
            </>
          </>
        ) : (
          <div>
            {pathname === '/register' ? <div onClick={() => router.push('/login')} className="cursor-pointer">Login</div> :
              <div onClick={() => router.push('/register')} className="cursor-pointer">Register</div>}
          </div>
        )}
      </div>
      <div className={`w-1/2 sm:w-1/5 absolute right-0 bg-gray-600 text-white border-none transition-all ease-in-out max-h-0 overflow-hidden ${menuOpened && 'max-h-40'}`}>
        <ul>
          <div className={menuItemStyle} onClick={() => router.push('/post/add')}>
            <AddCircleIcon sx={menuIconStyle} />
            <li>Add new post</li>
          </div>
          <div className={menuItemStyle} onClick={() => router.push('/profile')}>
            <Person2Icon sx={menuIconStyle} />
            <li>Profile</li>
          </div>
          <div className={menuItemStyle} onClick={() => logout()}>
            <LogoutIcon sx={menuIconStyle} />
            <li>Logout</li>
          </div>
        </ul>
      </div >
    </>
  )
}