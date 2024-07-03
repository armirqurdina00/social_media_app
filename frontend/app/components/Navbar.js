"use client"

import { usePathname, useRouter } from "next/navigation";
import { useToken } from "../TokenContext"
import { jwtDecode } from 'jwt-decode';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function Navbar() {

  const { token, logout } = useToken();
  const router = useRouter()
  const pathname = usePathname();

  let decodedData = {}

  if (token) decodedData = jwtDecode(token);

  return (
    <>
      <div className={`p-2 h-14 px-4 bg-gray-800 text-white flex ${token ? 'justify-between' : 'justify-end'} items-center`}>
        {token ? (
          <>
            <div className="flex">
              <div onClick={() => router.push('/')} className="cursor-pointer">Posts</div>
              <div className="mx-2 cursor-pointer" onClick={() => router.push('/users')}>Users</div>
            </div>
            <>
              <div className="flex">
                <div onClick={() => logout()} className="cursor-pointer">Logout</div>
                <div className="flex cursor-pointer" onClick={() => router.push('/profile')}>
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
    </>
  )
}