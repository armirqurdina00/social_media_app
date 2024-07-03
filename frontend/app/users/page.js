"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import UsersList from "../components/UsersList";
import { useToken } from "../TokenContext";
import { backendHost } from "../constants";

async function getUsers(token) {
    const res = await fetch(`${backendHost}/users`, {
        headers: { Authorization: token },
        next: {
            revalidate: 0
        }
    })

    return res.json()
}

async function getSearchUsers(token, user) {
    const res = await fetch(`${backendHost}/user-search?user=${user}`, {
        headers: {
            Authorization: token,
        },
    })

    return res.json()
}

export default function SearchPage() {

    const [users, setUsers] = useState([])
    const [userSearch, setUserSearch] = useState('')
    const router = useRouter()
    const pathname = usePathname();
    const { token } = useToken();

    useEffect(() => {
        setUserSearch('')
    }, [pathname])

    const handleOnChangeUserSearch = (e) => {
        setUserSearch(e.target.value)
    }

    const handleUserSearch = () => {
        if (userSearch === '') {
            alert('Please enter something')
            return
        }
        router.push(`/search/${userSearch}`);
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter") return handleUserSearch()
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const users = await getUsers(token)
                setUsers(users)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const users = await getSearchUsers(token, userSearch)
                setUsers(users)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [userSearch])

    return (
        <div className="sm:w-[400px] w-[300px] mx-auto my-4">
            <h1 className="text-xl text-center my-4">Users</h1>
            <div className="flex">
                <input
                    type="text"
                    className="text-black py-2 px-4 rounded-xl sm:w-[400px] w-[100%] bg-white"
                    value={userSearch}
                    placeholder="Search user"
                    onChange={handleOnChangeUserSearch}
                    onKeyUp={handleKeyPress} />
            </div>
            {users && <UsersList users={users} />}
        </div>
    );
}