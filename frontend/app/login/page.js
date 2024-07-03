"use client"

import { useEffect, useState } from "react";
import LoginForm from "../components/LoginForm";
import { useRouter } from 'next/navigation'
import { useToken } from "../TokenContext";
import { backendHost } from '../constants'


export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { token, login } = useToken();

    const router = useRouter()

    useEffect(() => {
        if (token) router.push('/')
    }, [])

    async function loginUser() {
        const res = await fetch(`${backendHost}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'username': username,
                'password': password
            }),
        })
            .then(response => response.json())
            .then((data) => {
                login(data.token)
                router.push('/')
            })
            .catch((error) => {
                setError("Invalid credentials")
            })

    }

    return (
        <div>
            <div className="flex justify-center">
                <LoginForm username={username} setUsername={setUsername} password={password} setPassword={setPassword} loginUser={loginUser} />
            </div>
            {error && <div className="text-center text-red-600 font-bold mt-2">{error}</div>}
        </div>
    );
}