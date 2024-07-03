"use client"

import Post from "./Post";
import User from "./User";

export default function UsersList({ users }) {
    return (
        <div>
            {users.map((user) => (
                <User user={user} key={user.id} />
            ))}
        </div>
    )
}