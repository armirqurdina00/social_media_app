"use client"

import { useToken } from "@/app/TokenContext";
import UsersList from "@/app/components/UsersList";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { backendHost } from '../../constants'

async function getUsers(token, user) {
    const res = await fetch(`${backendHost}/user-search?user=${user}`, {
        headers: {
            Authorization: token,
        },
    })

    return res.json()
}

export default function Search({ params }) {

    const { token } = useToken();
    const router = useRouter();

    if (!token) router.push('/login')

    const [users, setUsers] = useState([])

    const user = params.user

    useEffect(() => {
        const fetchData = async () => {
            try {
                const users = await getUsers(token, user)
                setUsers(users)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [])


    return (
        <div className="w-[90%] sm:[400px] md:w-[600px] mx-auto my-4">
            <h1 className="text-xl text-center my-4">Users</h1>
            {users.length == 0 && <div className="text-center">No user found</div>}
            {users && <UsersList users={users} />}
        </div>
    );
}