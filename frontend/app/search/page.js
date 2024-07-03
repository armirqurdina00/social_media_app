"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchPage() {

    const [userSearch, setUserSearch] = useState('')
    const router = useRouter()
    const pathname = usePathname();

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
                const users = await getUsers(token, user)
                setUsers(users)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [])


    return (
        <div className="sm:w-[400px] w-[300px] mx-auto my-4">
            <div className="flex">
                <input type="text" className="text-black py-2 px-4 rounded-xl sm:w-[400px] w-[200px] bg-white" value={userSearch} placeholder="Press enter to search users" onChange={handleOnChangeUserSearch} onKeyDown={handleKeyPress} />
            </div>
        </div>
    );
}