"use client"

import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function User({ user }) {

    return (
        <div className="bg-white p-4 rounded-xl mt-4">
            <div className='flex'>
                <AccountCircleIcon />
                <div className="font-bold mx-2">{user.username}</div>
            </div>
            <div className="text-gray-400">{user.email}</div>
        </div>
    )
}