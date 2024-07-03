"use client"

import { useEffect, useState } from "react";
import { useToken } from "../TokenContext"
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { backendHost } from '../constants'


async function getUserProfile(token) {
    const res = await fetch(`${backendHost}/profile`, {
        headers: { Authorization: token },
    })

    return res.json();
}

export default function Profile() {

    const router = useRouter();

    let decodedData = {}

    const { token, logout } = useToken();
    if (!token) router.push('/login')

    if (token) decodedData = jwtDecode(token);  

    const [newPassword, setNewPassword] = useState('')
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [updateSuccessConfirmation, setUpdateSuccessConfirmation] = useState(false)

    const [userProfile, setUserProfile] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getUserProfile(token)
                setUserProfile(userData.user)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [])

    async function updateUser() {
        if (userProfile.username === decodedData.user.username && userProfile.email === decodedData.user.email && newPassword == '') {
            return;
        } 
        const res = await fetch(`${backendHost}/profile/update`, {
            method: 'PUT',
            headers: {
                Authorization: token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'username': userProfile.username,
                'email': userProfile.email,
                'password': newPassword
            }),
        })

        if (res.ok) {
            setNewPassword('');
            setUpdateSuccessConfirmation(true)
        }
    }

    const handleDeleteUser = (e) => {
        e.preventDefault();
        setDeleteConfirmation(true)
    }

    async function deleteUser() {
        const res = await fetch(`${backendHost}/profile/delete`, {
            headers: { Authorization: token },
            method: 'DELETE',
        })

        if (res.ok) {
            logout();
            router.push('/login');
        }
    }

    const handleUserProfileChange = (e) => {
        let newUserProfile = {...userProfile}
        newUserProfile[e.target.name] = e.target.value;
        setUserProfile(newUserProfile)
    }

    const inputStyle = "block p-2 my-2 w-full"

    return (
        <div className="sm:w-[400px] w-[300px] mx-auto my-4">
            <h1 className="text-xl text-center my-4">Profile</h1>
            <input
                type="text"
                name="username"
                placeholder="Username"
                value={userProfile.username}
                onChange={handleUserProfileChange}
                className={inputStyle}
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={userProfile.email}
                onChange={handleUserProfileChange}
                className={inputStyle}
            />
            <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputStyle}
            />
            <button className="w-full bg-black text-white p-2 bg-cyan-800" onClick={() => updateUser()}>Update</button>
            <button className="w-full bg-red-500 text-white p-2 mt-2" onClick={handleDeleteUser}>Delete user</button>
            {deleteConfirmation && (
                <div>
                    <div className="text-center my-2">Are you sure you want to delete the user?</div>
                    <button className="w-full bg-red-800 text-white p-2" onClick={() => deleteUser()}>Confirm</button>
                </div>
            )}
            {updateSuccessConfirmation && (
                <div>
                    <div className="w-full bg-green-600 text-white text-center p-2 mt-2">User profile updated successfully</div>
                </div>
            )}
        </div>
    )
}