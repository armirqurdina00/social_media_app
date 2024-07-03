'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import { backendHost } from '../constants'

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    async function registerUser() {
        const res = await fetch(`${backendHost}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },            
            body: JSON.stringify({
                'username': username,
                'email': email,
                'password': password
            }),
        })
        if (res.ok) {
            router.push('/login')
        }
    }

    const inputStyle = "block p-2 my-2 w-full"

    return (
        <div className="w-[300px] mx-auto">
            <h1 className="text-xl text-center my-4">Register</h1>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputStyle}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputStyle}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputStyle}
            />
            <button className="w-full bg-black text-white p-2" onClick={() => registerUser()}>Register</button>
        </div>
    );
}